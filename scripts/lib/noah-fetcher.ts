/**
 * Pure Node fetch Scraper for Sound Studio NOAH Official Schedule API (/noahweb/Chart/schedule)
 * Completely eliminates Playwright and browser overhead!
 * Seamlessly fetches 21 days of slot data for all Noah branches in Shibuya, Shinjuku, and Akihabara.
 */
import fs from 'fs';
import path from 'path';
import { format, addDays, startOfWeek } from 'date-fns';
import { loginNoah } from './noah-login';
import { NOAH_ALL_STORES, NoahRoomMaster, NoahStoreMaster } from '../../src/config/noah-master';

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

export type NoahRoomDef = NoahRoomMaster;
export type NoahStoreDef = NoahStoreMaster;

// 部屋マスター（studioId・tatami・offset・loginRequired・実料金・実機材）は
// src/config/noah-master.ts に一本化されている。以前はここに同じ内容を
// 手動で複製しており、IDのズレで部屋データが静かに欠落するリスクがあった。
export { NOAH_ALL_STORES };

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
  // 基準日からの21日間をいかなる曜日（日曜日含む）でも100%カバーするため、5週分（0, 7, 14, 21, 28日後）をフェッチ
  const mondays: string[] = [
    format(startMonday, 'yyyy/MM/dd'),
    format(addDays(startMonday, 7), 'yyyy/MM/dd'),
    format(addDays(startMonday, 14), 'yyyy/MM/dd'),
    format(addDays(startMonday, 21), 'yyyy/MM/dd'),
    format(addDays(startMonday, 28), 'yyyy/MM/dd'),
  ];

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

          let [sH, sM] = startTimeStr.split(':').map(Number);
          let [eH, eM] = endTimeStr.split(':').map(Number);

          // 24時以降の営業日時刻（例: 24:30 -> 翌日 00:30, 25:30 -> 翌日 01:30）を正規のISO日時に変換
          const baseDateObj = new Date(`${dateIso}T00:00:00+09:00`);
          let startDaysOffset = 0;
          if (sH >= 24) {
            startDaysOffset = Math.floor(sH / 24);
            sH = sH % 24;
          }
          const actualStartDateObj = addDays(baseDateObj, startDaysOffset);
          const actualStartDateIso = format(actualStartDateObj, 'yyyy-MM-dd');
          const normalizedStartTimeStr = `${String(sH).padStart(2, '0')}:${String(sM).padStart(2, '0')}`;
          const startIso = `${actualStartDateIso}T${normalizedStartTimeStr}:00+09:00`;

          // 終了時刻の正規化
          let endDaysOffset = 0;
          if (eH >= 24) {
            endDaysOffset = Math.floor(eH / 24);
            eH = eH % 24;
          } else if (eH < sH || (eH === 0 && sH >= 23)) {
            endDaysOffset = startDaysOffset + 1;
          } else {
            endDaysOffset = startDaysOffset;
          }
          const actualEndDateObj = addDays(baseDateObj, endDaysOffset);
          const actualEndDateIso = format(actualEndDateObj, 'yyyy-MM-dd');
          const normalizedEndTimeStr = `${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}`;
          const endIso = `${actualEndDateIso}T${normalizedEndTimeStr}:00+09:00`;

          const isBooked = Boolean(timeSlot.is_booked);
          const isBookable = Boolean(timeSlot.is_bookable || timeSlot.web_reserve_flg || timeSlot.has_price);
          const status: 'AVAILABLE' | 'BOOKED' = (!isBooked && isBookable) ? 'AVAILABLE' : 'BOOKED';

          const timeKey = `${actualStartDateIso.replace(/-/g, '')}-${normalizedStartTimeStr.replace(':', '')}`;
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
 * Fetches all Noah branches in Tokyo (Shibuya x4, Shinjuku x1, Akihabara x1, Ochanomizu x1)
 */
export async function fetchAllNoahTokyoDays(
  baseDate: Date = new Date(),
  dayCount: number = 21
): Promise<NoahRoomData[]> {
  console.log(`🚀 [NOAH Tokyo] ノア全${NOAH_ALL_STORES.length}店舗の一括クローリングを開始 (${dayCount}日間)...`);
  const allResults: NoahRoomData[] = [];

  for (const store of NOAH_ALL_STORES) {
    const storeResults = await fetchNoahStoreDays(store.key, baseDate, dayCount);
    allResults.push(...storeResults);
    // 人間らしい待機間隔
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`✨ [NOAH Tokyo] ノア全${NOAH_ALL_STORES.length}店舗の取得完了: 計${allResults.length}部屋`);
  return allResults;
}
