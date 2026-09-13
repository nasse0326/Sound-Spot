/**
 * Pure Node fetch Scraper for Sound Studio NOAH Official Schedule API (/noahweb/Chart/schedule)
 * Completely eliminates Playwright and browser overhead!
 * Seamlessly fetches 21 days of slot data for all Noah branches in Shibuya, Shinjuku, and Akihabara.
 */
import fs from 'fs';
import path from 'path';
import { format, addDays, startOfWeek } from 'date-fns';
import { loginNoah } from './noah-login';

export interface NoahSlot {
  id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED';
  price?: number;
}

export interface NoahRoomData {
  id: string;
  storeKey: string;
  studioId: number;
  name: string;
  tatami: number;
  offset: number;
  loginRequired: boolean;
  slots: NoahSlot[];
}

export interface NoahRoomDef {
  id: string;
  studioId: number;
  name: string;
  tatami: number;
  offset: number;
  loginRequired: boolean;
}

export interface NoahStoreDef {
  key: string;
  name: string;
  rooms: NoahRoomDef[];
}

export const NOAH_ALL_STORES: NoahStoreDef[] = [
  // 1. 渋谷本店 (14室: ログイン不要 9室 / ログイン必須 5室)
  {
    key: 'shibuya',
    name: 'サウンドスタジオノア 渋谷本店',
    rooms: [
      { id: 'noah-shibuya-honten-sst', studioId: 3229, name: 'Sst (18帖)', tatami: 18, offset: 0, loginRequired: false },
      { id: 'noah-shibuya-honten-a1st', studioId: 3232, name: 'A1st (15帖)', tatami: 15, offset: 0, loginRequired: false },
      { id: 'noah-shibuya-honten-a2st', studioId: 3217, name: 'A2st (13帖)', tatami: 13, offset: 0, loginRequired: false },
      { id: 'noah-shibuya-honten-b1st', studioId: 3231, name: 'B1st (12帖)', tatami: 12, offset: 0, loginRequired: true },
      { id: 'noah-shibuya-honten-b2st', studioId: 3234, name: 'B2st (12帖)', tatami: 12, offset: 0, loginRequired: true },
      { id: 'noah-shibuya-honten-b3st', studioId: 3221, name: 'B3st (11帖)', tatami: 11, offset: 0, loginRequired: true },
      { id: 'noah-shibuya-honten-b4st', studioId: 3226, name: 'B4st (11帖)', tatami: 11, offset: 0, loginRequired: true },
      { id: 'noah-shibuya-honten-cst', studioId: 3230, name: 'Cst (10帖)', tatami: 10, offset: 0, loginRequired: true },
      { id: 'noah-shibuya-honten-g1st', studioId: 3233, name: 'G1st (9帖)', tatami: 9, offset: 0, loginRequired: false },
      { id: 'noah-shibuya-honten-g2st', studioId: 3219, name: 'G2st (8帖)', tatami: 8, offset: 0, loginRequired: false },
      { id: 'noah-shibuya-honten-g3st', studioId: 3227, name: 'G3st (8帖)', tatami: 8, offset: 0, loginRequired: false },
      { id: 'noah-shibuya-honten-booth1', studioId: 3224, name: 'Booth1 (4帖)', tatami: 4, offset: 0, loginRequired: false },
      { id: 'noah-shibuya-honten-booth2', studioId: 3235, name: 'Booth2 (3帖)', tatami: 3, offset: 0, loginRequired: false },
      { id: 'noah-shibuya-honten-rec', studioId: 3236, name: 'Rec Booth (5帖)', tatami: 5, offset: 0, loginRequired: false },
    ]
  },
  // 2. 渋谷1号店 (12室: ログイン不要 6室 / ログイン必須 6室)
  {
    key: 'shibuya1',
    name: 'サウンドスタジオノア 渋谷1号店',
    rooms: [
      { id: 'noah-shibuya1-a1st', studioId: 105, name: 'A1st (15帖)', tatami: 15, offset: 0, loginRequired: false },
      { id: 'noah-shibuya1-a2st', studioId: 106, name: 'A2st (13帖)', tatami: 13, offset: 0, loginRequired: false },
      { id: 'noah-shibuya1-a3st', studioId: 107, name: 'A3st (12帖)', tatami: 12, offset: 0, loginRequired: false },
      { id: 'noah-shibuya1-a5st', studioId: 108, name: 'A5st (10帖)', tatami: 10, offset: 0, loginRequired: false },
      { id: 'noah-shibuya1-b1st', studioId: 109, name: 'B1st (14帖)', tatami: 14, offset: 0, loginRequired: true },
      { id: 'noah-shibuya1-b2st', studioId: 110, name: 'B2st (12帖)', tatami: 12, offset: 0, loginRequired: true },
      { id: 'noah-shibuya1-b3st', studioId: 111, name: 'B3st (11帖)', tatami: 11, offset: 0, loginRequired: true },
      { id: 'noah-shibuya1-b5st', studioId: 112, name: 'B5st (10帖)', tatami: 10, offset: 0, loginRequired: true },
      { id: 'noah-shibuya1-e1st', studioId: 113, name: 'E1st (9帖)', tatami: 9, offset: 0, loginRequired: true },
      { id: 'noah-shibuya1-e2st', studioId: 114, name: 'E2st (8帖)', tatami: 8, offset: 0, loginRequired: true },
      { id: 'noah-shibuya1-vobooth', studioId: 115, name: 'VoBooth (4帖)', tatami: 4, offset: 0, loginRequired: false },
      { id: 'noah-shibuya1-rec', studioId: 2973, name: 'RecStudio (6帖)', tatami: 6, offset: 0, loginRequired: false },
    ]
  },
  // 3. 渋谷2号店 (14室: ログイン不要 8室 / ログイン必須 6室)
  {
    key: 'shibuya2',
    name: 'サウンドスタジオノア 渋谷2号店',
    rooms: [
      { id: 'noah-shibuya2-sst', studioId: 166, name: 'Sst (17帖)', tatami: 17, offset: 0, loginRequired: false },
      { id: 'noah-shibuya2-a1st', studioId: 167, name: 'A1st (15帖)', tatami: 15, offset: 0, loginRequired: false },
      { id: 'noah-shibuya2-a2st', studioId: 168, name: 'A2st (13帖)', tatami: 13, offset: 0, loginRequired: false },
      { id: 'noah-shibuya2-a3st', studioId: 169, name: 'A3st (12帖)', tatami: 12, offset: 0, loginRequired: false },
      { id: 'noah-shibuya2-g1st', studioId: 170, name: 'G1st (11帖)', tatami: 11, offset: 0, loginRequired: false },
      { id: 'noah-shibuya2-g2st', studioId: 171, name: 'G2st (10帖)', tatami: 10, offset: 0, loginRequired: false },
      { id: 'noah-shibuya2-g3st', studioId: 172, name: 'G3st (9帖)', tatami: 9, offset: 0, loginRequired: false },
      { id: 'noah-shibuya2-b1st', studioId: 173, name: 'B1st (14帖)', tatami: 14, offset: 30, loginRequired: true },
      { id: 'noah-shibuya2-b2st', studioId: 174, name: 'B2st (12帖)', tatami: 12, offset: 30, loginRequired: true },
      { id: 'noah-shibuya2-b3st', studioId: 175, name: 'B3st (11帖)', tatami: 11, offset: 30, loginRequired: true },
      { id: 'noah-shibuya2-e1st', studioId: 176, name: 'E1st (10帖)', tatami: 10, offset: 30, loginRequired: true },
      { id: 'noah-shibuya2-e2st', studioId: 177, name: 'E2st (9帖)', tatami: 9, offset: 30, loginRequired: true },
      { id: 'noah-shibuya2-cst', studioId: 178, name: 'Cst (8帖)', tatami: 8, offset: 30, loginRequired: true },
      { id: 'noah-shibuya2-vobooth', studioId: 179, name: 'VoBooth (3帖)', tatami: 3, offset: 0, loginRequired: false },
    ]
  },
  // 4. 渋谷3号店 (15室: ログイン不要 13室 / ログイン必須 2室)
  {
    key: 'shibuya3',
    name: 'サウンドスタジオノア 渋谷3号店',
    rooms: [
      { id: 'noah-shibuya3-a1st', studioId: 3288, name: 'A1st (14帖)', tatami: 14, offset: 0, loginRequired: false },
      { id: 'noah-shibuya3-a2st', studioId: 3291, name: 'A2st (12帖)', tatami: 12, offset: 0, loginRequired: false },
      { id: 'noah-shibuya3-a3st', studioId: 3295, name: 'A3st (10帖)', tatami: 10, offset: 0, loginRequired: false },
      { id: 'noah-shibuya3-a4st', studioId: 3296, name: 'A4st (9帖)', tatami: 9, offset: 0, loginRequired: false },
      { id: 'noah-shibuya3-cst', studioId: 3290, name: 'Cst (15帖)', tatami: 15, offset: 0, loginRequired: true },
      { id: 'noah-shibuya3-est', studioId: 3287, name: 'Est (11帖)', tatami: 11, offset: 0, loginRequired: true },
      { id: 'noah-shibuya3-dj1st', studioId: 3293, name: 'DJ 1st (6帖)', tatami: 6, offset: 0, loginRequired: false },
      { id: 'noah-shibuya3-dj2st', studioId: 3294, name: 'DJ 2st (6帖)', tatami: 6, offset: 0, loginRequired: false },
      { id: 'noah-shibuya3-dj3st', studioId: 3286, name: 'DJ 3st (6帖)', tatami: 6, offset: 0, loginRequired: false },
      { id: 'noah-shibuya3-booth1', studioId: 3297, name: 'Booth1 (4帖)', tatami: 4, offset: 0, loginRequired: false },
      { id: 'noah-shibuya3-booth2', studioId: 3298, name: 'Booth2 (3帖)', tatami: 3, offset: 0, loginRequired: false },
      { id: 'noah-shibuya3-booth3', studioId: 3299, name: 'Booth3 (3帖)', tatami: 3, offset: 0, loginRequired: false },
      { id: 'noah-shibuya3-booth4', studioId: 3300, name: 'Booth4 (3帖)', tatami: 3, offset: 0, loginRequired: false },
      { id: 'noah-shibuya3-recbooth', studioId: 3289, name: 'RecBooth (5帖)', tatami: 5, offset: 0, loginRequired: false },
      { id: 'noah-shibuya3-recstudio', studioId: 3277, name: 'RecStudioBooth (7帖)', tatami: 7, offset: 0, loginRequired: false },
    ]
  },
  // 5. 新宿店 (21室: ログイン不要 13室 / ログイン必須 8室)
  {
    key: 'shinjuku',
    name: 'サウンドスタジオノア 新宿店',
    rooms: [
      { id: 'noah-shinjuku-s1st', studioId: 204, name: 'S1st (22帖)', tatami: 22, offset: 0, loginRequired: false },
      { id: 'noah-shinjuku-s2st', studioId: 205, name: 'S2st (18帖)', tatami: 18, offset: 0, loginRequired: false },
      { id: 'noah-shinjuku-s3st', studioId: 206, name: 'S3st (16帖)', tatami: 16, offset: 0, loginRequired: false },
      { id: 'noah-shinjuku-a1st', studioId: 207, name: 'A1st (15帖)', tatami: 15, offset: 0, loginRequired: false },
      { id: 'noah-shinjuku-a2st', studioId: 208, name: 'A2st (14帖)', tatami: 14, offset: 0, loginRequired: false },
      { id: 'noah-shinjuku-a3st', studioId: 209, name: 'A3st (13帖)', tatami: 13, offset: 0, loginRequired: false },
      { id: 'noah-shinjuku-a5st', studioId: 210, name: 'A5st (12帖)', tatami: 12, offset: 0, loginRequired: false },
      { id: 'noah-shinjuku-a6st', studioId: 211, name: 'A6st (11帖)', tatami: 11, offset: 0, loginRequired: false },
      { id: 'noah-shinjuku-a7st', studioId: 212, name: 'A7st (10帖)', tatami: 10, offset: 0, loginRequired: false },
      { id: 'noah-shinjuku-g1st', studioId: 213, name: 'G1st (12帖)', tatami: 12, offset: 0, loginRequired: false },
      { id: 'noah-shinjuku-g2st', studioId: 214, name: 'G2st (10帖)', tatami: 10, offset: 0, loginRequired: false },
      { id: 'noah-shinjuku-g3st', studioId: 215, name: 'G3st (9帖)', tatami: 9, offset: 0, loginRequired: false },
      { id: 'noah-shinjuku-b1st', studioId: 216, name: 'B1st (14帖)', tatami: 14, offset: 30, loginRequired: true },
      { id: 'noah-shinjuku-b2st', studioId: 217, name: 'B2st (12帖)', tatami: 12, offset: 30, loginRequired: true },
      { id: 'noah-shinjuku-b3st', studioId: 218, name: 'B3st (10帖)', tatami: 10, offset: 30, loginRequired: true },
      { id: 'noah-shinjuku-e1st', studioId: 219, name: 'E1st (11帖)', tatami: 11, offset: 30, loginRequired: true },
      { id: 'noah-shinjuku-e2st', studioId: 220, name: 'E2st (9帖)', tatami: 9, offset: 30, loginRequired: true },
      { id: 'noah-shinjuku-e3st', studioId: 221, name: 'E3st (8帖)', tatami: 8, offset: 30, loginRequired: true },
      { id: 'noah-shinjuku-csst', studioId: 3045, name: 'CSst (25帖)', tatami: 25, offset: 0, loginRequired: true },
      { id: 'noah-shinjuku-fst', studioId: 3046, name: 'Fst (13帖)', tatami: 13, offset: 0, loginRequired: true },
      { id: 'noah-shinjuku-rec', studioId: 3048, name: 'RecStudio (8帖)', tatami: 8, offset: 0, loginRequired: false },
    ]
  },
  // 6. 秋葉原店 (14室: ログイン不要 9室 / ログイン必須 5室)
  {
    key: 'akihabara',
    name: 'サウンドスタジオノア 秋葉原店',
    rooms: [
      { id: 'noah-akiba-A1st', studioId: 222, name: 'A1st (8帖)', tatami: 8, offset: 0, loginRequired: false },
      { id: 'noah-akiba-A2st', studioId: 223, name: 'A2st (8帖)', tatami: 8, offset: 0, loginRequired: false },
      { id: 'noah-akiba-A3st', studioId: 224, name: 'A3st (9帖)', tatami: 9, offset: 30, loginRequired: false },
      { id: 'noah-akiba-B1st', studioId: 229, name: 'B1st (14帖)', tatami: 14, offset: 0, loginRequired: true },
      { id: 'noah-akiba-B2st', studioId: 230, name: 'B2st (13帖)', tatami: 13, offset: 30, loginRequired: true },
      { id: 'noah-akiba-Cst+Sub', studioId: 233, name: 'Cst+Sub (28帖)', tatami: 28, offset: 30, loginRequired: true },
      { id: 'noah-akiba-E1st', studioId: 231, name: 'E1st (21帖)', tatami: 21, offset: 0, loginRequired: true },
      { id: 'noah-akiba-E2st', studioId: 232, name: 'E2st (20帖)', tatami: 20, offset: 30, loginRequired: true },
      { id: 'noah-akiba-G1st', studioId: 225, name: 'G1st (12帖)', tatami: 12, offset: 0, loginRequired: false },
      { id: 'noah-akiba-G2st', studioId: 226, name: 'G2st (10帖)', tatami: 10, offset: 0, loginRequired: false },
      { id: 'noah-akiba-GSst', studioId: 227, name: 'GSst (10帖)', tatami: 10, offset: 30, loginRequired: false },
      { id: 'noah-akiba-Booth1', studioId: 234, name: 'Booth1 (3帖)', tatami: 3, offset: 30, loginRequired: false },
      { id: 'noah-akiba-Booth2', studioId: 235, name: 'Booth2 (3帖)', tatami: 3, offset: 30, loginRequired: false },
      { id: 'noah-akiba-RecBooth', studioId: 228, name: 'RecBooth (4帖)', tatami: 4, offset: 0, loginRequired: false },
    ]
  },
  // 7. 御茶ノ水店 (11室: ログイン不要 6室 / ログイン必須 5室)
  {
    key: 'ochanomizu',
    name: 'サウンドスタジオノア 御茶ノ水店',
    rooms: [
      { id: 'noah-ochanomizu-booth', studioId: 3016, name: 'Booth (4帖)', tatami: 4, offset: 0, loginRequired: false },
      { id: 'noah-ochanomizu-a1st', studioId: 3015, name: 'A1st (8.5帖)', tatami: 9, offset: 0, loginRequired: false },
      { id: 'noah-ochanomizu-a2st', studioId: 3179, name: 'A2st (8.5帖)', tatami: 9, offset: 0, loginRequired: false },
      { id: 'noah-ochanomizu-cst', studioId: 3018, name: 'Cst (18帖)', tatami: 18, offset: 0, loginRequired: true },
      { id: 'noah-ochanomizu-gst', studioId: 3178, name: 'Gst (12帖)', tatami: 12, offset: 30, loginRequired: false },
      { id: 'noah-ochanomizu-b1st', studioId: 3022, name: 'B1st (13帖)', tatami: 13, offset: 30, loginRequired: true },
      { id: 'noah-ochanomizu-a3st', studioId: 3019, name: 'A3st (8.5帖)', tatami: 9, offset: 30, loginRequired: false },
      { id: 'noah-ochanomizu-a5st', studioId: 3023, name: 'A5st (9帖)', tatami: 9, offset: 30, loginRequired: false },
      { id: 'noah-ochanomizu-est', studioId: 3020, name: 'Est (15帖)', tatami: 15, offset: 30, loginRequired: true },
      { id: 'noah-ochanomizu-b2st', studioId: 3024, name: 'B2st (14帖)', tatami: 14, offset: 0, loginRequired: true },
      { id: 'noah-ochanomizu-b3st', studioId: 3025, name: 'B3st (14帖)', tatami: 14, offset: 0, loginRequired: true },
    ]
  }
];

