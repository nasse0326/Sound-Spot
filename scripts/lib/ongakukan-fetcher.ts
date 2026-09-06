/**
 * Pure Node fetch scraper for Studio Ongakukan (ajg.jp system)
 * Playwright-free, highly lightweight and fast.
 */
import { format, addDays, parse } from 'date-fns';

export interface OngakukanSlot {
  id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED';
  price?: number;
}

export interface OngakukanRoomData {
  id: string;
  name: string;
  staffId: number;
  slots: OngakukanSlot[];
}

export const ONGAKUKAN_AKIBA_ROOMS: { id: string; name: string; staffId: number }[] = [
  { id: 'og-akiba-Aスタジオ', name: 'Aスタジオ (6帖)', staffId: 1 },
  { id: 'og-akiba-Bスタジオ', name: 'Bスタジオ (15帖)', staffId: 12 },
  { id: 'og-akiba-Cスタジオ', name: 'Cスタジオ (9帖)', staffId: 7 },
  { id: 'og-akiba-Dスタジオ', name: 'Dスタジオ (8帖)', staffId: 6 },
  { id: 'og-akiba-Eスタジオ', name: 'Eスタジオ (7帖)', staffId: 2 },
  { id: 'og-akiba-Gスタジオ', name: 'Gスタジオ (12帖)', staffId: 8 },
  { id: 'og-akiba-Music Innスタジオ', name: 'Music Innスタジオ (50帖)', staffId: 13 },
];

/**
 * Parses a 14-day schedule table from ajg.jp ReservationDate.php
 */
function parseScheduleHtml(html: string): { dates: string[]; slotsByDateAndHour: Record<string, Record<number, 'AVAILABLE' | 'BOOKED'>> } {
  const trs = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  if (trs.length < 3) {
    return { dates: [], slotsByDateAndHour: {} };
  }

  // Row 0 usually contains year/month like "2026年9月"
  const row0Text = trs[0][1].replace(/<[^>]+>/g, ' ');
  const yearMonthMatch = row0Text.match(/(\d{4})年(\d{1,2})月/);
  const currentYear = yearMonthMatch ? parseInt(yearMonthMatch[1], 10) : new Date().getFullYear();
  let currentMonth = yearMonthMatch ? parseInt(yearMonthMatch[2], 10) : new Date().getMonth() + 1;

  // Row 1 contains dates: e.g. "7 (月)", "8 (火)", ...
  const dateCells = [...trs[1][1].matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)]
    .map(c => c[1].replace(/<[^>]+>/g, '').trim())
    .filter(c => c.length > 0);

  const parsedDates: string[] = [];
  let prevDayNum = 0;

  for (const cell of dateCells) {
    const dayMatch = cell.match(/^(\d{1,2})/);
    if (dayMatch) {
      const dayNum = parseInt(dayMatch[1], 10);
      // Month rollover (e.g. 31 -> 1)
      if (prevDayNum > 0 && dayNum < prevDayNum) {
        currentMonth++;
      }
      prevDayNum = dayNum;

      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      parsedDates.push(dateStr);
    }
  }

  const slotsByDateAndHour: Record<string, Record<number, 'AVAILABLE' | 'BOOKED'>> = {};
  parsedDates.forEach(d => {
    slotsByDateAndHour[d] = {};
  });

  // Rows 2 onwards are hourly rows: "0:00", "1:00", ... "23:00"
  for (let r = 2; r < trs.length; r++) {
    const rowContent = trs[r][1];
    const cells = [...rowContent.matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)]
      .map(c => c[1].trim());

    if (cells.length < parsedDates.length + 1) continue;

    const timeText = cells[0].replace(/<[^>]+>/g, '').trim();
    const timeMatch = timeText.match(/^(\d{1,2}):(\d{2})/);
    if (!timeMatch) continue;

    const hour = parseInt(timeMatch[1], 10);

    for (let c = 0; c < parsedDates.length; c++) {
      const dateStr = parsedDates[c];
      const cellHtml = cells[c + 1];
      const cellText = cellHtml.replace(/<[^>]+>/g, '').trim();

      if (cellText.includes('○') || cellHtml.includes('ReservationStaff.php')) {
        slotsByDateAndHour[dateStr][hour] = 'AVAILABLE';
      } else {
        slotsByDateAndHour[dateStr][hour] = 'BOOKED';
      }
    }
  }

  return { dates: parsedDates, slotsByDateAndHour };
}

