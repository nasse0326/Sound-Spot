/**
 * Lightweight Reserve1 (Reserve Mart ASP) Scraper using pure Node fetch.
 * Fully eliminates Playwright browser overhead.
 */
import { format, addDays } from 'date-fns';

export interface Reserve1RoomSlot {
  id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
  price?: number;
}

export interface Reserve1RoomData {
  id: string;
  rawName: string;
  name: string;
  slots: Reserve1RoomSlot[];
}

export interface Reserve1Config {
  name: string;
  loginUrl: string;
  grandValue?: string;
  roomSpecs?: Record<string, any>;
}

export async function fetchReserve1Days(
  config: Reserve1Config,
  baseDate: Date,
  dayCount: number = 14
): Promise<Reserve1RoomData[]> {
  console.log(`📡 [Reserve1] ${config.name} の高速取得（Node fetch / ${dayCount}日間）を開始...`);

  // 1. 初回訪問でセッションCookieとフォームパラメータを取得
  const res1 = await fetch(config.loginUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    }
  });

  const setCookies = (res1.headers as any).getSetCookie ? (res1.headers as any).getSetCookie() : [res1.headers.get('set-cookie') || ''];
  const cookieHeader = setCookies.map((c: string) => c.split(';')[0]).join('; ');
  const html1 = await res1.text();

  const formMatch = html1.match(/<form[^>]*name=["']form0["'][^>]*>([\s\S]*?)<\/form>/i);
  if (!formMatch) {
    throw new Error(`[Reserve1] ${config.name}: form0 が見つかりませんでした。`);
  }

  const formTag = html1.match(/<form[^>]*name=["']form0["'][^>]*>/i)![0];
  const inputs = [...formMatch[1].matchAll(/<input[^>]*name=["']([^"']+)["'][^>]*value=["']?([^"'>]*)["']?[^>]*>/gi)];
  const baseFormData = new URLSearchParams();
  for (const inp of inputs) {
    baseFormData.append(inp[1], inp[2] || '');
  }

  const selectMatches = [...formMatch[1].matchAll(/<select[^>]*name=["']([^"']+)["'][^>]*>([\s\S]*?)<\/select>/gi)];
  for (const sm of selectMatches) {
    const optMatch = sm[2].match(/<option[^>]*value=["']?([^"'>]*)["']?[^>]*selected/i);
    if (optMatch) {
      baseFormData.append(sm[1], optMatch[1]);
    } else {
      const firstOpt = sm[2].match(/<option[^>]*value=["']?([^"'>]*)["']?/i);
      if (firstOpt) baseFormData.append(sm[1], firstOpt[1]);
    }
  }

  if (config.grandValue) {
    baseFormData.set('grand', config.grandValue);
  }

  const actionMatch = formTag.match(/action=["']([^"']+)["']/i);
  const actionUrl = actionMatch
    ? new URL(actionMatch[1], config.loginUrl).href
    : 'https://www.reserve1.jp/studio/member/member_select.php';

  const roomMap: Record<string, { rawName: string; slots: Reserve1RoomSlot[] }> = {};
  const decoder = new TextDecoder('euc-jp');

  for (let d = 0; d < dayCount; d++) {
    const targetDate = format(addDays(baseDate, d), 'yyyy-MM-dd');
    const dayForm = new URLSearchParams(baseFormData);
    dayForm.set('day_btn', targetDate);

    try {
      const res = await fetch(actionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': cookieHeader,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': config.loginUrl,
        },
        body: dayForm.toString(),
      });

      if (!res.ok) {
        console.warn(`  ⚠️ [${config.name}] ${targetDate} HTTP ${res.status}`);
        continue;
      }

      const buffer = await res.arrayBuffer();
      const html = decoder.decode(buffer);

      const trMatches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];

      for (const tr of trMatches) {
        const rowHtml = tr[1];
        const cells = [...rowHtml.matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map(m => m[1]);
        if (cells.length < 3) continue;

        const firstCell = cells[0].replace(/<[^>]*>/g, '').trim();
        if (!firstCell.includes('st') && !firstCell.includes('SUBROOM')) continue;

        let currentHour = 9;
        let currentMin = 0;
        const slotCells = cells.slice(1, cells.length - 1);

        const matchKey = firstCell.match(/(\d+st)/) || firstCell.match(/([A-Za-z0-9]+st)/);
        const roomKey = matchKey ? matchKey[1] : firstCell;

        if (!roomMap[roomKey]) {
          roomMap[roomKey] = { rawName: firstCell, slots: [] };
        }

        for (const cellContent of slotCells) {
          const classMatch = cellContent.match(/class=["']([^"']+)["']/i);
          const className = classMatch ? classMatch[1] : '';

          let durationHours = 1;
          if (className.includes('koma_sp30')) {
            durationHours = 0.5;
          } else {
            const matchX = className.match(/_x(\d+)_/);
            if (matchX) durationHours = parseInt(matchX[1], 10);
          }

          const sh = currentHour;
          const sm = currentMin;
          const totalM = currentHour * 60 + currentMin + Math.round(durationHours * 60);
          currentHour = Math.floor(totalM / 60);
          currentMin = totalM % 60;

          if (className.includes('koma_sp30')) continue;

          const shStr = sh < 10 ? '0' + sh : '' + sh;
          const smStr = sm < 10 ? '0' + sm : '' + sm;
          const ehStr = currentHour < 10 ? '0' + currentHour : '' + currentHour;
          const emStr = currentMin < 10 ? '0' + currentMin : '' + currentMin;

          const startTimeIso = `${targetDate}T${shStr}:${smStr}:00+09:00`;
          const endTimeIso = `${targetDate}T${ehStr}:${emStr}:00+09:00`;

          const hasCheckbox = cellContent.includes('type="checkbox"') || cellContent.includes("type='checkbox'");
          const isDisabled = cellContent.includes('disabled');

          if (hasCheckbox && !isDisabled) {
            roomMap[roomKey].slots.push({
              id: `slot-${roomKey}-${targetDate}-${shStr}${smStr}`,
              start_time: startTimeIso,
              end_time: endTimeIso,
              status: 'AVAILABLE',
            });
          } else {
            for (let h = 0; h < durationHours; h++) {
              const bStartH = sh + h;
              const bEndH = bStartH + 1;
              const bshStr = bStartH < 10 ? '0' + bStartH : '' + bStartH;
              const behStr = bEndH < 10 ? '0' + bEndH : '' + bEndH;
              roomMap[roomKey].slots.push({
                id: `slot-${roomKey}-${targetDate}-${bshStr}${smStr}`,
                start_time: `${targetDate}T${bshStr}:${smStr}:00+09:00`,
                end_time: `${targetDate}T${behStr}:${smStr}:00+09:00`,
                status: 'BOOKED',
              });
            }
          }
        }
      }

      // 礼儀正しいウェイト（50ms）
      await new Promise(r => setTimeout(r, 50));
    } catch (err: any) {
      console.error(`  ❌ [${config.name}] ${targetDate} 取得エラー:`, err.message);
    }
  }

  const result: Reserve1RoomData[] = Object.entries(roomMap).map(([key, data]) => ({
    id: key,
    rawName: data.rawName,
    name: config.roomSpecs?.[key]?.name || data.rawName,
    slots: data.slots,
  }));

  console.log(`  ✅ [Reserve1] ${config.name}: ${result.length}部屋、計${result.reduce((a, b) => a + b.slots.length, 0)}スロット取得完了`);
  return result;
}
