/**
 * Studio Penta Shinjuku Realtime Availability Fetcher
 * Reads data directly from Penta's Supabase Edge Functions KV-API
 * which powers https://availability-board-shinjuku.netlify.app/
 */

import { format, addDays } from 'date-fns';
import { toIsoWithRollover } from './time-utils';

const EDGE_URL = 'https://haphgzntwgrpecdkqdxj.supabase.co/functions/v1/kv-api';
const ANON_KEY = 'sb_publishable_PrzDhRxppQe_1rV51V2ulg_e-tZlEJi';

export interface PentaKVBlock {
  id: string;
  roomId: string; // e.g. "r1", "room-1788090000889"
  startTick: number; // 0 = 06:00, each tick is 30min
  endTick: number;
}

export interface PentaRoomSlot {
  id: string;
  start_time: string; // "10:00"
  end_time: string; // "10:30"
  status: 'AVAILABLE' | 'BOOKED';
}

export interface PentaRoomData {
  id: string; // e.g. "penta-shinjuku-101"
  kvRoomId: string; // e.g. "r1"
  name: string; // e.g. "101st L"
  floor: string; // e.g. "1F"
  slots: PentaRoomSlot[];
}

export interface PentaRoomDef {
  id: string;
  kvRoomId: string;
  name: string;
  floor: string;
  order: number;
  tatami: number;
  capacity: number;
  priceRegular: number;
  priceDaytime: number;
  priceSolo: number;
}

// Fixed master list of all 19 rooms in Penta Shinjuku matching KV database
export const PENTA_SHINJUKU_ROOM_DEFS: PentaRoomDef[] = [
  { id: 'penta-shinjuku-101', kvRoomId: 'r1', name: '101st L (16帖)', floor: '1F', order: 1, tatami: 16, capacity: 7, priceRegular: 3520, priceDaytime: 2530, priceSolo: 880 },
  { id: 'penta-shinjuku-102', kvRoomId: 'r2', name: '102st L (16帖)', floor: '1F', order: 2, tatami: 16, capacity: 7, priceRegular: 3520, priceDaytime: 2530, priceSolo: 880 },
  { id: 'penta-shinjuku-103', kvRoomId: 'r3', name: '103st L (16帖)', floor: '1F', order: 3, tatami: 16, capacity: 7, priceRegular: 3520, priceDaytime: 2530, priceSolo: 880 },
  { id: 'penta-shinjuku-201', kvRoomId: 'r4', name: '201st M (14帖)', floor: '2F', order: 4, tatami: 14, capacity: 6, priceRegular: 3190, priceDaytime: 2200, priceSolo: 880 },
  { id: 'penta-shinjuku-202', kvRoomId: 'r5', name: '202st M (14帖)', floor: '2F', order: 5, tatami: 14, capacity: 6, priceRegular: 3190, priceDaytime: 2200, priceSolo: 880 },
  { id: 'penta-shinjuku-203', kvRoomId: 'r6', name: '203st M (14帖)', floor: '2F', order: 6, tatami: 14, capacity: 6, priceRegular: 3190, priceDaytime: 2200, priceSolo: 880 },
  { id: 'penta-shinjuku-204', kvRoomId: 'r7', name: '204st M (14帖)', floor: '2F', order: 7, tatami: 14, capacity: 6, priceRegular: 3190, priceDaytime: 2200, priceSolo: 880 },
  { id: 'penta-shinjuku-301', kvRoomId: 'r8', name: '301st M (14帖)', floor: '3F', order: 8, tatami: 14, capacity: 6, priceRegular: 3190, priceDaytime: 2200, priceSolo: 880 },
  { id: 'penta-shinjuku-302', kvRoomId: 'r9', name: '302st M (12帖)', floor: '3F', order: 9, tatami: 12, capacity: 5, priceRegular: 2860, priceDaytime: 1980, priceSolo: 880 },
  { id: 'penta-shinjuku-303', kvRoomId: 'r10', name: '303st M (12帖)', floor: '3F', order: 10, tatami: 12, capacity: 5, priceRegular: 2860, priceDaytime: 1980, priceSolo: 880 },
  { id: 'penta-shinjuku-304', kvRoomId: 'r11', name: '304st M (12帖)', floor: '3F', order: 11, tatami: 12, capacity: 5, priceRegular: 2860, priceDaytime: 1980, priceSolo: 880 },
  { id: 'penta-shinjuku-401', kvRoomId: 'r12', name: '401st M (12帖)', floor: '4F', order: 12, tatami: 12, capacity: 5, priceRegular: 2860, priceDaytime: 1980, priceSolo: 880 },
  { id: 'penta-shinjuku-402', kvRoomId: 'room-1788090000889', name: '402st M (10帖)', floor: '4F', order: 13, tatami: 10, capacity: 5, priceRegular: 2640, priceDaytime: 1760, priceSolo: 880 },
  { id: 'penta-shinjuku-403', kvRoomId: 'room-1788090010405', name: '403st M (10帖)', floor: '4F', order: 14, tatami: 10, capacity: 5, priceRegular: 2640, priceDaytime: 1760, priceSolo: 880 },
  { id: 'penta-shinjuku-404', kvRoomId: 'room-1788090016568', name: '404st M (10帖)', floor: '4F', order: 15, tatami: 10, capacity: 5, priceRegular: 2640, priceDaytime: 1760, priceSolo: 880 },
  { id: 'penta-shinjuku-501', kvRoomId: 'room-1788090021681', name: '501st M (12帖)', floor: '5F', order: 16, tatami: 12, capacity: 5, priceRegular: 2860, priceDaytime: 1980, priceSolo: 880 },
  { id: 'penta-shinjuku-502', kvRoomId: 'room-1788090027856', name: '502st M (10帖)', floor: '5F', order: 17, tatami: 10, capacity: 5, priceRegular: 2640, priceDaytime: 1760, priceSolo: 880 },
  { id: 'penta-shinjuku-503', kvRoomId: 'room-1788090032110', name: '503st M (10帖)', floor: '5F', order: 18, tatami: 10, capacity: 5, priceRegular: 2640, priceDaytime: 1760, priceSolo: 880 },
  { id: 'penta-shinjuku-504', kvRoomId: 'room-1788090037201', name: '504st L (16帖)', floor: '5F', order: 19, tatami: 16, capacity: 7, priceRegular: 3520, priceDaytime: 2530, priceSolo: 880 },
];

