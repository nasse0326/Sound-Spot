/**
 * Lightweight BASS ON TOP (studi-ol.com) Scraper using pure Node fetch.
 * Fully eliminates Playwright browser overhead.
 */
import { format, addDays } from 'date-fns';
import { toIsoWithRollover } from './time-utils';
import { CRAWL_DAY_COUNT } from '../../src/config/crawl-schedule';

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
  dayCount: number = CRAWL_DAY_COUNT
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
  dayCount: number = CRAWL_DAY_COUNT
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
  dayCount: number = CRAWL_DAY_COUNT
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
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/2355', BOT_IKEBUKURO_ROOMS, '池袋西口店', baseDate, dayCount);
}

// 以下、下北沢エリア追加分。BASS ON TOP系列ではないが、同じstudi-ol.com ASPを
// 使っておりログイン不要でカレンダーが閲覧できることをブラウザで実地確認済み。
// features配列は他店舗と異なり、"BASS::"/"DRUM::"プレフィックス方式で明示する
// （ALBIT/GALLIEN-KRUEGER/Trace Elliot等、既存コンバータのAmpeg/Hartke/Drums
// キーワード一致では拾えないブランドが多いため、専用コンバータ側で
// プレフィックスを剥がして正確にguitarAmps/bassAmp/drumSetへ振り分ける）。

// room_idはstudi-ol.com/shop/587のページソース内<li room-id="...">から実値を確認済み
export const ANDYS_ROOMS: BotRoomSpec[] = [
  { id: 'andys-bst', roomIdNum: 2350, name: 'Bst (16帖)', size_sqm: 26, capacity: 10, hourly_rate: 1980, day_rate: 1980, individual_rate: 770, start_time_offset: 0, features: ['Marshall JCM2000 DSL-100/1960', 'Fender TwinAmp', 'Roland JC120', 'BASS::Ampeg SWR750x/Megoliath', 'DRUM::YAMAHA Maple Custom Absolute'] },
  { id: 'andys-cst', roomIdNum: 2351, name: 'Cst (14帖)', size_sqm: 23, capacity: 10, hourly_rate: 1980, day_rate: 1980, individual_rate: 770, start_time_offset: 0, features: ['Marshall JCM2000 DSL-100/1960', 'Fender TwinAmp', 'Roland JC120', 'BASS::Ampeg SVT-4PRO/SVT810E', 'DRUM::YAMAHA Maple Custom Absolute'] },
];

export async function fetchAndysDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/587', ANDYS_ROOMS, 'ANDY\'S STUDIO', baseDate, dayCount);
}