/**
 * Fetches 21 days of availability slots for all Ongakukan Akiba rooms.
 */
export async function fetchOngakukanAkibaDays(
  baseDate: Date = new Date(),
  dayCount: number = 21
): Promise<OngakukanRoomData[]> {
  console.log(`📡 [Ongakukan] 音楽館アキバ店のリアル空き枠を取得中 (Node fetch / ${dayCount}日間)...`);

  const topUrl = 'https://www.ajg.jp/shop/ReservationTop.php?id=Twb03vvjqn2fba1';
  const resTop = await fetch(topUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    }
  });

  const cookieHeader = resTop.headers.get('set-cookie')?.split(';')[0] || '';
  const topHtml = await resTop.text();
  const sesMatch = topHtml.match(/sescode=([a-zA-Z0-9]+)/);
  if (!sesMatch) {
    throw new Error('[Ongakukan] sescode の取得に失敗しました。');
  }
  const sescode = sesMatch[1];

  // Target dates list (ISO format)
  const targetDateStrings: string[] = [];
  for (let i = 0; i < dayCount; i++) {
    targetDateStrings.push(format(addDays(baseDate, i), 'yyyy-MM-dd'));
  }

  const results: OngakukanRoomData[] = [];

  for (const room of ONGAKUKAN_AKIBA_ROOMS) {
    try {
      // 1. Fetch first 14 days
      const url1 = `https://www.ajg.jp/shop/ReservationDate.php?sescode=${sescode}&menuid=14&staffid=${room.staffId}`;
      const res1 = await fetch(url1, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Cookie': cookieHeader
        }
      });
      const html1 = await res1.text();
      const parsed1 = parseScheduleHtml(html1);

      // 2. Fetch 2nd two weeks (covering up to 21+ days)
      const nextDayStr = format(addDays(baseDate, 14), 'yyyyMMdd');
      const url2 = `https://www.ajg.jp/shop/ReservationDate.php?sescode=${sescode}&menuid=14&staffid=${room.staffId}&theday=${nextDayStr}`;
      const res2 = await fetch(url2, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Cookie': cookieHeader
        }
      });
      const html2 = await res2.text();
      const parsed2 = parseScheduleHtml(html2);

      // Merge slot data
      const mergedSlotsByDateAndHour: Record<string, Record<number, 'AVAILABLE' | 'BOOKED'>> = {
        ...parsed1.slotsByDateAndHour,
        ...parsed2.slotsByDateAndHour
      };

      const slots: OngakukanSlot[] = [];

      for (const dateStr of targetDateStrings) {
        const hoursMap = mergedSlotsByDateAndHour[dateStr];
        if (!hoursMap) continue;

        for (let h = 0; h < 24; h++) {
          const status = hoursMap[h] || 'BOOKED';
          const startIso = `${dateStr}T${String(h).padStart(2, '0')}:00:00+09:00`;
          const nextHour = h + 1;
          const endIso = nextHour === 24
            ? `${format(addDays(parse(dateStr, 'yyyy-MM-dd', new Date()), 1), 'yyyy-MM-dd')}T00:00:00+09:00`
            : `${dateStr}T${String(nextHour).padStart(2, '0')}:00:00+09:00`;

          const timeKey = `${dateStr.replace(/-/g, '')}-${String(h).padStart(2, '0')}00`;
          slots.push({
            id: `slot-${room.id}-${timeKey}`,
            start_time: startIso,
            end_time: endIso,
            status: status
          });
        }
      }

      results.push({
        id: room.id,
        name: room.name,
        staffId: room.staffId,
        slots: slots
      });

      console.log(`  ✅ [Ongakukan] ${room.name}: ${slots.length} スロット取得完了`);
    } catch (err: any) {
      console.error(`  ❌ [Ongakukan] ${room.name} 取得失敗: ${err.message}`);
    }
  }

  return results;
}
