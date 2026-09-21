/**
 * クラウドナインスタジオ（cloud9-web.jp、2026年2月に更新された新予約システム）向けフェッチャー。
 * ログイン不要のPOST /api/studio-room-reserved-times が {studio_id, reservation_start_at}
 * だけで日別の「部屋ごとの15分単位予約済み時刻一覧」を返すことをNext.jsのJSバンドル
 * （studio.rooms.reserved.times のペイロード定義）を解析して特定した。
 * 部屋一覧・各部屋の曜日別営業時間（studio_room_operating_hour）は変動が少ないため、
 * 公式サイトを直接確認して得た値をRoomSpecとして静的に持ち、日々変わる予約状況だけを
 * このAPIから取得する。
 */
import { format, addDays } from 'date-fns';
import { toIsoWithRollover } from './time-utils';
import { CRAWL_DAY_COUNT } from '../../src/config/crawl-schedule';

export interface Cloud9RoomSlot {
  id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED';
}

export interface Cloud9RoomData {
  id: string;
  name: string;
  size_sqm: number;
  capacity: number;
  hourly_rate: number;
  day_rate?: number;
  individual_rate: number;
  features: string[];
  start_time_offset: number;
  slots: Cloud9RoomSlot[];
}

export interface Cloud9RoomSpec {
  id: string;
  roomIdNum: number;
  name: string;
  size_sqm: number;
  capacity: number;
  hourly_rate: number;
  day_rate?: number;
  individual_rate: number;
  start_time_offset: number;
  features: string[];
  weekdayStartHour: number; // 分は必ずstart_time_offsetと一致（例: 10:30開始ならweekdayStartHour=10）
  weekendStartHour: number;
}

function isWeekendOrHoliday(dateStr: string): boolean {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun, 6=Sat
  // 祝日judgeは行わない（既存フェッチャー群と同様の簡略化）。土日のみ休日料金/営業時間帯を適用する。
  return dow === 0 || dow === 6;
}

export async function fetchCloud9StudioDays(
  studioId: number,
  rooms: Cloud9RoomSpec[],
  storeLabel: string,
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<Cloud9RoomData[]> {
  console.log(`📡 [Cloud9] ${storeLabel}の高速取得（公開API / ${dayCount}日間）を開始...`);

  const slotsByRoom: Record<number, Cloud9RoomSlot[]> = {};
  rooms.forEach((r) => { slotsByRoom[r.roomIdNum] = []; });

  for (let d = 0; d < dayCount; d++) {
    const dateStr = format(addDays(baseDate, d), 'yyyy-MM-dd');
    try {
      const res = await fetch('https://cloud9-web.jp/api/studio-room-reserved-times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studio_id: studioId, reservation_start_at: dateStr }),
      });

      if (!res.ok) {
        console.warn(`  ⚠️ [Cloud9] ${storeLabel} ${dateStr} HTTP ${res.status}`);
        continue;
      }

      const json: Record<string, { studio_room_id: number; reserved_times: string[] }> = await res.json();
      const weekend = isWeekendOrHoliday(dateStr);

      for (const r of rooms) {
        const reservedSet = new Set(json[String(r.roomIdNum)]?.reserved_times || []);
        const startHour = weekend ? r.weekendStartHour : r.weekdayStartHour;
        const offset = r.start_time_offset;

        // 営業終了は翌朝6時台（部屋によりoffset分だけ後ろ倒し）のため、
        // startHourから翌日6時台まで1時間刻みで生成する（24時制、hourは24以上に伸びて良い）。
        for (let hour = startHour; hour < 24 + 6; hour++) {
          const slotStartMin = hour * 60 + offset;
          const quarterMarks = [0, 15, 30, 45].map((m) => {
            const totalMin = slotStartMin + m;
            const hh = Math.floor(totalMin / 60) % 24;
            const mm = totalMin % 60;
            return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
          });
          const isBooked = quarterMarks.some((mark) => reservedSet.has(mark));

          slotsByRoom[r.roomIdNum].push({
            id: `slot-cloud9-${studioId}-${r.roomIdNum}-${dateStr}-${String(hour).padStart(2, '0')}`,
            start_time: toIsoWithRollover(dateStr, Math.floor(slotStartMin / 60), slotStartMin % 60),
            end_time: toIsoWithRollover(dateStr, Math.floor(slotStartMin / 60) + 1, slotStartMin % 60),
            status: isBooked ? 'BOOKED' : 'AVAILABLE',
          });
        }
      }

      await new Promise((r) => setTimeout(r, 100));
    } catch (err: any) {
      console.error(`  ❌ [Cloud9] ${storeLabel} ${dateStr} 取得エラー:`, err.message);
    }
  }

  const result: Cloud9RoomData[] = rooms.map((r) => ({
    id: r.id,
    name: r.name,
    size_sqm: r.size_sqm,
    capacity: r.capacity,
    hourly_rate: r.hourly_rate,
    day_rate: r.day_rate,
    individual_rate: r.individual_rate,
    features: r.features,
    start_time_offset: r.start_time_offset,
    slots: slotsByRoom[r.roomIdNum] || [],
  }));
  console.log(`  ✅ [Cloud9] ${storeLabel}: ${result.length}部屋、計${result.reduce((a, b) => a + b.slots.length, 0)}スロット取得完了`);
  return result;
}