// room_idはstudi-ol.com/shop/767のページソース内<li room-id="...">から実値を確認済み。
// ELS(レコーディング専用ルーム)は時間単価ではなくパッケージ料金制(ボーカルREC5500円、
// バンドREC8800円/6時間〜)のため、他室と同じhourly_rateモデルに合わず対象外とした。
export const STANDBY_ROOMS: BotRoomSpec[] = [
  { id: 'standby-a', roomIdNum: 3382, name: 'Aスタジオ (14帖)', size_sqm: 23, capacity: 8, hourly_rate: 3200, day_rate: 2400, individual_rate: 1000, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC120', 'BASS::Ampeg SVT-4PRO+810', 'DRUM::Pearl BN series(12"13"16"22") / MEINL CUSTOM DARK series'] },
  { id: 'standby-b', roomIdNum: 3383, name: 'Bスタジオ (11帖)', size_sqm: 18, capacity: 7, hourly_rate: 3000, day_rate: 2200, individual_rate: 1000, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC120', 'BASS::GALLIEN-KRUEGER 1001RB-II / Ampeg SVT-810E', 'DRUM::Pearl BN series(12"13"16"22") / Paiste PST-7'] },
  { id: 'standby-c', roomIdNum: 3633, name: 'Cスタジオ (10帖)', size_sqm: 17, capacity: 5, hourly_rate: 2800, day_rate: 2000, individual_rate: 1000, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC120', 'BASS::Acoustic SET', 'DRUM::Pearl Vision series(12"13"16"22") / Paiste PST-5'] },
  { id: 'standby-d', roomIdNum: 4426, name: 'Dスタジオ (10帖・鏡なし)', size_sqm: 17, capacity: 2, hourly_rate: 1800, day_rate: 1800, individual_rate: 1000, start_time_offset: 0, features: ['Dr.Z CarmenGhia Xotic Mod.(レコーディング用)', 'BASS::Ampeg SVT-4PRO+810 / SUNN Vintage Cabinet(レコーディング用)', 'DRUM::TAMA DRUM SET / Pearl DRUM SET(レコーディング用)'] },
];

export async function fetchStandbyDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/767', STANDBY_ROOMS, 'STANDBY MUSIC STUDIO', baseDate, dayCount);
}

// room_idはstudi-ol.com/shop/539のページソース内<li room-id="...">から実値を確認済み
export const GOURDISLAND_WEST_ROOMS: BotRoomSpec[] = [
  { id: 'gourdisland-west-1st', roomIdNum: 2142, name: '1st (12帖)', size_sqm: 20, capacity: 10, hourly_rate: 2830, day_rate: 2100, individual_rate: 570, start_time_offset: 0, features: ['Marshall', 'Roland JC-120', 'Fender', 'BASS::Ampeg', 'DRUM::Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock'] },
  { id: 'gourdisland-west-2st', roomIdNum: 2143, name: '2st (10帖)', size_sqm: 17, capacity: 10, hourly_rate: 2620, day_rate: 1880, individual_rate: 570, start_time_offset: 0, features: ['Marshall', 'Roland JC-120', 'BASS::ALBIT B-280', 'DRUM::Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock'] },
  { id: 'gourdisland-west-3st', roomIdNum: 2144, name: '3st (10帖)', size_sqm: 17, capacity: 10, hourly_rate: 2620, day_rate: 1880, individual_rate: 570, start_time_offset: 0, features: ['Marshall', 'Roland JC-120', 'BASS::GALLIEN-KRUEGER 400RB III', 'DRUM::Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock'] },
  { id: 'gourdisland-west-4st', roomIdNum: 2145, name: '4st (12帖)', size_sqm: 20, capacity: 10, hourly_rate: 2830, day_rate: 2100, individual_rate: 570, start_time_offset: 0, features: ['Marshall', 'Roland JC-120', 'Fender', 'BASS::Ampeg', 'DRUM::Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock'] },
  { id: 'gourdisland-west-5st', roomIdNum: 2146, name: '5st (10帖)', size_sqm: 17, capacity: 10, hourly_rate: 2100, day_rate: 1470, individual_rate: 570, start_time_offset: 0, features: ['Marshall', 'Roland JC-120', 'BASS::Trace Elliot GP12 AH400', 'DRUM::Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock'] },
  { id: 'gourdisland-west-6st', roomIdNum: 2147, name: '6st (10帖)', size_sqm: 17, capacity: 10, hourly_rate: 2620, day_rate: 1880, individual_rate: 570, start_time_offset: 0, features: ['Marshall', 'Roland JC-120', 'BASS::Ampeg', 'DRUM::Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock'] },
];

export async function fetchGourdislandWestDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/539', GOURDISLAND_WEST_ROOMS, 'ガードアイランドスタジオ下北沢ウエスト店', baseDate, dayCount);
}

// room_idはstudi-ol.com/shop/591のページソース内<li room-id="...">から実値を確認済み
export const GOURDISLAND_SOUTH_ROOMS: BotRoomSpec[] = [
  { id: 'gourdisland-south-ast', roomIdNum: 2377, name: 'Ast (9帖)', size_sqm: 15, capacity: 10, hourly_rate: 2420, day_rate: 1700, individual_rate: 570, start_time_offset: 0, features: ['Marshall', 'Roland JC-120', 'BASS::Trace Elliot AH300', 'DRUM::Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock'] },
  { id: 'gourdisland-south-bst', roomIdNum: 2378, name: 'Bst (9帖)', size_sqm: 15, capacity: 10, hourly_rate: 2420, day_rate: 1700, individual_rate: 570, start_time_offset: 0, features: ['Marshall', 'Roland JC-120', 'BASS::PEAVEY Session Bass', 'DRUM::Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock'] },
  { id: 'gourdisland-south-cst', roomIdNum: 2379, name: 'Cst (12帖)', size_sqm: 20, capacity: 10, hourly_rate: 2620, day_rate: 1940, individual_rate: 570, start_time_offset: 0, features: ['Marshall', 'Roland JC-120', 'Fender', 'BASS::Ampeg', 'DRUM::Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock'] },
  { id: 'gourdisland-south-dst', roomIdNum: 2380, name: 'Dst (12帖)', size_sqm: 20, capacity: 10, hourly_rate: 2620, day_rate: 1940, individual_rate: 570, start_time_offset: 0, features: ['Marshall', 'Roland JC-120', 'Fender', 'BASS::Ampeg', 'DRUM::Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock'] },
  { id: 'gourdisland-south-est', roomIdNum: 2381, name: 'Est (9帖)', size_sqm: 15, capacity: 10, hourly_rate: 2420, day_rate: 1700, individual_rate: 570, start_time_offset: 0, features: ['Marshall', 'Roland JC-120', 'BASS::Trace Elliot AH300SMC', 'DRUM::Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock'] },
  { id: 'gourdisland-south-fst', roomIdNum: 2382, name: 'Fst (9帖)', size_sqm: 15, capacity: 10, hourly_rate: 2420, day_rate: 1700, individual_rate: 570, start_time_offset: 0, features: ['Marshall', 'Roland JC-120', 'BASS::Ampeg', 'DRUM::Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock'] },
];

export async function fetchGourdislandSouthDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/591', GOURDISLAND_SOUTH_ROOMS, 'ガードアイランドスタジオ下北沢南口店', baseDate, dayCount);
}

