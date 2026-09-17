/**
 * Lightweight BASS ON TOP (studi-ol.com) Scraper using pure Node fetch.
 * Fully eliminates Playwright browser overhead.
 */
import { format, addDays } from 'date-fns';
import { toIsoWithRollover } from './time-utils';

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

export interface BotRoomSpec {
  id: string;
  roomIdNum: number;
  name: string;
  size_sqm: number;
  capacity: number;
  hourly_rate: number;
  day_rate?: number;
  night_rate?: number;
  individual_rate: number;
  start_time_offset: number;
  features: string[];
}

/**
 * studi-ol.com を使う任意のBASS ON TOP系列店舗向けの汎用フェッチャー。
 * 店舗ごとのshopUrl（studi-ol.com/shop/<id>）と部屋定義を渡すだけで使い回せる。
 */
export async function fetchBotStoreDays(
  shopUrl: string,
  rooms: BotRoomSpec[],
  storeLabel: string,
  baseDate: Date,
  dayCount: number = 14
): Promise<BotRoomData[]> {
  console.log(`📡 [BASS ON TOP] ${storeLabel}の高速取得（Node fetch / ${dayCount}日間）を開始...`);

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

  for (const r of rooms) {
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

          const startTimeIso = toIsoWithRollover(dateStr, h, offsetMin);
          const endTimeIso = toIsoWithRollover(dateStr, h + 1, offsetMin);

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

      // 礼儀正しいウェイト（100ms）。GitHub Actions側は実測30秒未満で完走しており
      // 時間的な余裕があるため、より人間らしいペースへ倍増した。
      await new Promise(res => setTimeout(res, 100));
    } catch (err: any) {
      console.error(`  ❌ [BASS ON TOP] Room ${r.name} エラー:`, err.message);
    }
  }

  console.log(`  ✅ [BASS ON TOP] ${resultRooms.length}部屋、計${resultRooms.reduce((a, b) => a + b.slots.length, 0)}スロット取得完了`);
  return resultRooms;
}

export async function fetchBotAkibaDays(
  baseDate: Date,
  dayCount: number = 14
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/705', BOT_AKIBA_ROOMS, '秋葉原昭和通り口店', baseDate, dayCount);
}