// 日本の祝日判定(振替休日含む、~2099年まで有効な計算式ベース)
function getJapaneseHolidaySet(year: number): Set<string> {
  const holidays = new Set<string>();
  const add = (m: number, d: number) =>
    holidays.add(`${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  const nthMonday = (month: number, n: number) => {
    const d = new Date(year, month - 1, 1);
    let count = 0;
    while (true) {
      if (d.getDay() === 1) {
        count++;
        if (count === n) return d.getDate();
      }
      d.setDate(d.getDate() + 1);
    }
  };
  add(1, 1); // 元日
  add(1, nthMonday(1, 2)); // 成人の日
  add(2, 11); // 建国記念の日
  add(2, 23); // 天皇誕生日
  const shunbun = Math.floor(20.8431 + 0.242194 * (year - 1980)) - Math.floor((year - 1980) / 4);
  add(3, shunbun); // 春分の日
  add(4, 29); // 昭和の日
  add(5, 3); // 憲法記念日
  add(5, 4); // みどりの日
  add(5, 5); // こどもの日
  add(7, nthMonday(7, 3)); // 海の日
  add(8, 11); // 山の日
  add(9, nthMonday(9, 3)); // 敬老の日
  const shubun = Math.floor(23.2488 + 0.242194 * (year - 1980)) - Math.floor((year - 1980) / 4);
  add(9, shubun); // 秋分の日
  add(10, nthMonday(10, 2)); // スポーツの日
  add(11, 3); // 文化の日
  add(11, 23); // 勤労感謝の日

  // 振替休日
  const toDateStr = (d: Date) => format(d, 'yyyy-MM-dd');
  const substitutes: string[] = [];
  for (const key of holidays) {
    const d = new Date(key + 'T00:00:00');
    if (d.getDay() === 0) {
      const s = new Date(d);
      do {
        s.setDate(s.getDate() + 1);
      } while (holidays.has(toDateStr(s)));
      substitutes.push(toDateStr(s));
    }
  }
  return holidays;
}

const HOLIDAY_CACHE: Record<number, Set<string>> = {};

function isBoardOperatingDay(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  if (day === 0 || day === 6) return true;
  const year = Number(dateStr.slice(0, 4));
  if (!HOLIDAY_CACHE[year]) HOLIDAY_CACHE[year] = getJapaneseHolidaySet(year);
  return HOLIDAY_CACHE[year].has(dateStr);
}

export function isWeekendOrHoliday(dateStr: string): boolean {
  return isBoardOperatingDay(dateStr);
}

/**
 * 06:00基準のtick（30分刻み）を ISO文字列 ("YYYY-MM-DDTHH:mm:00+09:00") に変換
 * tick 0 = 06:00, tick 8 = 10:00, tick 36 = 24:00 (翌日00:00)
 *
 * 以前はここで独自にDateオブジェクトの生成・ローカルタイムゾーン基準のgetDate()等を
 * 使って日付を組み立てており、GitHub Actions（UTC実行）で全ての日付が1日早くズレる
 * バグがあった（手元のJST設定PCでは再現しないため長期間気づかれなかった）。
 * 実行環境のタイムゾーンに依存しない共通関数toIsoWithRolloverに委譲する。
 */
function tickToDateTime(dateStr: string, tick: number): string {
  const totalMinutes = 6 * 60 + tick * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return toIsoWithRollover(dateStr, hours, minutes);
}

/**
 * 06:00基準のtick（30分刻み）を "HH:mm" 文字列に変換
 */
function tickToTime(tick: number): string {
  const totalMinutes = 6 * 60 + tick * 30;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Supabase Edge Functions KV からブロックデータを取得
 */
async function fetchDayBlocks(dateStr: string): Promise<PentaKVBlock[]> {
  const params = new URLSearchParams({
    key: `shinjuku:availability-blocks:${dateStr}`,
    shared: 'true',
  });
  const res = await fetch(`${EDGE_URL}/data?${params}`, {
    headers: { apikey: ANON_KEY },
  });
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`KV API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!data || !data.value) return [];
  const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
  return Array.isArray(val) ? val : [];
}

