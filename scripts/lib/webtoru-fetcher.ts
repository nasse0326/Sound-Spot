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

      // グリッドの起点時刻は店舗により異なる（STUDIO SUN西船橋店は06:00始まりだが、
      // Studio DIVO亀戸は10:00始まり等）。決め打ちにせず、レスポンス内のヘッダーラベル
      // （最初の<td class="hour-label">）から都度検出する。
      const headerHourMatch = html.match(/<td class="hour-label">(\d{2})<\/td>/);
      const baseHour = headerHourMatch ? parseInt(headerHourMatch[1], 10) : 6;

      // 部屋ごとの行を「<button ... data="X">...</button>」〜次の</tr>までの範囲で抽出し、
      // その中の <div class="reserve" style="...width:A%;left:B%;"> を全て拾う。
      const roomRowMatches = [...html.matchAll(/<button class="room[^"]*"\s+data="(\d+)">([\s\S]*?)<\/tr>/g)];

      for (const rowMatch of roomRowMatches) {
        const roomIdNum = parseInt(rowMatch[1], 10);
        if (!(roomIdNum in slotsByRoom)) continue;

        const rowHtml = rowMatch[2];
        const barMatches = [...rowHtml.matchAll(/<div class="reserve" style="[^"]*width:([\d.]+)%;left:([\d.]+)%;"><\/div>/g)];

        // baseHour起点、24時間(1440分)グリッド上の占有区間（予約済み or 営業時間外、いずれも「空きなし」扱い）。
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
          const hour = baseHour + colIdx; // 列0 = baseHour（店舗ごとにヘッダーから検出）

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

// 亀戸〜小岩エリア追加分（2026-09-21）。room_idはwebtoru.com/shop/169/calendarのPOST
// レスポンス内<button class="room" data="...">から実値を確認済み。全室00分スタート
// （このカレンダーは10:00始まりのグリッドで、fetchWebtoruShopDaysがヘッダーラベルから
// 自動検出するため店舗差異を個別対応する必要はない）。Ast(D-amp記載なし＝公式サイトの
// 機材リストページに常設ドラム記載が無い、他室と異なり実際に無い可能性がある)。
export const STUDIO_DIVO_KAMEIDO_ROOMS: WebtoruRoomSpec[] = [
  { id: 'divo-ast', roomIdNum: 427, name: 'Ast (14帖)', size_sqm: 23, capacity: 6, hourly_rate: 2600, day_rate: 1800, individual_rate: 800, start_time_offset: 0, features: ['Peavey 5150', 'Marshall JCM900', 'Roland JC-120', 'BASS::ULTRABASS BXD3000H', 'NOTE::Yamaha P-225B電子ピアノ常設（無料）、常設ドラムセットの記載なし'] },
  { id: 'divo-bst', roomIdNum: 429, name: 'Bst (10帖)', size_sqm: 17, capacity: 5, hourly_rate: 2300, day_rate: 1600, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Ampeg SVT-3 PRO', 'DRUM::TAMA STARCLASSIC', 'NOTE::Yamaha P-105電子ピアノ常設（無料）'] },
  { id: 'divo-cst', roomIdNum: 430, name: 'Cst (10帖)', size_sqm: 17, capacity: 5, hourly_rate: 2300, day_rate: 1600, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Peavey Deltabass + 810TVX', 'DRUM::TAMA STARCLASSIC', 'NOTE::Korg SP-280電子ピアノ常設（無料）'] },
  { id: 'divo-dst', roomIdNum: 431, name: 'Dst (18帖)', size_sqm: 30, capacity: 8, hourly_rate: 3200, day_rate: 2400, individual_rate: 800, start_time_offset: 0, features: ['Peavey 5150', 'Marshall JCM900', 'Roland JC-120', 'BASS::BEHRINGER ULTRABASS BX4500H', 'DRUM::TAMA STARCLASSIC', 'NOTE::Yamaha P-515電子ピアノ常設（無料）'] },
  { id: 'divo-est', roomIdNum: 428, name: 'Est (10帖)', size_sqm: 17, capacity: 5, hourly_rate: 2300, day_rate: 1600, individual_rate: 700, start_time_offset: 0, features: ['Marshall JCM900 sl-x', 'Roland JC-120', 'BASS::BEHRINGER ULTRABASS BX4500H', 'DRUM::TAMA ROCKSTAR', 'NOTE::Yamaha YDP-131電子ピアノ常設（無料）'] },
];

export async function fetchStudioDivoKameidoDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<WebtoruRoomData[]> {
  return fetchWebtoruShopDays(169, STUDIO_DIVO_KAMEIDO_ROOMS, 'Studio DIVO 亀戸', baseDate, dayCount);
}

// 松戸・柏エリア追加分（2026-09-21）。room_idはwebtoru.com/shop/173/calendarのPOST
// レスポンス内<button class="room" data="...">から実値を確認済み。A,B,F,Gは00分スタート、
// C,D,Eは30分スタート（公式サイトの明記と一致）。
export const STUDIO_DUGOUT2_MATSUDO_ROOMS: WebtoruRoomSpec[] = [
  { id: 'dugout2-ast', roomIdNum: 445, name: 'Ast (17畳)', size_sqm: 28, capacity: 9, hourly_rate: 3200, day_rate: 2700, individual_rate: 1100, start_time_offset: 0, features: ['アップライトピアノ YAMAHA U3', 'Marshall 2000 TSL100 + 1960A', 'Roland JC-120', 'BASS::Ampeg SVT3-PRO + SVT-810E', 'DRUM::Pearl Session Studio Classic', 'NOTE::天井高3500mm、CD再生可'] },
  { id: 'dugout2-bst', roomIdNum: 446, name: 'Bst (14畳)', size_sqm: 23, capacity: 8, hourly_rate: 2900, day_rate: 2400, individual_rate: 880, start_time_offset: 0, features: ['Marshall JVM205H + 1960A', 'Roland JC-120', 'BASS::Ampeg SVT3-PRO + SVT-810E', 'DRUM::Pearl Session Studio Classic', 'NOTE::天井高3500mm、CD再生可'] },
  { id: 'dugout2-cst', roomIdNum: 447, name: 'Cst (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 2400, day_rate: 1900, individual_rate: 770, start_time_offset: 30, features: ['Marshall JCM2000DSL + 1960A', 'Roland JC-120', 'BASS::HARTKE HA3500 + 4.5XL', 'DRUM::Pearl Session Studio Classic', 'NOTE::CD再生可'] },
  { id: 'dugout2-dst', roomIdNum: 448, name: 'Dst (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 2400, day_rate: 1900, individual_rate: 770, start_time_offset: 30, features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::Ampeg PF-500 + SVT410HE', 'DRUM::Pearl Session Studio Classic', 'NOTE::CD再生可'] },
  { id: 'dugout2-est', roomIdNum: 449, name: 'Est (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 2400, day_rate: 1900, individual_rate: 770, start_time_offset: 30, features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::HARTKE HA3500 + 4.5XL', 'DRUM::Pearl Session Studio Classic', 'NOTE::CD再生可'] },
  { id: 'dugout2-fst', roomIdNum: 450, name: 'Fst (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 2400, day_rate: 1900, individual_rate: 770, start_time_offset: 0, features: ['Marshall JCM2000DSL + 1960A', 'Roland JC-120', 'BASS::Ampeg PF-500 + SVT410HE', 'DRUM::Pearl Session Studio Classic', 'NOTE::CD再生可'] },
  { id: 'dugout2-gst', roomIdNum: 451, name: 'Gst (10畳)', size_sqm: 17, capacity: 5, hourly_rate: 2400, day_rate: 1900, individual_rate: 770, start_time_offset: 0, features: ['Marshall 900 + 1960A', 'Roland JC-120', 'BASS::HARTKE HA3500 + 4.5XL', 'DRUM::Pearl Session Studio Classic', 'NOTE::CD再生可'] },
];

export async function fetchStudioDugout2MatsudoDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<WebtoruRoomData[]> {
  return fetchWebtoruShopDays(173, STUDIO_DUGOUT2_MATSUDO_ROOMS, 'スタジオ ダグアウト2', baseDate, dayCount);
}