// 秋葉原店専用の互換エクスポート
export const NOAH_AKIBA_ROOM_MAP = NOAH_ALL_STORES.find(s => s.key === 'akihabara')!.rooms;

/**
 * Loads existing crawled slot data to protect against destructive wipes when sessions expire.
 */
function loadExistingNoahSlotsMap(): Map<string, NoahSlot[]> {
  const map = new Map<string, NoahSlot[]>();
  const jsonPath = path.resolve(process.cwd(), 'src/data/noah-tokyo-real.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      if (Array.isArray(data.rooms)) {
        for (const r of data.rooms) {
          if (Array.isArray(r.slots) && r.slots.length > 0) {
            map.set(r.id, r.slots);
          }
        }
      }
    } catch {
      // ignore
    }
  }
  return map;
}

let inMemoryNoahCookie: string | null = null;

/**
 * Retrieves valid Noah session cookies from storageState.json or triggers auto-login if expired/missing.
 */
async function getOrRefreshNoahCookie(forceRefresh: boolean = false): Promise<string> {
  if (!forceRefresh && inMemoryNoahCookie) {
    return inMemoryNoahCookie;
  }

  const storageStatePath = path.resolve(process.cwd(), 'storageState.json');
  if (!forceRefresh && fs.existsSync(storageStatePath)) {
    try {
      const state = JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'));
      const cookies = state.cookies || [];
      const header = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
      if (header.includes('PHPSESSID') || header.includes('CAKEPHP')) {
        inMemoryNoahCookie = header;
        return header;
      }
    } catch {
      // ignore
    }
  }

  // 認証情報が存在すれば自動ログインを実行
  if (process.env.NOAH_LOGIN_ID && process.env.NOAH_PASSWORD) {
    console.log('🔄 [NOAH Auth] 有効なセッションCookieがないため、自動再ログインを実行します...');
    const result = await loginNoah();
    if (result.success && result.cookieHeader) {
      inMemoryNoahCookie = result.cookieHeader;
      return result.cookieHeader;
    } else {
      console.warn(`⚠️ [NOAH Auth] 自動ログインに失敗しました: ${result.message}`);
    }
  }

  return '';
}