// 以下、新宿エリア追加分（2026-09-20）。BASS ON TOP系列ではないが、いずれも
// 同じstudi-ol.com ASPを使っておりログイン不要でカレンダーが閲覧できることを
// ブラウザで実地確認済み。

// room_idはstudi-ol.com/shop/637のページソース内<li room-id="...">から実値を確認済み。
// 1F（B-1/C-1/C-2/F-1）は00分スタート、2F（A/B-2/C-3/C-4/F-2）は30分スタート。
export const MUSEUM_SHINJUKU_ROOMS: BotRoomSpec[] = [
  { id: 'museum-a', roomIdNum: 2619, name: 'A (9畳)', size_sqm: 15, capacity: 4, hourly_rate: 2400, day_rate: 1550, individual_rate: 600, start_time_offset: 30, features: ['Marshall JCM900 4100+1960A', 'Fender TWIN REVERB', 'Roland JC-120', 'BASS::Markbass Little Mark 250 + TRACE 2103H+1153', 'DRUM::PEARL 3TOM+ZILDJIAN+PAISTE'] },
  { id: 'museum-b1', roomIdNum: 2624, name: 'B-1 (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 2500, day_rate: 1650, individual_rate: 600, start_time_offset: 0, features: ['Marshall JCM900 4100+1960A', 'Fender TWIN REVERB', 'Roland JC-120', 'BASS::Hartke HA2500 + HARTKE 410XL', 'DRUM::PEARL 3TOM+ZILDJIAN+PAISTE'] },
  { id: 'museum-b2', roomIdNum: 2620, name: 'B-2 (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 2500, day_rate: 1650, individual_rate: 600, start_time_offset: 30, features: ['Marshall JCM900 4100+1960A', 'Fender TWIN REVERB', 'Roland JC-120', 'BASS::Hartke HA2500 + HARTKE 410XL', 'DRUM::PEARL 3TOM+ZILDJIAN+PAISTE'] },
  { id: 'museum-c1', roomIdNum: 2625, name: 'C-1 (11畳)', size_sqm: 18, capacity: 5, hourly_rate: 2600, day_rate: 1750, individual_rate: 600, start_time_offset: 0, features: ['Marshall JCM900 4100+1960A', 'Fender TWIN REVERB', 'Roland JC-120', 'BASS::EBS REIDMAR250 + AMPEG BSE410H+BSE115T', 'DRUM::PEARL 3TOM+ZILDJIAN+PAISTE'] },
  { id: 'museum-c2', roomIdNum: 2626, name: 'C-2 (11畳)', size_sqm: 18, capacity: 5, hourly_rate: 2600, day_rate: 1750, individual_rate: 600, start_time_offset: 0, features: ['Marshall JCM900 4100+1960A', 'Fender TWIN REVERB', 'Roland JC-120', 'BASS::EBS REIDMAR250 + AMPEG BSE410H+BSE115T', 'DRUM::PEARL 3TOM+ZILDJIAN+PAISTE'] },
  { id: 'museum-c3', roomIdNum: 2621, name: 'C-3 (11畳)', size_sqm: 18, capacity: 5, hourly_rate: 2600, day_rate: 1750, individual_rate: 600, start_time_offset: 30, features: ['Marshall JCM900 4100+1960A', 'Fender TWIN REVERB', 'Roland JC-120', 'BASS::EBS REIDMAR250 + AMPEG BSE410H+BSE115T', 'DRUM::PEARL 3TOM+ZILDJIAN+PAISTE'] },
  { id: 'museum-c4', roomIdNum: 2622, name: 'C-4 (11畳)', size_sqm: 18, capacity: 5, hourly_rate: 2600, day_rate: 1750, individual_rate: 600, start_time_offset: 30, features: ['Marshall JCM900 4100+1960A', 'Fender TWIN REVERB', 'Roland JC-120', 'BASS::EBS REIDMAR250 + AMPEG BSE410H+BSE115T', 'DRUM::PEARL 3TOM+ZILDJIAN+PAISTE'] },
  { id: 'museum-f1', roomIdNum: 2627, name: 'F-1 (12畳)', size_sqm: 20, capacity: 6, hourly_rate: 2700, day_rate: 1850, individual_rate: 600, start_time_offset: 0, features: ['Marshall JCM900 4100+1960A', 'Fender TWIN REVERB', 'Roland JC-120', 'BASS::ORANGE OB1-300 + AMPEG BSE410H+BSE115T', 'DRUM::PEARL 3TOM+ZILDJIAN+PAISTE'] },
  { id: 'museum-f2', roomIdNum: 2623, name: 'F-2 (12畳)', size_sqm: 20, capacity: 6, hourly_rate: 2700, day_rate: 1850, individual_rate: 600, start_time_offset: 30, features: ['Marshall JCM900 4100+1960A', 'Fender TWIN REVERB', 'Roland JC-120', 'BASS::ORANGE OB1-300 + AMPEG BSE410H+BSE115T', 'DRUM::PEARL 3TOM+ZILDJIAN+PAISTE'] },
];

export async function fetchMuseumShinjukuDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/637', MUSEUM_SHINJUKU_ROOMS, 'スタジオミュージアム新宿店', baseDate, dayCount);
}

// room_idはstudi-ol.com/shop/515のページソース内<li room-id="...">から実値を確認済み
// （starttime="60"は「60分刻み＝00分スタート」を意味し、offset相当は0）。
export const HILLVALLEY_ROOMS: BotRoomSpec[] = [
  { id: 'hillvalley-ast', roomIdNum: 2046, name: 'Ast (12帖)', size_sqm: 20, capacity: 5, hourly_rate: 3100, day_rate: 2600, individual_rate: 800, start_time_offset: 0, features: ['Marshall JCM900 HI GAIN DUAL REVERB(50W) + 1960A', 'Roland JC-120B', 'BASS::GALLIEN-KRUEGER 700RB-II + Ampeg SVT610HLF', 'DRUM::Pearl MCX SHELL PACK(12/13/16/22) + Paiste 900 Series'] },
  { id: 'hillvalley-bst', roomIdNum: 2047, name: 'Bst (11帖)', size_sqm: 18, capacity: 5, hourly_rate: 3000, day_rate: 2500, individual_rate: 800, start_time_offset: 0, features: ['Marshall JCM900 HI GAIN DUAL REVERB(100W) + 1960AV', 'Roland JC-120B', 'BASS::GALLIEN-KRUEGER 700RB-II + Ampeg SVT610HLF', 'DRUM::Pearl MCX SHELL PACK(12/13/16/22) + Paiste 900 Series'] },
  { id: 'hillvalley-cst', roomIdNum: 2048, name: 'Cst (18帖)', size_sqm: 30, capacity: 8, hourly_rate: 3600, day_rate: 3100, individual_rate: 800, start_time_offset: 0, features: ['Marshall JCM900 HI GAIN DUAL REVERB(100W) + 1960A', 'Marshall JCM900 SL-X + 1960A JCM800', 'Roland JC-120B', 'BASS::GALLIEN-KRUEGER 700RB-II + Ampeg SVT810E', 'DRUM::Pearl MCX SHELL PACK(12/13/16/22) + Sabian AA Series'] },
];

export async function fetchHillvalleyDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/515', HILLVALLEY_ROOMS, 'ヒルバレースタジオ', baseDate, dayCount);
}