export const BOT_TAKADANOBABA_ROOMS: BotRoomSpec[] = [
  { id: 'bot-baba-501', roomIdNum: 2919, name: '501 (11帖)', size_sqm: 18, capacity: 5, hourly_rate: 3100, day_rate: 2300, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-3pro', 'Pearl Drums'] },
  { id: 'bot-baba-502', roomIdNum: 2920, name: '502 (11帖)', size_sqm: 18, capacity: 5, hourly_rate: 3100, day_rate: 2300, individual_rate: 700, start_time_offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-3pro', 'Pearl Drums', '30分スタート'] },
  { id: 'bot-baba-503', roomIdNum: 2921, name: '503 (11帖)', size_sqm: 18, capacity: 5, hourly_rate: 3100, day_rate: 2300, individual_rate: 700, start_time_offset: 30, features: ['Marshall JCM800', 'Roland JC-120', 'Ampeg SVT-450', 'Pearl Drums', '30分スタート'] },
  { id: 'bot-baba-504', roomIdNum: 2922, name: '504 (11帖)', size_sqm: 18, capacity: 5, hourly_rate: 3100, day_rate: 2300, individual_rate: 700, start_time_offset: 0, features: ['Marshall JVM210H', 'Roland JC-120', 'Hartke HA5500', 'Pearl Drums'] },
  { id: 'bot-baba-505', roomIdNum: 2923, name: '505 (15帖)', size_sqm: 25, capacity: 6, hourly_rate: 3500, day_rate: 2800, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450', 'dw CL series Drums', '15帖以上', '独立モニター完備'] },
  { id: 'bot-baba-506', roomIdNum: 2924, name: '506 (15帖)', size_sqm: 25, capacity: 6, hourly_rate: 3500, day_rate: 2800, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM2000', 'Roland JC-120', 'Fender Twin Reverb', 'dw CL series Drums', '15帖以上', '独立モニター完備'] },
  { id: 'bot-baba-507', roomIdNum: 2925, name: '507 (8.5帖)', size_sqm: 14, capacity: 3, hourly_rate: 2800, day_rate: 1900, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Hartke HA5500', 'Pearl Drums'] },
  { id: 'bot-baba-508', roomIdNum: 2926, name: '508 (8.5帖)', size_sqm: 14, capacity: 3, hourly_rate: 2800, day_rate: 1900, individual_rate: 700, start_time_offset: 0, features: ['Marshall DSL40CR', 'Roland JC-120', 'Hartke HA5500', 'Pearl Drums'] },
  { id: 'bot-baba-509', roomIdNum: 2927, name: '509 (9帖)', size_sqm: 15, capacity: 4, hourly_rate: 2800, day_rate: 1900, individual_rate: 700, start_time_offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-3pro', 'Pearl Drums', '30分スタート'] },
  { id: 'bot-baba-510', roomIdNum: 2928, name: '510 (9帖)', size_sqm: 15, capacity: 4, hourly_rate: 2800, day_rate: 1900, individual_rate: 700, start_time_offset: 30, features: ['Marshall JCM800', 'Roland JC-120', 'Ampeg SVT-450', 'Pearl Drums', '30分スタート'] },
  { id: 'bot-baba-511', roomIdNum: 2929, name: '511 (10帖)', size_sqm: 17, capacity: 4, hourly_rate: 3100, day_rate: 2300, individual_rate: 700, start_time_offset: 30, features: ['Marshall JVM210H', 'Roland JC-120', 'Ampeg SVT-3pro', 'Pearl Drums', '30分スタート'] },
];

export async function fetchBotTakadanobabaDays(
  baseDate: Date,
  dayCount: number = 14
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/681', BOT_TAKADANOBABA_ROOMS, '高田馬場店', baseDate, dayCount);
}

// room_idはstudi-ol.com/shop/2355のページソース内<li room-id="...">から実値を確認済み
// （表示上の1st〜7stの並び順とroom_idの対応、およびstartTime属性による開始オフセットも
// 同じ<li>タグ内に明記されているため、位置合わせの推測なしに直接特定できた）。
export const BOT_IKEBUKURO_ROOMS: BotRoomSpec[] = [
  { id: 'bot-ikebukuro-1st', roomIdNum: 4406, name: '1st (10帖)', size_sqm: 17, capacity: 5, hourly_rate: 3200, day_rate: 2500, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-3pro', 'Pearl Drums'] },
  { id: 'bot-ikebukuro-2st', roomIdNum: 4407, name: '2st (10帖)', size_sqm: 17, capacity: 5, hourly_rate: 3200, day_rate: 2500, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM800', 'Roland JC-120', 'Ampeg SVT-450', 'Pearl Drums'] },
  { id: 'bot-ikebukuro-3st', roomIdNum: 4408, name: '3st (9帖)', size_sqm: 15, capacity: 4, hourly_rate: 3200, day_rate: 2500, individual_rate: 700, start_time_offset: 0, features: ['Marshall JVM210H', 'Roland JC-120', 'Hartke HA5500', 'Pearl Drums'] },
  { id: 'bot-ikebukuro-4st', roomIdNum: 4409, name: '4st (16帖)', size_sqm: 27, capacity: 6, hourly_rate: 3800, day_rate: 3100, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-3pro', 'dw CL series Drums', 'キーボード2台常設', '15帖以上'] },
  { id: 'bot-ikebukuro-5st', roomIdNum: 4410, name: '5st (10帖)', size_sqm: 17, capacity: 5, hourly_rate: 3200, day_rate: 2500, individual_rate: 700, start_time_offset: 0, features: ['Marshall DSL100H', 'Roland JC-120', 'Ampeg SVT-3pro', 'Pearl Drums'] },
  { id: 'bot-ikebukuro-6st', roomIdNum: 4411, name: '6st (9帖)', size_sqm: 15, capacity: 4, hourly_rate: 3200, day_rate: 2500, individual_rate: 700, start_time_offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Hartke HA5500', 'Pearl Drums', '30分スタート'] },
  { id: 'bot-ikebukuro-7st', roomIdNum: 4412, name: '7st (9帖)', size_sqm: 15, capacity: 4, hourly_rate: 3200, day_rate: 2500, individual_rate: 700, start_time_offset: 30, features: ['Marshall DSL40CR', 'Roland JC-120', 'Ampeg SVT-450', 'Pearl Drums', '30分スタート'] },
];

export async function fetchBotIkebukuroDays(
  baseDate: Date,
  dayCount: number = 14
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/2355', BOT_IKEBUKURO_ROOMS, '池袋西口店', baseDate, dayCount);
}