// studio_id=4、room id群はcloud9-web.jpの /api/studio-rooms レスポンス（ブラウザ実地確認）から
// 確認済み。曜日別開始時刻（weekdayStartHour/weekendStartHour + start_time_offset）も同レスポンスの
// studio_room_operating_hour.weekday_start_time/weekend_holiday_start_timeと一致させている。
export const CLOUD9_YOKOHAMA_KITAGUCHI_ROOMS: Cloud9RoomSpec[] = [
  { id: 'cloud9-yn-ast', roomIdNum: 34, name: 'Ast (18畳)', size_sqm: 30, capacity: 10, hourly_rate: 3520, day_rate: 2970, individual_rate: 880, start_time_offset: 30, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo', 'BASS::Ampeg SVT-450H + SVT-810E', 'DRUM::Pearl Carbon Ply Maple Series', 'NOTE::キーボードYAMAHA CP-50(330円/h)'] },
  { id: 'cloud9-yn-bst', roomIdNum: 35, name: 'Bst (11畳)', size_sqm: 18, capacity: 6, hourly_rate: 2750, day_rate: 2200, individual_rate: 880, start_time_offset: 15, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo', 'BASS::Ampeg SVT-450H + SVT-810E', 'DRUM::Pearl MMP Series'] },
  { id: 'cloud9-yn-cst', roomIdNum: 36, name: 'Cst (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 2640, day_rate: 2090, individual_rate: 880, start_time_offset: 15, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JVM210H', 'Roland JC-120', 'Fender HotRod Deville III 212', 'BASS::Ampeg SVT-450H + SVT-810E', 'DRUM::Pearl MMP Series'] },
  { id: 'cloud9-yn-dst', roomIdNum: 37, name: 'Dst (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 2640, day_rate: 2090, individual_rate: 880, start_time_offset: 15, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo', 'BASS::Ampeg SVT-450H + SVT-810E', 'DRUM::Pearl MMP Series'] },
  { id: 'cloud9-yn-est', roomIdNum: 38, name: 'Est (20畳)', size_sqm: 33, capacity: 12, hourly_rate: 3740, day_rate: 3190, individual_rate: 880, start_time_offset: 0, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo', 'BASS::Ampeg SVT-450H + SVT-810E', 'DRUM::Pearl CarbonCore', 'NOTE::キーボードYAMAHA CP-50(330円/h)'] },
  { id: 'cloud9-yn-fst', roomIdNum: 39, name: 'Fst (15畳)', size_sqm: 25, capacity: 8, hourly_rate: 3190, day_rate: 2640, individual_rate: 880, start_time_offset: 0, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo', 'BASS::Markbass LittleMarkRocker 500 + Standard 108HR', 'DRUM::YAMAHA Recording Custom'] },
  { id: 'cloud9-yn-gst', roomIdNum: 40, name: 'Gst (15畳)', size_sqm: 25, capacity: 8, hourly_rate: 3190, day_rate: 2640, individual_rate: 880, start_time_offset: 30, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo', 'BASS::Hartke HA3500 + Ampeg SVT-810E', 'DRUM::YAMAHA LIVE CUSTOM Series', 'NOTE::キーボードYAMAHA CP-40(330円/h)'] },
  { id: 'cloud9-yn-hst', roomIdNum: 41, name: 'Hst (11畳)', size_sqm: 18, capacity: 6, hourly_rate: 2750, day_rate: 2200, individual_rate: 880, start_time_offset: 30, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo', 'BASS::Hartke HA3500 + 410XL x2', 'DRUM::YAMAHA LIVE CUSTOM Series'] },
  { id: 'cloud9-yn-ist', roomIdNum: 42, name: 'Ist (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 2640, day_rate: 2090, individual_rate: 880, start_time_offset: 30, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JVM210H', 'Roland JC-120', 'Fender HotRod Deville III 212', 'BASS::Hartke HA3500 + 410XL x2', 'DRUM::YAMAHA Recording Custom'] },
  { id: 'cloud9-yn-jst', roomIdNum: 32, name: 'Jst (13畳)', size_sqm: 21, capacity: 7, hourly_rate: 2970, day_rate: 2420, individual_rate: 880, start_time_offset: 0, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo', 'BASS::Hartke HA3500 + 410XL x2', 'DRUM::YAMAHA Recording Custom'] },
  { id: 'cloud9-yn-kst', roomIdNum: 33, name: 'Kst (18畳)', size_sqm: 30, capacity: 10, hourly_rate: 3520, day_rate: 2970, individual_rate: 880, start_time_offset: 0, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo', 'BASS::Markbass LittleMarkRocker 500 + Standard 108HR', 'DRUM::YAMAHA Absolute Hybrid Maple', 'NOTE::キーボードYAMAHA CP-40(330円/h)'] },
];

export async function fetchCloud9YokohamaKitaguchiDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<Cloud9RoomData[]> {
  return fetchCloud9StudioDays(4, CLOUD9_YOKOHAMA_KITAGUCHI_ROOMS, 'クラウドナインスタジオ 横浜北口店', baseDate, dayCount);
}

// 町田エリア追加分（2026-09-21）。studio_id=3、room id群はcloud9-web.jpの
// /api/studio-rooms レスポンス（ブラウザ実地確認、studio_id=3・団体/個人いずれでも
// 同一13室）から取得。部屋ラベルはAst(19)を起点に、group（1:A-D室群, 2:ダンス室,
// 3:Piano1/2室, 4:Piano3室, 5:Est-Gst室群, 6:Hst/Ist室群）とsequenceの組み合わせで
// 19〜31番まで連番になっており、各室の開始分（studio_room_operating_hour）から
// A/B/C/D=0分、Piano1/2=0分、Piano3=30分、E/F/G=30分、H/I=15分と一致することを
// 確認済み（ダンスst=id23は対象外）。
export const CLOUD9_MACHIDA_ROOMS: Cloud9RoomSpec[] = [
  { id: 'cloud9-mc-ast', roomIdNum: 19, name: 'Ast (26帖)', size_sqm: 43, capacity: 13, hourly_rate: 3663, day_rate: 3168, individual_rate: 770, start_time_offset: 0, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JCM900', 'Marshall JCM2000', 'Roland JC-120', 'Fender Twin Amp01', 'BASS::Ampeg SVT-3pro + SVT-810E', 'DRUM::Pearl Reference series + Zildjian A', 'NOTE::YAMAHA CP-5キーボード常設(330円/h)'] },
  { id: 'cloud9-mc-bst', roomIdNum: 20, name: 'Bst (13帖)', size_sqm: 21, capacity: 7, hourly_rate: 2574, day_rate: 2079, individual_rate: 770, start_time_offset: 0, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JCM900', 'Roland JC-120', 'Fender Twin Amp01', 'BASS::Ampeg SVT-450H + SVT-810E', 'DRUM::Pearl BMP series + SABIAN AA'] },
  { id: 'cloud9-mc-cst', roomIdNum: 21, name: 'Cst (11帖)', size_sqm: 18, capacity: 6, hourly_rate: 2475, day_rate: 1980, individual_rate: 770, start_time_offset: 0, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JCM900', 'Roland JC-120', 'Fender Twin Amp01', 'BASS::Ampeg SVT-450H + SVT-810E', 'DRUM::Pearl MRP series + SABIAN AA'] },
  { id: 'cloud9-mc-dst', roomIdNum: 22, name: 'Dst (15帖)', size_sqm: 25, capacity: 8, hourly_rate: 2871, day_rate: 2376, individual_rate: 770, start_time_offset: 0, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JCM900', 'Roland JC-120', 'Fender Twin Amp01', 'BASS::Markbass LittleMarkRocker500 + Standard108HR', 'DRUM::Pearl Carbonply Maple series + SABIAN AA'] },
  { id: 'cloud9-mc-est', roomIdNum: 27, name: 'Est (10帖)', size_sqm: 17, capacity: 5, hourly_rate: 2376, day_rate: 1881, individual_rate: 770, start_time_offset: 30, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JCM900', 'Roland JC-120', 'Fender Twin Amp01', 'BASS::Ampeg SVT-450H + SVT-610HLF', 'DRUM::Pearl MMP series + SABIAN AA'] },
  { id: 'cloud9-mc-fst', roomIdNum: 28, name: 'Fst (10帖)', size_sqm: 17, capacity: 5, hourly_rate: 2376, day_rate: 1881, individual_rate: 770, start_time_offset: 30, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JCM900', 'Roland JC-120', 'Fender Twin Amp01', 'BASS::Ampeg SVT-450H + SVT-610HLF', 'DRUM::Pearl MMP series + SABIAN AA'] },
  { id: 'cloud9-mc-gst', roomIdNum: 29, name: 'Gst (15帖)', size_sqm: 25, capacity: 8, hourly_rate: 2871, day_rate: 2376, individual_rate: 770, start_time_offset: 30, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JCM900', 'Roland JC-120', 'Fender Twin Amp01', 'BASS::Ampeg SVT-450H + SVT-810E', 'DRUM::Pearl MMP series + SABIAN AA', 'NOTE::YAMAHA U3Aアップライトピアノ常設(330円/h)'] },
  { id: 'cloud9-mc-hst', roomIdNum: 30, name: 'Hst (13帖)', size_sqm: 21, capacity: 7, hourly_rate: 2574, day_rate: 2079, individual_rate: 770, start_time_offset: 15, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JCM900', 'Roland JC-120', 'Fender Super-Sonic60combo', 'BASS::Ampeg SVT-450H + SVT-810E', 'DRUM::YAMAHA absolute series maple + SABIAN AA'] },
  { id: 'cloud9-mc-ist', roomIdNum: 31, name: 'Ist (10帖)', size_sqm: 17, capacity: 5, hourly_rate: 2376, day_rate: 1881, individual_rate: 770, start_time_offset: 15, weekdayStartHour: 10, weekendStartHour: 9, features: ['Marshall JCM900', 'Roland JC-120', 'Fender Super-Sonic60combo', 'BASS::Ampeg SVT-450H + SVT-610HLF', 'DRUM::YAMAHA absolute series Birch + SABIAN AA'] },
  { id: 'cloud9-mc-p1st', roomIdNum: 24, name: 'Piano1 st (10帖)', size_sqm: 17, capacity: 5, hourly_rate: 2310, day_rate: 1980, individual_rate: 1650, start_time_offset: 0, weekdayStartHour: 10, weekendStartHour: 9, features: ['Roland JC-120', 'NOTE::YAMAHA G3Eグランドピアノ常設'] },
  { id: 'cloud9-mc-p2st', roomIdNum: 25, name: 'Piano2 st (4.5帖)', size_sqm: 7, capacity: 2, hourly_rate: 2200, day_rate: 1870, individual_rate: 1540, start_time_offset: 0, weekdayStartHour: 10, weekendStartHour: 9, features: ['NOTE::グランドピアノ常設'] },
  { id: 'cloud9-mc-p3st', roomIdNum: 26, name: 'Piano3 st (4帖)', size_sqm: 7, capacity: 2, hourly_rate: 2090, day_rate: 1760, individual_rate: 1430, start_time_offset: 30, weekdayStartHour: 10, weekendStartHour: 9, features: ['NOTE::グランドピアノ常設'] },
];

export async function fetchCloud9MachidaDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<Cloud9RoomData[]> {
  return fetchCloud9StudioDays(3, CLOUD9_MACHIDA_ROOMS, 'クラウドナインスタジオ 町田店', baseDate, dayCount);
}