// room_idはstudi-ol.com/shop/817のページソース内<li room-id="...">から実値を確認済み。
// 料金はstudi-ol.com上のライブ表示額（公式サイトreserve.phpの「フェア」割引後価格と一致）を
// 正として採用。[B]st・[C]stの常設機材詳細ページはJS動的タブでテキスト抽出できなかったため、
// [A]stで確認済みの機材（Marshall/Roland JC-120/Hartke/TAMA系）を代表値として使用する。
export const VANTAGE_ROOMS: BotRoomSpec[] = [
  { id: 'vantage-cst', roomIdNum: 3645, name: 'Cst (約10帖)', size_sqm: 17, capacity: 4, hourly_rate: 2860, day_rate: 1980, individual_rate: 770, start_time_offset: 0, features: ['Marshall DSL100H + 1960A', 'Roland JC-120', 'BASS::Hartke HA5500 + 4.5XL', 'DRUM::TAMA STARDRUM Bubinga Series'] },
  { id: 'vantage-bst', roomIdNum: 3644, name: 'Bst (約13帖)', size_sqm: 21, capacity: 6, hourly_rate: 3278, day_rate: 2178, individual_rate: 770, start_time_offset: 0, features: ['Marshall DSL100H + 1960A', 'Roland JC-120', 'BASS::Hartke HA5500 + 4.5XL', 'DRUM::TAMA STARDRUM Bubinga Series'] },
  { id: 'vantage-ast', roomIdNum: 3643, name: 'Ast (約18帖)', size_sqm: 30, capacity: 8, hourly_rate: 4125, day_rate: 3025, individual_rate: 770, start_time_offset: 0, features: ['Marshall JVM410H + 1960AV(Vintage30)', 'Marshall DSL100H + 1960A', 'Roland JC-120', 'BASS::Hartke HA5500 + 4.5XL ×2', 'DRUM::TAMA STARDRUM Bubinga Series + Zildjian A Custom'] },
];

export async function fetchVantageDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/817', VANTAGE_ROOMS, 'Sound Studio Vantage', baseDate, dayCount);
}

// 以下、高円寺エリア追加分（2026-09-20）。BASS ON TOPグループではないが、いずれも
// 同じstudi-ol.com ASPを使っておりログイン不要でカレンダーが閲覧できることを
// ブラウザで実地確認済み。