/**
 * Fetches 21 days of availability slots for a given Noah store (or all stores) using pure Node fetch.
 */
export async function fetchNoahStoreDays(
  storeKey: string,
  baseDate: Date = new Date(),
  dayCount: number = 21
): Promise<NoahRoomData[]> {
  const store = NOAH_ALL_STORES.find(s => s.key === storeKey);
  if (!store) {
    console.warn(`[NOAH] 未知の店舗キー: ${storeKey}`);
    return [];
  }

  const existingSlotsMap = loadExistingNoahSlotsMap();
  console.log(`📡 [NOAH] ${store.name} のリアル空き枠を取得中 (Node fetch / ${dayCount}日間 / ${store.rooms.length}部屋)...`);

  // 店舗内にログイン必須部屋がある場合、Cookieを事前取得/リフレッシュ
  const hasLoginRequiredRooms = store.rooms.some(r => r.loginRequired);
  let cookieHeader = hasLoginRequiredRooms ? await getOrRefreshNoahCookie(false) : '';

  const startMonday = startOfWeek(baseDate, { weekStartsOn: 1 });
  const mondays: string[] = [
    format(startMonday, 'yyyy/MM/dd'),
    format(addDays(startMonday, 7), 'yyyy/MM/dd'),
    format(addDays(startMonday, 14), 'yyyy/MM/dd')
  ];
  if (dayCount > 21) {
    mondays.push(format(addDays(startMonday, 21), 'yyyy/MM/dd'));
  }

  const rawData: Record<number, any[]> = {};

  for (const st of store.rooms) {
    rawData[st.studioId] = [];
    // ログイン必須部屋のみCookieを付与。ログイン不要部屋はゲストアクセスで100%確実に取得！
    const effectiveCookie = st.loginRequired ? cookieHeader : '';

    for (const m of mondays) {
      try {
        const fetchSchedule = async (cookie: string) => {
          const url = `https://www.studionoah.jp/noahweb/Chart/schedule?studio_id=${st.studioId}&searchdate=${encodeURIComponent(m)}`;
          return await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json, text/javascript, */*; q=0.01',
              'Referer': `https://www.studionoah.jp/noahweb/webs/chart/${storeKey}/`,
              ...(cookie ? { 'Cookie': cookie } : {})
            }
          });
        };

        let res = await fetchSchedule(effectiveCookie);

        // ログイン必須部屋で失敗した場合、Cookie強制再取得して1回リトライ
        if (st.loginRequired && res.status !== 200 && process.env.NOAH_LOGIN_ID) {
          console.log(`⚠️ [NOAH Retry] ${st.name} のアクセスに失敗 (HTTP ${res.status})。セッション自動修復を実行します...`);
          const newCookie = await getOrRefreshNoahCookie(true);
          if (newCookie) {
            cookieHeader = newCookie;
            res = await fetchSchedule(newCookie);
          }
        }

        if (res.status === 200) {
          const json = await res.json();
          rawData[st.studioId].push(json);
        } else {
          rawData[st.studioId].push({ error: `HTTP ${res.status}` });
        }
      } catch (e: any) {
        rawData[st.studioId].push({ error: e.message });
      }
      await new Promise(r => setTimeout(r, 40));
    }
  }

  const targetDateStrings: string[] = [];
  for (let i = 0; i < dayCount; i++) {
    targetDateStrings.push(format(addDays(baseDate, i), 'yyyy-MM-dd'));
  }

  const results: NoahRoomData[] = [];

  for (const room of store.rooms) {
    const weeks = rawData[room.studioId] || [];
    const roomSlotsMap: Record<string, NoahSlot> = {};

    for (const weekData of weeks) {
      if (!weekData.date || !Array.isArray(weekData.date)) continue;

      for (const dayEntry of weekData.date) {
        const dateIso = dayEntry.date.replace(/\//g, '-');
        if (!dayEntry.time || !Array.isArray(dayEntry.time)) continue;

        for (const timeSlot of dayEntry.time) {
          const startTimeStr = timeSlot.start_time;
          const endTimeStr = timeSlot.end_time;

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

    // フェイルセーフ保護: ログイン必須部屋で0件の場合、既存キャッシュを維持
    let finalSlots = filteredSlots;
    if (finalSlots.length === 0 && room.loginRequired) {
      const cached = existingSlotsMap.get(room.id);
      if (cached && cached.length > 0) {
        finalSlots = cached;
        console.log(`  🛡️ [NOAH Protection] ${room.name}: セッション未所持/期限切れのため、既存キャッシュ(${cached.length}件)を保護・維持しました。`);
      }
    }

    results.push({
      id: room.id,
      storeKey,
      studioId: room.studioId,
      name: room.name,
      tatami: room.tatami,
      offset: room.offset,
      loginRequired: room.loginRequired,
      slots: finalSlots
    });
  }

  console.log(`  ✅ [NOAH] ${store.name}: ${results.length}部屋の取得完了`);
  return results;
}

/**
 * Convenience method for Noah Akihabara
 */
export async function fetchNoahAkibaDays(
  baseDate: Date = new Date(),
  dayCount: number = 21
): Promise<NoahRoomData[]> {
  return fetchNoahStoreDays('akihabara', baseDate, dayCount);
}

/**
 * Fetches all Noah branches in Tokyo (Shibuya x4, Shinjuku x1, Akihabara x1)
 */
export async function fetchAllNoahTokyoDays(
  baseDate: Date = new Date(),
  dayCount: number = 21
): Promise<NoahRoomData[]> {
  console.log(`🚀 [NOAH Tokyo] ノア全6店舗の一括クローリングを開始 (${dayCount}日間)...`);
  const allResults: NoahRoomData[] = [];

  for (const store of NOAH_ALL_STORES) {
    const storeResults = await fetchNoahStoreDays(store.key, baseDate, dayCount);
    allResults.push(...storeResults);
    // 人間らしい待機間隔
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`✨ [NOAH Tokyo] ノア全6店舗の取得完了: 計${allResults.length}部屋`);
  return allResults;
}