/**
 * ペンタ新宿店の指定日・指定日数の空き情報を取得
 * スタッフが手入力で公開している土日祝日のみスロットを生成
 */
export async function fetchPentaShinjukuDays(
  baseDate: Date,
  dayCount: number = 21
): Promise<PentaRoomData[]> {
  console.log(`📡 [スタジオペンタ新宿店] リアルタイム空き状況ボード（Supabase KV / ${dayCount}日間）の取得を開始...`);

  const roomMap = new Map<string, PentaRoomData>();
  for (const def of PENTA_SHINJUKU_ROOM_DEFS) {
    roomMap.set(def.kvRoomId, {
      id: def.id,
      kvRoomId: def.kvRoomId,
      name: def.name,
      floor: def.floor,
      slots: [],
    });
  }

  // 営業時間: 10:00 (tick 8) 〜 24:00 (tick 36) の各30分枠
  const START_TICK = 8; // 10:00
  const END_TICK = 36; // 24:00

  let operatingDaysCount = 0;

  for (let i = 0; i < dayCount; i++) {
    const targetDate = addDays(baseDate, i);
    const dateStr = format(targetDate, 'yyyy-MM-dd');

    // 土日祝日のみ判定（平日はスタッフ非運用・電話案内）
    if (!isBoardOperatingDay(dateStr)) {
      continue;
    }

    try {
      const blocks = await fetchDayBlocks(dateStr);
      operatingDaysCount++;

      for (const def of PENTA_SHINJUKU_ROOM_DEFS) {
        const roomData = roomMap.get(def.kvRoomId)!;
        const roomBlocks = blocks.filter((b) => b.roomId === def.kvRoomId);

        for (let tick = START_TICK; tick < END_TICK; tick++) {
          const startTime = tickToTime(tick);
          const startDateTime = tickToDateTime(dateStr, tick);
          const endDateTime = tickToDateTime(dateStr, tick + 1);

          // この枠がブロック（使用中）と重なっているか判定
          const isBooked = roomBlocks.some((b) => tick >= b.startTick && tick < b.endTick);

          roomData.slots.push({
            id: `${def.id}-${dateStr}-${startTime.replace(':', '')}`,
            start_time: startDateTime,
            end_time: endDateTime,
            status: isBooked ? 'BOOKED' : 'AVAILABLE',
          });
        }
      }
    } catch (err: any) {
      console.warn(`⚠️ [スタジオペンタ新宿店] ${dateStr} の取得エラー: ${err.message}`);
    }
  }

  console.log(`✅ [スタジオペンタ新宿店] 取得完了（対象日数: ${operatingDaysCount}日（土日祝）, 全19部屋）`);
  return Array.from(roomMap.values());
}