// room_idはstudi-ol.com/shop/550のページソース内<li room-id="...">から実値を確認済み
export const SOUND_STUDIO_DOM_ROOMS: BotRoomSpec[] = [
  { id: 'dom-ast', roomIdNum: 2188, name: 'Ast (9畳)', size_sqm: 15, capacity: 4, hourly_rate: 1900, day_rate: 1200, individual_rate: 500, start_time_offset: 0, features: ['Marshall JCM900 model4100 + 1960A', 'Roland JC-120', 'BASS::Acoustic B300HD + EDEN410', 'DRUM::CANOPUS YAIBA2'] },
  { id: 'dom-bst', roomIdNum: 2189, name: 'Bst (12畳)', size_sqm: 20, capacity: 5, hourly_rate: 2300, day_rate: 1200, individual_rate: 500, start_time_offset: 0, features: ['Marshall JCM900 model4100 + 1960A', 'Roland JC-120', 'BASS::Acoustic B300HD + BERGANTINO AE410', 'DRUM::CANOPUS YAIBA', 'NOTE::YAMAHAピアノ常設'] },
  { id: 'dom-dst', roomIdNum: 2190, name: 'D.Room (15畳)', size_sqm: 25, capacity: 7, hourly_rate: 2500, day_rate: 1200, individual_rate: 500, start_time_offset: 30, features: ['Marshall JCM900 model4100 + 1960A', 'Roland JC-120', 'BASS::MESA M3 CARBINE + AMPEG SVT-810E', 'DRUM::TAMA Starclassic', '30分スタート'] },
];

export async function fetchSoundStudioDomDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/550', SOUND_STUDIO_DOM_ROOMS, 'Sound Studio DOM', baseDate, dayCount);
}

// room_idはstudi-ol.com/shop/626のページソース内<li room-id="...">から実値を確認済み
export const PIG_STUDIO_ROOMS: BotRoomSpec[] = [
  { id: 'pig-ast', roomIdNum: 2577, name: 'Ast (11帖)', size_sqm: 18, capacity: 5, hourly_rate: 2480, day_rate: 1350, individual_rate: 500, start_time_offset: 0, features: ['Marshall 900 + 1960A', 'Roland JC-120', 'BASS::Ampeg SVT-7PRO + AMPEG 215', 'DRUM::TAMA Starclassic Maple'] },
  { id: 'pig-bst', roomIdNum: 2578, name: 'Bst (13帖)', size_sqm: 21, capacity: 7, hourly_rate: 2690, day_rate: 1400, individual_rate: 500, start_time_offset: 30, features: ['Marshall JVM410H + 1960A', 'Roland JC-120', 'BASS::AMPEG SVT-3PRO + Eden D410XST8 x2', 'DRUM::DW Design Series Acrylic', '30分スタート'] },
  { id: 'pig-cst', roomIdNum: 2579, name: 'Cst (11帖)', size_sqm: 18, capacity: 5, hourly_rate: 2480, day_rate: 1350, individual_rate: 500, start_time_offset: 0, features: ['Marshall900 + 1960A', 'Roland JC-120', 'BASS::EBSHD660 + PROLINE2000', 'DRUM::Gretsch Renown Series'] },
  { id: 'pig-dst', roomIdNum: 2580, name: 'Dst (13帖)', size_sqm: 21, capacity: 7, hourly_rate: 2690, day_rate: 1400, individual_rate: 500, start_time_offset: 30, features: ['Marshall 2000 + 1960A', 'Roland JC-120', 'BASS::Ampeg BR5 + AMPEG 215', 'DRUM::TAMA Starclassic Maple', '30分スタート'] },
  { id: 'pig-est', roomIdNum: 2581, name: 'Est (11帖・レコーディング対応)', size_sqm: 18, capacity: 5, hourly_rate: 2480, day_rate: 1350, individual_rate: 500, start_time_offset: 0, features: ['Marshall 900 + 1960A', 'Roland JC-120', 'BASS::HARTKE HA2500 + HARTKE 4.5XL', 'DRUM::CANOPUS Birch Series', 'セルフレコ対応'] },
];

export async function fetchPigStudioDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/626', PIG_STUDIO_ROOMS, 'P.I.G.Studio', baseDate, dayCount);
}

// room_idはstudi-ol.com/shop/623のページソース内<li room-id="...">から実値を確認済み
export const SONIC_BAND_STUDIO_ROOMS: BotRoomSpec[] = [
  { id: 'sonic-ast', roomIdNum: 2560, name: 'Ast (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 1800, day_rate: 1000, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM2000 + 1960A', 'Roland JC-120', 'BASS::MARKBASS LITTLE MARK III + MARKBASS Standard 104 HF', 'DRUM::Pearl VBL'] },
  { id: 'sonic-bst', roomIdNum: 2561, name: 'Bst (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 1800, day_rate: 1000, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM2000 + 1960A', 'Roland JC-120', 'BASS::Ampeg SVT7PRO + SVT-410HE x2', 'DRUM::Pearl VBL'] },
  { id: 'sonic-cst', roomIdNum: 2562, name: 'Cst (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 1800, day_rate: 1000, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM2000 + 1960A', 'Roland JC-120', 'BASS::ORANGE AD200B Black + ORANGE OBC410 + ORANGE OBC115', 'DRUM::Pearl VBL'] },
];

export async function fetchSonicBandStudioDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/623', SONIC_BAND_STUDIO_ROOMS, 'SONIC BAND STUDIO', baseDate, dayCount);
}

