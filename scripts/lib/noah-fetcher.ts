/**
 * Reliable Scraper for Sound Studio NOAH Official Schedule API (/noahweb/Chart/schedule)
 * Executes within an authenticated browser context with existing cookies.
 * Seamlessly resolves login-required studios (chart_login_required_flg: 1).
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { format, addDays, startOfWeek } from 'date-fns';

export interface NoahSlot {
  id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED';
  price?: number;
}

export interface NoahRoomData {
  id: string;
  studioId: number;
  name: string;
  offset: number;
  slots: NoahSlot[];
}

export const NOAH_AKIBA_ROOM_MAP: { id: string; studioId: number; name: string; offset: number }[] = [
  { id: 'noah-akiba-A1st', studioId: 222, name: 'A1st (8帖)', offset: 0 },
  { id: 'noah-akiba-A2st', studioId: 223, name: 'A2st (8帖)', offset: 0 },
  { id: 'noah-akiba-A3st', studioId: 224, name: 'A3st (9帖)', offset: 30 },
  { id: 'noah-akiba-B1st', studioId: 229, name: 'B1st (14帖)', offset: 0 },
  { id: 'noah-akiba-B2st', studioId: 230, name: 'B2st (13帖)', offset: 30 },
  { id: 'noah-akiba-Cst+Sub', studioId: 233, name: 'Cst+Sub (28帖)', offset: 30 },
  { id: 'noah-akiba-E1st', studioId: 231, name: 'E1st (21帖)', offset: 0 },
  { id: 'noah-akiba-E2st', studioId: 232, name: 'E2st (20帖)', offset: 30 },
  { id: 'noah-akiba-G1st', studioId: 225, name: 'G1st (12帖)', offset: 0 },
  { id: 'noah-akiba-GSst', studioId: 227, name: 'GSst (10帖)', offset: 30 },
  { id: 'noah-akiba-Booth1', studioId: 234, name: 'Booth1 (3帖)', offset: 30 },
];

/**
 * Fetches 21 days of availability slots for Noah Akihabara rooms.
 */
export async function fetchNoahAkibaDays(
  baseDate: Date = new Date(),
  dayCount: number = 21
): Promise<NoahRoomData[]> {
  console.log(`📡 [NOAH Akiba] サウンドスタジオノア秋葉原店のリアル空き枠を取得中 (${dayCount}日間)...`);

  const storageStatePath = path.resolve(process.cwd(), 'storageState.json');
  if (!fs.existsSync(storageStatePath)) {
    throw new Error('storageState.json が存在しません。ノアの認証セッションが必要です。');
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: storageStatePath,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    // Navigate to Akiba chart page to establish proper session context
    await page.goto('https://www.studionoah.jp/noahweb/webs/chart/akihabara/', { waitUntil: 'networkidle', timeout: 30000 });

    const startMonday = startOfWeek(baseDate, { weekStartsOn: 1 });
    const mondays: string[] = [
      format(startMonday, 'yyyy/MM/dd'),
      format(addDays(startMonday, 7), 'yyyy/MM/dd'),
      format(addDays(startMonday, 14), 'yyyy/MM/dd')
    ];
    if (dayCount > 21) {
      mondays.push(format(addDays(startMonday, 21), 'yyyy/MM/dd'));
    }

    const rawData = await page.evaluate(async ({ studios, mondays }) => {
      const data: Record<number, any[]> = {};
      for (const st of studios) {
        data[st.studioId] = [];
        for (const m of mondays) {
          try {
            const res = await fetch(`/noahweb/Chart/schedule?studio_id=${st.studioId}&searchdate=${encodeURIComponent(m)}`, {
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json, text/javascript, */*; q=0.01'
              }
            });
            const json = await res.json();
            data[st.studioId].push(json);
          } catch (e: any) {
            data[st.studioId].push({ error: e.message });
          }
        }
      }
      return data;
    }, { studios: NOAH_AKIBA_ROOM_MAP, mondays });

    // Target dates list (ISO format)
    const targetDateStrings: string[] = [];
    for (let i = 0; i < dayCount; i++) {
      targetDateStrings.push(format(addDays(baseDate, i), 'yyyy-MM-dd'));
    }

    const results: NoahRoomData[] = [];

    for (const room of NOAH_AKIBA_ROOM_MAP) {
      const weeks = rawData[room.studioId] || [];
      const roomSlotsMap: Record<string, NoahSlot> = {};

      for (const weekData of weeks) {
        if (!weekData.date || !Array.isArray(weekData.date)) continue;

        for (const dayEntry of weekData.date) {
          const dateIso = dayEntry.date.replace(/\//g, '-');
          if (!dayEntry.time || !Array.isArray(dayEntry.time)) continue;

          for (const timeSlot of dayEntry.time) {
            const startTimeStr = timeSlot.start_time; // "HH:mm"
            const endTimeStr = timeSlot.end_time;     // "HH:mm"

            const startIso = `${dateIso}T${startTimeStr}:00+09:00`;
            let endIso: string;
            const [sH] = startTimeStr.split(':').map(Number);
            const [eH] = endTimeStr.split(':').map(Number);
            if (eH < sH || (eH === 0 && sH >= 23)) {
              const nextDayIso = format(addDays(new Date(dateIso), 1), 'yyyy-MM-dd');
              endIso = `${nextDayIso}T${endTimeStr}:00+09:00`;
            } else {
              endIso = `${dateIso}T${endTimeStr}:00+09:00`;
            }

            const isBooked = Boolean(timeSlot.is_booked);
            const isBookable = Boolean(timeSlot.is_bookable || timeSlot.web_reserve_flg || timeSlot.has_price);
            const status: 'AVAILABLE' | 'BOOKED' = (!isBooked && isBookable) ? 'AVAILABLE' : 'BOOKED';

            const timeKey = `${dateIso.replace(/-/g, '')}-${startTimeStr.replace(':', '')}`;
            const slotId = `slot-${room.id}-${timeKey}`;

            roomSlotsMap[timeKey] = {
              id: slotId,
              start_time: startIso,
              end_time: endIso,
              status: status
            };
          }
        }
      }

      const filteredSlots = Object.values(roomSlotsMap).filter(s => {
        const slotDate = s.start_time.substring(0, 10);
        return targetDateStrings.includes(slotDate);
      });

      filteredSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));

      results.push({
        id: room.id,
        studioId: room.studioId,
        name: room.name,
        offset: room.offset,
        slots: filteredSlots
      });

      console.log(`  ✅ [NOAH] ${room.name}: ${filteredSlots.length} スロット取得完了`);
    }

    return results;
  } finally {
    await browser.close();
  }
}
