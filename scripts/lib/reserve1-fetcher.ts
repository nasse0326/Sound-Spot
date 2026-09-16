/**
 * Lightweight Reserve1 (Reserve Mart ASP) Scraper using pure Node fetch.
 * Fully eliminates Playwright browser overhead.
 */
import { format, addDays } from 'date-fns';
import { toIsoWithRollover } from './time-utils';

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
  /**
   * カレンダー表の最初の列が何時始まりか（店舗により異なり、9時とは限らない）。
   * 過去にSTUDIO GOODMAN AKIBAでこれを省略した結果、実際は10時始まりのカレンダーを
   * 9時始まりとして扱ってしまい、全スロットの時刻が1時間ズレる不具合が発生した。
   * 同じ事故を防ぐため、新規追加時は必ず実カレンダーを目視確認の上で明示指定すること
   * （安全に見える既定値は用意しない）。
   */
  openHour: number;
}

/**
 * 全角英数字を半角に変換する（Reserve1の一部店舗は部屋ラベルを全角で出力するため）。
 */
function toHalfWidth(s: string): string {
  return s.replace(/[０-９Ａ-Ｚａ-ｚ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
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
      // <select>にselected指定が無い場合、先頭のoptionを暗黙に採用する。
      // 通常は無害だが、店舗によっては複数拠点/複数フロアを束ねる分岐select
      // （grand等）がこの経路に依存していることがあり、サイト側のHTML構造が
      // 変わると気づかないまま別の拠点/カレンダーを取得してしまう恐れがある。
      // 挙動は変えず、せめてログで気づけるようにしておく。
      const firstOpt = sm[2].match(/<option[^>]*value=["']?([^"'>]*)["']?/i);
      if (firstOpt) {
        console.warn(`  ⚠️ [Reserve1] ${config.name}: <select name="${sm[1]}"> にselected指定が無く、先頭のoption(value="${firstOpt[1]}")を暗黙採用しました。サイト側の変更で意図しない値になっていないか確認してください。`);
        baseFormData.append(sm[1], firstOpt[1]);
      }
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

      // 店舗（実際にはテンプレート）によって、1マスが表す実時間の幅が異なる
      // （渋谷/高田馬場ゲートウェイ=1マス60分、GOODMAN AKIBA=1マス30分、等）。
      // ヘッダー行の全角コロン付き時刻ラベル（例:「10：00」「10：30」）を先頭から2つ拾い、
      // その差分から実際のマス幅を都度検出する。決め打ちの60分だと、30分刻みテンプレートの
      // 店舗で全スロットの時刻が縮尺違いのままズレて記録されてしまう（GOODMAN AKIBAで実際に発生）。
      const headerTimeMatches = [...html.matchAll(/(\d{1,2})：(\d{2})/g)];
      let columnMinutes = 60;
      if (headerTimeMatches.length >= 3) {
        const toMin = (m: RegExpMatchArray) => parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
        const diff = toMin(headerTimeMatches[2]) - toMin(headerTimeMatches[0]);
        if (diff > 0 && diff <= 60) columnMinutes = diff;
      }

      const trMatches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];

      for (const tr of trMatches) {
        const rowHtml = tr[1];
        // タグ自身が持つ属性（class・colspan等）とセル内部のHTMLの両方を保持する。
        // 渋谷/高田馬場ゲートウェイはclassをセル内部の<div>にも複製しているため内部HTMLだけで
        // 判定できていたが、GOODMAN AKIBAは<td class="..." colspan="...">のように<td>自身に
        // class/colspanを持たせる構造で、内部HTMLしか見ていないとこれらを一切検出できなかった。
        const cellMatches = [...rowHtml.matchAll(/<(?:td|th)([^>]*)>([\s\S]*?)<\/(?:td|th)>/gi)];
        const cells = cellMatches.map(m => m[2]);
        const cellAttrs = cellMatches.map(m => m[1]);
        if (cells.length < 3) continue;

        const firstCell = cells[0].replace(/<[^>]*>/g, '').trim();

        // 従来形式（渋谷/秋葉原ゲートウェイ・GOODMAN等）: "1st", "2st" のように末尾が st
        const stMatch = firstCell.match(/(\d+st)/) || firstCell.match(/([A-Za-z0-9]+st)/);
        // 高田馬場3号店等の新形式: "２階／２B（１０畳）00分～" や "５C／ツインドラム45分～" のように
        // 全角の「部屋番号+アルファベット」コードが部屋名の先頭付近に含まれる
        const codeMatch = firstCell.match(/([0-9０-９]+[A-Za-zＡ-Ｚａ-ｚ])/);

        if (!stMatch && !codeMatch && !firstCell.includes('SUBROOM')) continue;

        let currentHour = config.openHour;
        let currentMin = 0;
        const slotCells = cells.slice(1, cells.length - 1);
        const slotAttrs = cellAttrs.slice(1, cellAttrs.length - 1);

        const roomKey = stMatch ? stMatch[1] : (codeMatch ? toHalfWidth(codeMatch[1]).toUpperCase() : firstCell);

        if (!roomMap[roomKey]) {
          roomMap[roomKey] = { rawName: firstCell, slots: [] };
        }

        // Pass 1: 実際のマス幅（columnMinutes）通りに、この行の生ステータスを
        // 細かい粒度のまま区間として集める（フィラーセルは時刻を進めるだけでスキップ）。
        // 1マス=60分のテンプレート（渋谷/高田馬場ゲートウェイ）ではこれが従来通りそのまま
        // 1時間ごとの区間になるが、1マス=30分のGOODMAN AKIBAではまず30分単位の区間になる。
        const segments: { startMin: number; endMin: number; available: boolean }[] = [];

        for (let cellIdx = 0; cellIdx < slotCells.length; cellIdx++) {
          const cellContent = slotCells[cellIdx];
          const attrs = slotAttrs[cellIdx];
          // classは<td>自身に付く店舗（GOODMAN AKIBA等）とセル内部の<div>に付く店舗
          // （渋谷/高田馬場ゲートウェイ等）の両方があるため、両方から探す。
          const classMatch = (attrs + ' ' + cellContent).match(/class=["']([^"']+)["']/i);
          const className = classMatch ? classMatch[1] : '';

          // koma_spN: 部屋ごとの開始オフセット調整用の端数（N分）フィラーセル。
          // 高田馬場3号店ではkoma_sp15（15分開始）等、30分以外の端数も使われるため、
          // 30分決め打ちではなく一般化してNをそのまま読み取る。この値は常に「分」単位の
          // 実時間なので、マス幅（columnMinutes）に関わらずそのまま使う。
          let durationHours = 1;
          const spMatch = className.match(/koma_sp(\d+)/);
          const isFillerCell = Boolean(spMatch);
          if (isFillerCell) {
            durationHours = parseInt(spMatch![1], 10) / 60;
          } else {
            // マス連結幅は店舗（テンプレート）により表現方法が異なる:
            // ・渋谷/高田馬場ゲートウェイ: class名に埋め込み（例: koma_03_x3_stt → 3マス分）
            // ・GOODMAN AKIBA: <td>自身のcolspan属性（例: colspan="4" → 4マス分）
            // どちらの経路で来ても「実際に何マス分か」を求めた上でcolumnMinutesを掛ける。
            const matchX = className.match(/_x(\d+)_/);
            const colspanMatch = attrs.match(/colspan=["']?(\d+)["']?/i);
            const spanColumns = matchX ? parseInt(matchX[1], 10) : (colspanMatch ? parseInt(colspanMatch[1], 10) : 1);
            durationHours = (spanColumns * columnMinutes) / 60;
          }

          const startMin = currentHour * 60 + currentMin;
          const totalM = startMin + Math.round(durationHours * 60);
          currentHour = Math.floor(totalM / 60);
          currentMin = totalM % 60;

          if (isFillerCell) continue;

          const hasCheckbox = cellContent.includes('type="checkbox"') || cellContent.includes("type='checkbox'");
          const isDisabled = cellContent.includes('disabled');

          segments.push({ startMin, endMin: totalM, available: hasCheckbox && !isDisabled });
        }

        // Pass 2: 集めた区間を、実際の予約単位である「1時間」ごとのスロットに集約する
        // （タイムライン表示・部屋の開始オフセットは1時間単位を前提にしているため）。
        // 1マス=60分のテンプレートではこの集約はそのまま1区間=1スロットになるだけで
        // 従来と同じ結果になるが、1マス=30分のGOODMAN AKIBAのように1時間の前半だけ
        // 予約済みで後半が空き（あるいはその逆）という区間がある場合は、その1時間全体を
        // 「予約済み」として扱う（半分だけ空いていても、その1時間丸ごとの新規予約はできないため）。
        if (segments.length > 0) {
          const rowStartMin = segments[0].startMin;
          const rowEndMin = segments[segments.length - 1].endMin;
          for (let bStart = rowStartMin; bStart < rowEndMin; bStart += 60) {
            const bEnd = bStart + 60;
            const overlapping = segments.filter(s => s.startMin < bEnd && s.endMin > bStart);
            if (overlapping.length === 0) continue;
            const coverageStart = Math.min(...overlapping.map(s => s.startMin));
            const coverageEnd = Math.max(...overlapping.map(s => s.endMin));
            const fullyAvailable = coverageStart <= bStart && coverageEnd >= bEnd && overlapping.every(s => s.available);

            const bStartH = Math.floor(bStart / 60);
            const bStartM = bStart % 60;
            const bEndH = Math.floor(bEnd / 60);
            const bEndM = bEnd % 60;
            const bshStr = (bStartH % 24) < 10 ? '0' + (bStartH % 24) : '' + (bStartH % 24);
            const bsmStr = bStartM < 10 ? '0' + bStartM : '' + bStartM;

            roomMap[roomKey].slots.push({
              id: `slot-${roomKey}-${targetDate}-${bshStr}${bsmStr}`,
              start_time: toIsoWithRollover(targetDate, bStartH, bStartM),
              end_time: toIsoWithRollover(targetDate, bEndH, bEndM),
              status: fullyAvailable ? 'AVAILABLE' : 'BOOKED',
            });
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