// room_idはstudi-ol.com/shop/2245のページソース内<li room-id="...">から実値を確認済み
// （starttime="60"は「60分刻み＝00分スタート」を意味し、offset相当は0）。
export const KOYAMA_MAIN_ROOMS: BotRoomSpec[] = [
  { id: 'koyama-main-ast', roomIdNum: 3937, name: 'Ast (14帖)', size_sqm: 23, capacity: 6, hourly_rate: 2700, day_rate: 1350, individual_rate: 520, start_time_offset: 0, features: ['Marshall JVM 210H + 1960A', 'Roland JC-120', 'Fender TWIN REVERB', 'BASS::Hartke HA3500', 'DRUM::Pearl MCX', 'NOTE::YAMAHA P-225電子ピアノ常設'] },
  { id: 'koyama-main-bst', roomIdNum: 3938, name: 'Bst (9帖)', size_sqm: 15, capacity: 4, hourly_rate: 2200, day_rate: 1100, individual_rate: 520, start_time_offset: 0, features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::Hartke HA2500', 'DRUM::Pearl MX'] },
  { id: 'koyama-main-cst', roomIdNum: 3939, name: 'Cst (13帖)', size_sqm: 21, capacity: 6, hourly_rate: 2600, day_rate: 1300, individual_rate: 520, start_time_offset: 0, features: ['Marshall DSL 100H + 1960A', 'Roland JC-120', 'Fender TWIN REVERB', 'BASS::Hartke HA3500', 'DRUM::Pearl MX', 'NOTE::YAMAHA P-225電子ピアノ常設'] },
  { id: 'koyama-main-fst', roomIdNum: 3940, name: 'Fst (6.5帖)', size_sqm: 11, capacity: 3, hourly_rate: 1800, day_rate: 900, individual_rate: 520, start_time_offset: 0, features: ['Marshall JCM900 + Roland JC-40', 'BASS::Hartke HA2000', 'DRUM::Pearl MCX'] },
  { id: 'koyama-main-control', roomIdNum: 3941, name: 'コントロールルーム', size_sqm: 10, capacity: 3, hourly_rate: 1100, day_rate: 1100, individual_rate: 1100, start_time_offset: 0, features: ['AVID Protools 12 / Apple Logic Pro X / STEINBERG Cubase Pro 9', 'RME Fireface 800', 'RME Octamic II x2', 'YAMAHA HS-5 / JBL 4312MkII', 'NOTE::Ast・Fstと隣接、レコーディング用途'] },
];

export async function fetchKoyamaMainDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/2245', KOYAMA_MAIN_ROOMS, 'スタジオ・コヤーマ本店', baseDate, dayCount);
}

// room_idはstudi-ol.com/shop/812のページソース内<li room-id="...">から実値を確認済み。
// R店は無人営業店舗。
export const KOYAMA_R_ROOMS: BotRoomSpec[] = [
  { id: 'koyama-r-1st', roomIdNum: 3627, name: '1st (12帖)', size_sqm: 20, capacity: 6, hourly_rate: 2300, day_rate: 1150, individual_rate: 450, start_time_offset: 0, features: ['Marshall DSL 100H', 'Roland JC-120', 'BASS::Ampeg SVT-350H', 'DRUM::Pearl ELX', 'NOTE::YAMAHA P-225電子ピアノ常設'] },
  { id: 'koyama-r-2st', roomIdNum: 3628, name: '2st (11帖)', size_sqm: 18, capacity: 6, hourly_rate: 2200, day_rate: 1100, individual_rate: 450, start_time_offset: 0, features: ['Marshall DSL 100H', 'Roland JC-120', 'BASS::Ampeg SVT-350H', 'DRUM::Pearl ELX', 'NOTE::YAMAHA P-515電子ピアノ常設'] },
  { id: 'koyama-r-3st', roomIdNum: 3629, name: '3st (9帖)', size_sqm: 15, capacity: 4, hourly_rate: 2000, day_rate: 1000, individual_rate: 450, start_time_offset: 0, features: ['Marshall DSL 100H', 'Roland JC-120', 'BASS::Hartke HA2500', 'DRUM::Pearl ELX'] },
  { id: 'koyama-r-4st', roomIdNum: 3630, name: '4st (8.5帖)', size_sqm: 14, capacity: 4, hourly_rate: 1900, day_rate: 950, individual_rate: 450, start_time_offset: 0, features: ['Marshall DSL 100H', 'Roland JC-120', 'BASS::Ampeg SVT-350H', 'DRUM::Pearl ELX', 'NOTE::YAMAHA P-115電子ピアノ常設'] },
  { id: 'koyama-r-piano', roomIdNum: 3631, name: 'ピアノルーム (5帖)', size_sqm: 8, capacity: 2, hourly_rate: 1400, day_rate: 700, individual_rate: 450, start_time_offset: 0, features: ['Roland JC-22', 'BASS::Ampeg BA-108V2', 'NOTE::YAMAHA YUS3アップライトピアノ常設'] },
  { id: 'koyama-r-lesson', roomIdNum: 3632, name: 'レッスンルーム (8帖)', size_sqm: 13, capacity: 2, hourly_rate: 1400, day_rate: 700, individual_rate: 450, start_time_offset: 0, features: ['ミニギターアンプ x2', 'BASS::ミニベースアンプ', 'NOTE::YAMAHA CLP-685電子ピアノ常設、防音室ではないため外音が入る場合あり'] },
];

