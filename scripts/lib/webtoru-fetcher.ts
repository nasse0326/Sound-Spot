/**
 * webtoru.com（ウェブトル、STUDIO SUN西船橋店等が使う予約ASP）向けフェッチャー。
 * ログイン不要でPOST /shop/<id>/user_reserves/calendar/<date> を叩くと、その日の
 * 全室タイムラインをHTML断片で返す。各部屋の行は
 * `<button class="room ..." data="<roomIdNum>">部屋名 予約<br />(00分スタート|30分スタート)...`、
 * 続く<td colspan="24">内に `<div class="reserve" style="...width:X%;left:Y%;">` が
 * 実際に埋まっている時間帯（予約済み or 営業時間外）を絶対配置のバーとして表現している
 * （色は予約ごとに変わるだけで、色自体に意味はない）。バーで覆われていない時間帯が空き。
 * 24列のヘッダーは06→23→00→05の24時間分（06:00始まり、翌日06:00で一周）。
 */
import { format, addDays } from 'date-fns';
import { toIsoWithRollover } from './time-utils';
import { CRAWL_DAY_COUNT } from '../../src/config/crawl-schedule';

export interface WebtoruRoomSlot {
  id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED';
}

export interface WebtoruRoomData {
  id: string;
  name: string;
  size_sqm: number;
  capacity: number;
  hourly_rate: number;
  day_rate?: number;
  individual_rate: number;
  features: string[];
  start_time_offset: number;
  slots: WebtoruRoomSlot[];
}

export interface WebtoruRoomSpec {
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
}

