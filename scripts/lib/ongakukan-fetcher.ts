/**
 * Pure Node fetch scraper for Studio Ongakukan (ajg.jp system)
 * Accurately determines studio-specific availability using ReservationStaff.php
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
 * Parses store-wide calendar to find candidate time slots where at least one room is available (○)
 */
function parseStoreWideCalendar(html: string): { dates: string[]; openSlotsByDateAndHour: Record<string, Record<number, boolean>> } {
  const trs = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  if (trs.length < 3) {
    return { dates: [], openSlotsByDateAndHour: {} };
  }

  const row0Text = trs[0][1].replace(/<[^>]+>/g, ' ');
  const yearMonthMatch = row0Text.match(/(\d{4})年(\d{1,2})月/);
  const currentYear = yearMonthMatch ? parseInt(yearMonthMatch[1], 10) : new Date().getFullYear();
  let currentMonth = yearMonthMatch ? parseInt(yearMonthMatch[2], 10) : new Date().getMonth() + 1;

  const dateCells = [...trs[1][1].matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)]
    .map(c => c[1].replace(/<[^>]+>/g, '').trim())
    .filter(c => c.length > 0);

  const parsedDates: string[] = [];
  let prevDayNum = 0;

  for (const cell of dateCells) {
    const dayMatch = cell.match(/^(\d{1,2})/);
    if (dayMatch) {
      const dayNum = parseInt(dayMatch[1], 10);
      if (prevDayNum > 0 && dayNum < prevDayNum) {
        currentMonth++;
      }
      prevDayNum = dayNum;

      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      parsedDates.push(dateStr);
    }
  }

  const openSlotsByDateAndHour: Record<string, Record<number, boolean>> = {};
  parsedDates.forEach(d => {
    openSlotsByDateAndHour[d] = {};
  });

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

      // If '○' or link to ReservationStaff.php exists, at least 1 room is open
      const isOpen = cellText.includes('○') || cellHtml.includes('ReservationStaff.php');
      openSlotsByDateAndHour[dateStr][hour] = isOpen;
    }
  }

  return { dates: parsedDates, openSlotsByDateAndHour };
}

/**
 * Fetches 21 days of accurate room-specific availability slots for Ongakukan Akiba.
 */
export async function fetchOngakukanAkibaDays(
  baseDate: Date = new Date(),
  dayCount: number = 21
): Promise<OngakukanRoomData[]> {
  console.log(`📡 [Ongakukan] 音楽館アキバ店のスタジオ別リアル空き枠を取得中 (ReservationStaff.php連携 / ${dayCount}日間)...`);

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

  // 1. 店舗全体カレンダーを取得（1回目: 14日分）
  const dateUrl1 = `https://www.ajg.jp/shop/ReservationDate.php?sescode=${sescode}&menuid=14`;
  const resDate1 = await fetch(dateUrl1, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookieHeader }
  });
  const htmlDate1 = await resDate1.text();
  const parsedCal1 = parseStoreWideCalendar(htmlDate1);

  // 2. 店舗全体カレンダーを取得（2回目: 3週目以降）
  const nextDayStr = format(addDays(baseDate, 14), 'yyyyMMdd');
  const dateUrl2 = `https://www.ajg.jp/shop/ReservationDate.php?sescode=${sescode}&menuid=14&theday=${nextDayStr}`;
  const resDate2 = await fetch(dateUrl2, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookieHeader }
  });
  const htmlDate2 = await resDate2.text();
  const parsedCal2 = parseStoreWideCalendar(htmlDate2);

  const mergedOpenSlots: Record<string, Record<number, boolean>> = {
    ...parsedCal1.openSlotsByDateAndHour,
    ...parsedCal2.openSlotsByDateAndHour,
  };

  // Target date strings
  const targetDateStrings: string[] = [];
  for (let i = 0; i < dayCount; i++) {
    targetDateStrings.push(format(addDays(baseDate, i), 'yyyy-MM-dd'));
  }

  // Identify all (date, hour) pairs that need studio resolution (i.e. where store is open '○')
  const slotsToResolve: { dateStr: string; dateYmd: string; hour: number; timeParam: string }[] = [];
  for (const dateStr of targetDateStrings) {
    const hoursMap = mergedOpenSlots[dateStr];
    if (!hoursMap) continue;

    const dateYmd = dateStr.replace(/-/g, '');
    for (let h = 0; h < 24; h++) {
      if (hoursMap[h] === true) {
        const timeParam = `${String(h).padStart(2, '0')}00`;
        slotsToResolve.push({ dateStr, dateYmd, hour: h, timeParam });
      }
    }
  }

  console.log(`  🔍 [Ongakukan] 検証対象: ${slotsToResolve.length} コマのスタジオ別空き判定を実行します...`);

  // Map to store available staffIds for each (dateStr, hour): Set<staffId>
  const openStaffIdsMap: Record<string, Record<number, Set<number>>> = {};
  targetDateStrings.forEach(d => {
    openStaffIdsMap[d] = {};
  });

  // Resolve with polite concurrency (4 requests in parallel)
  const CONCURRENCY = 4;
  for (let i = 0; i < slotsToResolve.length; i += CONCURRENCY) {
    const batch = slotsToResolve.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async item => {
        try {
          const staffUrl = `https://www.ajg.jp/shop/ReservationStaff.php?sescode=${sescode}&p=&date=${item.dateYmd}&time=${item.timeParam}`;
          const resStaff = await fetch(staffUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookieHeader }
          });
          const htmlStaff = await resStaff.text();

          const openIds = new Set<number>();
          const matches = [...htmlStaff.matchAll(/ReservationEnq\.php\?[^"']*staffid=(\d+)/gi)];
          matches.forEach(m => {
            openIds.add(parseInt(m[1], 10));
          });

          openStaffIdsMap[item.dateStr][item.hour] = openIds;
        } catch (e: any) {
          // On network error, treat as booked
          openStaffIdsMap[item.dateStr][item.hour] = new Set<number>();
        }
      })
    );

    // Polite jitter pause between batches
    if (i + CONCURRENCY < slotsToResolve.length) {
      await new Promise(r => setTimeout(r, 120));
    }
  }

  // Build final room slot objects
  const results: OngakukanRoomData[] = [];

  for (const room of ONGAKUKAN_AKIBA_ROOMS) {
    const slots: OngakukanSlot[] = [];

    for (const dateStr of targetDateStrings) {
      for (let h = 0; h < 24; h++) {
        const availableStaffSet = openStaffIdsMap[dateStr]?.[h];
        // If the store is closed/full or this room's staffId is not in availableStaffSet, it's BOOKED
        const isAvailable = Boolean(availableStaffSet && availableStaffSet.has(room.staffId));
        const status: 'AVAILABLE' | 'BOOKED' = isAvailable ? 'AVAILABLE' : 'BOOKED';

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

    const availableCount = slots.filter(s => s.status === 'AVAILABLE').length;
    const bookedCount = slots.filter(s => s.status === 'BOOKED').length;
    console.log(`  ✅ [Ongakukan] ${room.name}: 計${slots.length}枠 (○空き: ${availableCount}, ×予約済: ${bookedCount})`);

    results.push({
      id: room.id,
      name: room.name,
      staffId: room.staffId,
      slots: slots
    });
  }

  return results;
}