export async function fetchKoyamaRDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/812', KOYAMA_R_ROOMS, 'スタジオ・コヤーマR店', baseDate, dayCount);
}

// room_idはstudi-ol.com/shop/703のページソース内<li room-id="...">から実値を確認済み
export const MUSIRA_ROOMS: BotRoomSpec[] = [
  { id: 'musira-a', roomIdNum: 3100, name: 'A Studio (16帖)', size_sqm: 26, capacity: 8, hourly_rate: 3850, day_rate: 2400, individual_rate: 650, start_time_offset: 0, features: ['Marshall JCM900 SL-X', 'Fender Twinreverb', 'Roland Jazz Chorus 120', 'BASS::Ampeg SVT-450H + SVT-810AV', 'DRUM::Ludwig', 'NOTE::YAMAHA Upright YM5アップライトピアノ常設（1h/220円）'] },
  { id: 'musira-b', roomIdNum: 3101, name: 'B Studio (10帖)', size_sqm: 17, capacity: 5, hourly_rate: 3350, day_rate: 2200, individual_rate: 650, start_time_offset: 0, features: ['Marshall JCM900 Dual Reverb', 'Fender Twinreverb', 'Roland Jazz Chorus 120', 'BASS::Ampeg SVT-450H + SVT-810AV', 'DRUM::Rogers'] },
  { id: 'musira-c', roomIdNum: 3102, name: 'C Studio (8帖)', size_sqm: 13, capacity: 3, hourly_rate: 2850, day_rate: 2000, individual_rate: 650, start_time_offset: 0, features: ['Marshall JCM900 SL-X', 'Roland Jazz Chorus 120', 'Fender Vibroverb', 'BASS::Ampeg SVT-450H + SVT-810AV', 'DRUM::Rogers'] },
];

export async function fetchMusiraDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/703', MUSIRA_ROOMS, 'MUSIRA Studio', baseDate, dayCount);
}

