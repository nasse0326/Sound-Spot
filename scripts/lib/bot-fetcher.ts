/**
 * Lightweight BASS ON TOP (studi-ol.com) Scraper using pure Node fetch.
 * Fully eliminates Playwright browser overhead.
 */
import { format, addDays } from 'date-fns';

export interface BotRoomSlot {
  id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
  price?: number;
}

export interface BotRoomData {
  id: string;
  name: string;
  size_sqm: number;
  capacity: number;
  hourly_rate: number;
  day_rate?: number;
  night_rate?: number;
  individual_rate: number;
  features: string[];
  start_time_offset: number;
  slots: BotRoomSlot[];
}

const BOT_AKIBA_ROOMS = [
  { id: 'bot-akiba-3105', roomIdNum: 3105, name: '1st (17帖)', size_sqm: 28, capacity: 7, hourly_rate: 3600, day_rate: 2650, individual_rate: 880, start_time_offset: 0, features: ['Marshall JCM2000', 'Roland JC-120', 'Ampeg SVT', 'Pearl Drums', '15帖以上', 'セルフレコ対応'] },
  { id: 'bot-akiba-3106', roomIdNum: 3106, name: '2st (9帖)', size_sqm: 15, capacity: 4, hourly_rate: 2800, day_rate: 2150, individual_rate: 880, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT', 'Pearl Drums'] },
  { id: 'bot-akiba-3107', roomIdNum: 3107, name: '3st (9帖)', size_sqm: 15, capacity: 4, hourly_rate: 2800, day_rate: 2150, individual_rate: 880, start_time_offset: 0, features: ['Marshall DSL100H', 'Roland JC-120', 'Ampeg SVT', 'Pearl Drums'] },
  { id: 'bot-akiba-3108', roomIdNum: 3108, name: '4st (15帖)', size_sqm: 25, capacity: 6, hourly_rate: 3600, day_rate: 2650, individual_rate: 880, start_time_offset: 0, features: ['Marshall JVM210H', 'Roland JC-120', 'Ampeg SVT', 'Pearl Drums', '15帖以上'] },
  { id: 'bot-akiba-3109', roomIdNum: 3109, name: '5st (15帖)', size_sqm: 25, capacity: 6, hourly_rate: 3600, day_rate: 2650, individual_rate: 880, start_time_offset: 30, features: ['Marshall JCM2000', 'Roland JC-120', 'Ampeg SVT', 'Pearl Drums', '30分スタート', '15帖以上'] },
  { id: 'bot-akiba-3110', roomIdNum: 3110, name: '6st (9帖)', size_sqm: 15, capacity: 4, hourly_rate: 2800, day_rate: 2150, individual_rate: 880, start_time_offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Hartke 3500', 'Pearl Drums', '30分スタート'] },
  { id: 'bot-akiba-3111', roomIdNum: 3111, name: '7st (7帖)', size_sqm: 12, capacity: 3, hourly_rate: 2200, day_rate: 1750, individual_rate: 880, start_time_offset: 30, features: ['Marshall DSL40CR', 'Roland JC-120', 'Hartke 3500', 'Pearl Drums', '30分スタート'] },
  { id: 'bot-akiba-3112', roomIdNum: 3112, name: 'Piano (3帖)', size_sqm: 5, capacity: 2, hourly_rate: 2200, day_rate: 1750, individual_rate: 880, start_time_offset: 0, features: ['YAMAHA アップライトピアノ', 'ドラム無し', '個人練習特化'] },
];

export async function fetchBotAkibaDays(
  baseDate: Date,
  dayCount: number = 14
): Promise<BotRoomData[]> {
  console.log(`📡 [BASS ON TOP] 秋葉原昭和通り口店の高速取得（Node fetch / ${dayCount}日間）を開始...`);
  const shopUrl = 'https://studi-ol.com/shop/705';

  const res1 = await fetch(shopUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });

  const setCookies = (res1.headers as any).getSetCookie ? (res1.headers as any).getSetCookie() : [res1.headers.get('set-cookie') || ''];
  const cookieHeader = setCookies.map((c: string) => c.split(';')[0]).join('; ');

  const html = await res1.text();
  const tokenMatch = html.match(/name="_token"\s+value="([^"]+)"/) || html.match(/name="csrf-token"\s+content="([^"]+)"/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    throw new Error('[BASS ON TOP] CSRFトークンが見つかりませんでした。');
  }

  const startDateStr = format(baseDate, 'yyyy-MM-dd 00:00:00');
  const endDateStr = format(addDays(baseDate, dayCount), 'yyyy-MM-dd 23:59:59');

  const resultRooms: BotRoomData[] = [];

  for (const r of BOT_AKIBA_ROOMS) {
    try {
      const postRes = await fetch('https://studi-ol.com/get_schedule_room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': cookieHeader,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': shopUrl,
          'Origin': 'https://studi-ol.com',
        },
        body: new URLSearchParams({
          _token: token,
          room_id: String(r.roomIdNum),
          start: startDateStr,
          end: endDateStr,
        }).toString(),
      });

      if (!postRes.ok) {
        console.warn(`  ⚠️ [BASS ON TOP] Room ${r.name} HTTP ${postRes.status}`);
        continue;
      }

      const events: any[] = await postRes.json();
      const slots: BotRoomSlot[] = [];

      // 全日について6:00〜24:00のスロットを生成
      for (let d = 0; d < dayCount; d++) {
        const dateStr = format(addDays(baseDate, d), 'yyyy-MM-dd');
        const offsetMin = r.start_time_offset;

        for (let h = 6; h < 24; h++) {
          const sHour = String(h).padStart(2, '0');
          const sMin = String(offsetMin).padStart(2, '0');
          const eHour = String(h + 1).padStart(2, '0');
          const eMin = sMin;

          const startTimeIso = `${dateStr}T${sHour}:${sMin}:00+09:00`;
          const endTimeIso = `${dateStr}T${eHour}:${eMin}:00+09:00`;

          // matching event in studiol
          // event format: "2026-09-13 14:00:00"
          const eventTimePrefix = `${dateStr} ${sHour}:${sMin}`;
          const matchingEvent = events.find(e => e.start && e.start.startsWith(eventTimePrefix));

          // In studiol, className "sche-pub" means public available slot. If background is booked or user has booked it, it's booked.
          let status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' = 'AVAILABLE';
          if (matchingEvent) {
            if (matchingEvent.title?.includes('予約') || matchingEvent.className?.includes('booked')) {
              status = 'BOOKED';
            } else {
              status = 'AVAILABLE';
            }
          } else {
            // No event means either not available or outside open hours (BOT opens at 9:00 on weekends / 10:00 on weekdays)
            status = 'BOOKED';
          }

          slots.push({
            id: `slot-${r.id}-${dateStr}-${sHour}${sMin}`,
            start_time: startTimeIso,
            end_time: endTimeIso,
            status,
            price: r.hourly_rate,
          });
        }
      }

      resultRooms.push({
        id: r.id,
        name: r.name,
        size_sqm: r.size_sqm,
        capacity: r.capacity,
        hourly_rate: r.hourly_rate,
        day_rate: r.day_rate,
        individual_rate: r.individual_rate,
        features: r.features,
        start_time_offset: r.start_time_offset,
        slots,
      });

      // 50ms wait
      await new Promise(res => setTimeout(res, 50));
    } catch (err: any) {
      console.error(`  ❌ [BASS ON TOP] Room ${r.name} エラー:`, err.message);
    }
  }

  console.log(`  ✅ [BASS ON TOP] ${resultRooms.length}部屋、計${resultRooms.reduce((a, b) => a + b.slots.length, 0)}スロット取得完了`);
  return resultRooms;
}