export async function fetchWebtoruShopDays(
  shopId: number,
  rooms: WebtoruRoomSpec[],
  storeLabel: string,
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<WebtoruRoomData[]> {
  console.log(`📡 [webtoru] ${storeLabel}の高速取得（Node fetch / ${dayCount}日間）を開始...`);

  const slotsByRoom: Record<number, WebtoruRoomSlot[]> = {};
  rooms.forEach((r) => { slotsByRoom[r.roomIdNum] = []; });

  for (let d = 0; d < dayCount; d++) {
    const dateStr = format(addDays(baseDate, d), 'yyyy-MM-dd');
    try {
      const res = await fetch(`https://webtoru.com/shop/${shopId}/user_reserves/calendar/${dateStr}`, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!res.ok) {
        console.warn(`  ⚠️ [webtoru] ${storeLabel} ${dateStr} HTTP ${res.status}`);
        continue;
      }

      const html = await res.text();

      // 部屋ごとの行を「<button ... data="X">...</button>」〜次の</tr>までの範囲で抽出し、
      // その中の <div class="reserve" style="...width:A%;left:B%;"> を全て拾う。
      const roomRowMatches = [...html.matchAll(/<button class="room[^"]*"\s+data="(\d+)">([\s\S]*?)<\/tr>/g)];

      for (const rowMatch of roomRowMatches) {
        const roomIdNum = parseInt(rowMatch[1], 10);
        if (!(roomIdNum in slotsByRoom)) continue;

        const rowHtml = rowMatch[2];
        const barMatches = [...rowHtml.matchAll(/<div class="reserve" style="[^"]*width:([\d.]+)%;left:([\d.]+)%;"><\/div>/g)];

        // 06:00起点、24時間(1440分)グリッド上の占有区間（予約済み or 営業時間外、いずれも「空きなし」扱い）。
        const occupied: { start: number; end: number }[] = barMatches.map((m) => {
          const widthPct = parseFloat(m[1]);
          const leftPct = parseFloat(m[2]);
          const startMin = Math.round((leftPct / 100) * 1440);
          const endMin = Math.round(((leftPct + widthPct) / 100) * 1440);
          return { start: startMin, end: endMin };
        });

        // 部屋ラベルの「00分/30分スタート」に対応する実際の開始分（グリッド上のバー位置は
        // この部屋の実開始分に関わらず実時刻をそのまま反映しているため、列の実時刻だけを
        // このoffsetで決定すればよい。Music man/reserve1-fetcherと同じ考え方）。
        const spec = rooms.find((r) => r.roomIdNum === roomIdNum);
        const offset = spec?.start_time_offset || 0;

        for (let colIdx = 0; colIdx < 24; colIdx++) {
          const colStartMin = colIdx * 60;
          const colEndMin = colStartMin + 60;
          const isOccupied = occupied.some((o) => o.start < colEndMin && o.end > colStartMin);
          const hour = 6 + colIdx; // 列0 = 06:00

          slotsByRoom[roomIdNum].push({
            id: `slot-webtoru-${shopId}-${roomIdNum}-${dateStr}-${String(colIdx).padStart(2, '0')}`,
            start_time: toIsoWithRollover(dateStr, hour, offset),
            end_time: toIsoWithRollover(dateStr, hour + 1, offset),
            status: isOccupied ? 'BOOKED' : 'AVAILABLE',
          });
        }
      }

      await new Promise((r) => setTimeout(r, 100));
    } catch (err: any) {
      console.error(`  ❌ [webtoru] ${storeLabel} ${dateStr} 取得エラー:`, err.message);
    }
  }

  const result: WebtoruRoomData[] = rooms.map((spec) => ({
    id: spec.id,
    name: spec.name,
    size_sqm: spec.size_sqm,
    capacity: spec.capacity,
    hourly_rate: spec.hourly_rate,
    day_rate: spec.day_rate,
    individual_rate: spec.individual_rate,
    features: spec.features,
    start_time_offset: spec.start_time_offset,
    slots: slotsByRoom[spec.roomIdNum] || [],
  }));

  console.log(`  ✅ [webtoru] ${storeLabel}: ${result.length}部屋、計${result.reduce((a, b) => a + b.slots.length, 0)}スロット取得完了`);
  return result;
}

// 船橋エリア追加分（2026-09-20）。room_idはwebtoru.com/shop/3/calendarのPOSTレスポンス内
// <button class="room" data="...">から実値を確認済み。offsetはボタンラベルの
// 「(00分スタート)」「(30分スタート)」表記から取得（実際のバー描画は実時刻そのままで、
// offsetの影響を受けないため、列→実時刻変換にのみこの値を使う）。
export const STUDIOSUN_NISHIFUNABASHI_ROOMS: WebtoruRoomSpec[] = [
  { id: 'studiosun-ast', roomIdNum: 17, name: 'Ast (18畳)', size_sqm: 30, capacity: 8, hourly_rate: 3800, day_rate: 3000, individual_rate: 900, start_time_offset: 0, features: ['Marshall JCM2000', 'Marshall JCM800', 'Roland JC120', 'Fender TwinReverb', 'BASS::Ampeg SVT350H + AmpegSVT410HE', 'DRUM::DW コレクターズシリーズ(10/12/14/16/22)', 'NOTE::KORG SP250電子ピアノ常設'] },
  { id: 'studiosun-bst', roomIdNum: 18, name: 'Bst (13畳)', size_sqm: 21, capacity: 6, hourly_rate: 3400, day_rate: 2400, individual_rate: 800, start_time_offset: 30, features: ['Marshall JVM210H', 'Roland JC120 x2', 'BASS::Hartke 3500A + AmpegSVT410HE', 'DRUM::PEARL MCX(10/12/13/16/22)', 'NOTE::鏡あり'] },
  { id: 'studiosun-cst', roomIdNum: 19, name: 'Cst (13畳)', size_sqm: 21, capacity: 6, hourly_rate: 3400, day_rate: 2400, individual_rate: 800, start_time_offset: 0, features: ['Marshall JVM210H', 'Roland JC120', 'YAMAHA VR-6000', 'BASS::Hartke 3500A + AmpegSVT410HE', 'DRUM::PEARL MCX(10/12/13/16/22)', 'NOTE::鏡あり'] },
  { id: 'studiosun-dst', roomIdNum: 21, name: 'Dst (13畳)', size_sqm: 21, capacity: 6, hourly_rate: 3400, day_rate: 2400, individual_rate: 800, start_time_offset: 30, features: ['Marshall JCM900', 'Roland JC120 x2', 'BASS::Hartke 3500A + AmpegSVT410HE', 'DRUM::PEARL MCX(10/12/13/16/22)', 'NOTE::鏡あり'] },
  { id: 'studiosun-est', roomIdNum: 22, name: 'Est (13畳)', size_sqm: 21, capacity: 6, hourly_rate: 3400, day_rate: 2400, individual_rate: 800, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC120', 'YAMAHA G100-212', 'BASS::Hartke 3500A + AmpegSVT410HE', 'DRUM::PEARL MCX(10/12/13/16/22)', 'NOTE::鏡あり'] },
  { id: 'studiosun-fst', roomIdNum: 23, name: 'Fst (11畳)', size_sqm: 18, capacity: 5, hourly_rate: 3000, day_rate: 2000, individual_rate: 800, start_time_offset: 30, features: ['Marshall JCM900', 'Roland JC120', 'PEAVEY BANDIT112S', 'BASS::Hartke 2500A + AmpegSVT410HE', 'DRUM::PEARL MCX(10/12/13/16/22)'] },
  { id: 'studiosun-gst', roomIdNum: 24, name: 'Gst (11畳)', size_sqm: 18, capacity: 5, hourly_rate: 3000, day_rate: 2000, individual_rate: 800, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC120', 'PEAVEY BANDIT112S', 'BASS::Hartke 2500A + AmpegSVT410HE', 'DRUM::PEARL MCX(10/12/13/16/22)'] },
];

export async function fetchStudioSunNishiFunabashiDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<WebtoruRoomData[]> {
  return fetchWebtoruShopDays(3, STUDIOSUN_NISHIFUNABASHI_ROOMS, 'STUDIO SUN 西船橋店', baseDate, dayCount);
}