// 亀戸〜小岩エリア追加分（2026-09-21）。room_idはstudi-ol.com/shop/613のページソース内
// <li room-id="...">から実値を確認済み。Rec Roomはレコーディング専用（時間単価モデルに
// 合わないパッケージ料金制の可能性があるが、他店同様hourly_rateモデルで代表値を掲載）。
export const STUDIO_2TIMES_ROOMS: BotRoomSpec[] = [
  { id: '2times-ast', roomIdNum: 2507, name: 'Ast (13畳)', size_sqm: 21, capacity: 6, hourly_rate: 2600, day_rate: 2200, individual_rate: 550, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Ampeg B2R', 'DRUM::Pearl Export Series'] },
  { id: '2times-bst', roomIdNum: 2508, name: 'Bst (11畳)', size_sqm: 18, capacity: 5, hourly_rate: 2350, day_rate: 1900, individual_rate: 550, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Ampeg B2R', 'DRUM::Pearl Export Series'] },
  { id: '2times-cst', roomIdNum: 2509, name: 'Cst (9畳)', size_sqm: 15, capacity: 4, hourly_rate: 2100, day_rate: 1600, individual_rate: 550, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Ampeg B2R', 'DRUM::Pearl Export Series'] },
  { id: '2times-dst', roomIdNum: 2510, name: 'Dst (9畳)', size_sqm: 15, capacity: 4, hourly_rate: 2100, day_rate: 1600, individual_rate: 550, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Ampeg B2R', 'DRUM::Pearl Export Series'] },
];

export async function fetchStudio2TimesDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/613', STUDIO_2TIMES_ROOMS, 'Studio 2Times', baseDate, dayCount);
}

// 松戸・柏エリア追加分（2026-09-21）。room_idはstudi-ol.com/shop/558のページソース内
// <li room-id="...">から実値を確認済み。全室00分スタート。D〜8stは公式サイトに
// 帖数・人数・機材が個別記載されているが、アンプ/ドラムセット等の常設楽器機材は
// バンドスタジオ(A/B/C)のみで、個人・アンサンブル練習室(D,1-8)は電子ピアノ・鏡・
// 譜面台中心の構成のため、featuresはNOTE::プレフィックスで代表的な備品を記載する。
export const ITO_ONGAKU_MUSICBANK_MATSUDO_ROOMS: BotRoomSpec[] = [
  { id: 'musicbank-matsudo-ast', roomIdNum: 2219, name: 'Ast (17.5帖)', size_sqm: 29, capacity: 8, hourly_rate: 2500, day_rate: 2100, individual_rate: 600, start_time_offset: 0, features: ['Marshall JVM 205H', 'Roland JC-120', 'VOX AC30', 'BASS::Ampeg SVT200T', 'DRUM::YAMAHA Maple Custom + Zildjian', 'NOTE::YAMAHA CP300キーボード常設、鏡あり、Bluetooth対応'] },
  { id: 'musicbank-matsudo-bst', roomIdNum: 2220, name: 'Bst (15.5帖)', size_sqm: 26, capacity: 7, hourly_rate: 2200, day_rate: 1800, individual_rate: 600, start_time_offset: 0, features: ['Marshall JCM2000', 'Roland JC-120', 'BASS::Markbass Little MarkII', 'DRUM::YAMAHA Oak Custom + Zildjian', 'NOTE::YAMAHA P105キーボード常設、鏡あり、+1000円でツインドラム対応可'] },
  { id: 'musicbank-matsudo-cst', roomIdNum: 2221, name: 'Cst (5.5帖)', size_sqm: 9, capacity: 3, hourly_rate: 1500, day_rate: 1100, individual_rate: 500, start_time_offset: 0, features: ['Ibanez TSA15H', 'BASS::Markbass CMD121', 'DRUM::Pearl Vision + Zildjian', 'NOTE::CASIO PX110キーボード常設'] },
  { id: 'musicbank-matsudo-dst', roomIdNum: 2230, name: 'Dst (8帖)', size_sqm: 13, capacity: 5, hourly_rate: 1700, day_rate: 1700, individual_rate: 500, start_time_offset: 0, features: ['NOTE::YAMAHAクラビノーバ電子ピアノ、鏡（壁掛け）、譜面台、簡易PA・スピーカー、CDデッキ'] },
  { id: 'musicbank-matsudo-1st', roomIdNum: 2231, name: '1st (8帖)', size_sqm: 13, capacity: 4, hourly_rate: 1700, day_rate: 1700, individual_rate: 500, start_time_offset: 0, features: ['NOTE::YAMAHAクラビノーバ電子ピアノ、音響機材（マイク・音源再生可）、CDデッキ、鏡、譜面台'] },
  { id: 'musicbank-matsudo-2st', roomIdNum: 2232, name: '2st (8帖・アップライトピアノ)', size_sqm: 13, capacity: 4, hourly_rate: 1700, day_rate: 1700, individual_rate: 500, start_time_offset: 0, features: ['NOTE::YAMAHA U3Aアップライトピアノ常設、YAMAHAクラビノーバ電子ピアノ、鏡（壁固定）、譜面台'] },
  { id: 'musicbank-matsudo-3st', roomIdNum: 2233, name: '3st (17帖)', size_sqm: 28, capacity: 10, hourly_rate: 1700, day_rate: 1700, individual_rate: 500, start_time_offset: 0, features: ['NOTE::YAMAHAクラビノーバ電子ピアノ、音響機材（マイク・音源再生可）、CDデッキ、鏡、譜面台、マイクスタンド'] },
  { id: 'musicbank-matsudo-4st', roomIdNum: 2234, name: '4st (4帖・グランドピアノ)', size_sqm: 7, capacity: 2, hourly_rate: 1700, day_rate: 1700, individual_rate: 500, start_time_offset: 0, features: ['NOTE::YAMAHA C1Xグランドピアノ常設、譜面台'] },
  { id: 'musicbank-matsudo-5st', roomIdNum: 2235, name: '5st (9帖)', size_sqm: 15, capacity: 5, hourly_rate: 1700, day_rate: 1700, individual_rate: 500, start_time_offset: 0, features: ['NOTE::YAMAHAクラビノーバ電子ピアノ、鏡（壁掛け小さめ）、譜面台'] },
  { id: 'musicbank-matsudo-6st', roomIdNum: 2277, name: '6st (7帖)', size_sqm: 12, capacity: 3, hourly_rate: 1700, day_rate: 1700, individual_rate: 500, start_time_offset: 0, features: ['NOTE::YAMAHAクラビノーバ電子ピアノ、鏡（壁掛け固定）、譜面台'] },
  { id: 'musicbank-matsudo-7st', roomIdNum: 2236, name: '7st (4帖)', size_sqm: 7, capacity: 3, hourly_rate: 1700, day_rate: 1700, individual_rate: 500, start_time_offset: 0, features: ['NOTE::YAMAHAクラビノーバ電子ピアノ、鏡（スタンドタイプ）、譜面台'] },
  { id: 'musicbank-matsudo-8st', roomIdNum: 2278, name: '8st (7帖)', size_sqm: 12, capacity: 4, hourly_rate: 1700, day_rate: 1700, individual_rate: 500, start_time_offset: 0, features: ['NOTE::PA・スピーカー等の音響機材、CDデッキ、家庭サイズのギターアンプ、譜面台'] },
];

export async function fetchMusicBankMatsudoDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<BotRoomData[]> {
  return fetchBotStoreDays('https://studi-ol.com/shop/558', ITO_ONGAKU_MUSICBANK_MATSUDO_ROOMS, '伊藤楽器 MUSIC BANK 松戸', baseDate, dayCount);
}
