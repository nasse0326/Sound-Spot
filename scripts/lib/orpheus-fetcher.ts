/**
 * オルフェウスレコーズ系列（SOUND STUDIO M）が使う独自の予約システム
 * (orpheusrecords.info/RoomSituation.php) 向けフェッチャー。ログイン不要のGETで
 * 「全室・1日分の空き状況表」をHTMLで直接返す（studi-ol.comの無人営業時間帯専用ページとは
 * 別物。小岩店の場合、有人営業時間帯（日中〜夜）はこちらのシステムのみが正、
 * studi-ol.com/shop/751は深夜・早朝の無人営業時間帯のみを扱うため、全日の実データが
 * 必要な場合はこちらを使う）。
 * 各セルは、空きなら `<input type="submit" value="○">`（hidden input "stime" に
 * "YYYYMMDDHHmm"形式の正確な開始時刻）、埋まっていれば素の "×" テキストのみとなる。
 * 列は1時間刻みで24列固定（0時始まり）のため、列インデックスからも実時刻を復元できる。
 */
import { format, addDays } from 'date-fns';
import { toIsoWithRollover } from './time-utils';
import { CRAWL_DAY_COUNT } from '../../src/config/crawl-schedule';

export interface OrpheusRoomSlot {
  id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED';
}

export interface OrpheusRoomData {
  id: string;
  name: string;
  size_sqm: number;
  capacity: number;
  hourly_rate: number;
  day_rate?: number;
  individual_rate: number;
  features: string[];
  start_time_offset: number;
  slots: OrpheusRoomSlot[];
}

export interface OrpheusRoomSpec {
  id: string;
  roomLabel: string; // "301A" 等、RoomSituation.php上の<TH>表示ラベルと完全一致させる
  name: string;
  size_sqm: number;
  capacity: number;
  hourly_rate: number;
  day_rate?: number;
  individual_rate: number;
  start_time_offset: number;
  features: string[];
}

export async function fetchOrpheusStudioDays(
  pno: number,
  rooms: OrpheusRoomSpec[],
  storeLabel: string,
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<OrpheusRoomData[]> {
  console.log(`📡 [Orpheus] ${storeLabel}の高速取得（Node fetch / ${dayCount}日間）を開始...`);

  const slotsByRoom: Record<string, OrpheusRoomSlot[]> = {};
  rooms.forEach((r) => { slotsByRoom[r.roomLabel] = []; });

  for (let d = 0; d < dayCount; d++) {
    const dateStr = format(addDays(baseDate, d), 'yyyy-MM-dd');
    const [y, m, day] = dateStr.split('-');
    try {
      const res = await fetch(`http://www.orpheusrecords.info/RoomSituation.php?pno=${pno}&yyear=${y}&ymonth=${m}&yday=${day}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      });

      if (!res.ok) {
        console.warn(`  ⚠️ [Orpheus] ${storeLabel} ${dateStr} HTTP ${res.status}`);
        continue;
      }

      const html = await res.text();

      // 部屋ごとの行を「<TH...>部屋名</TH>」〜次の</TR>までの範囲で抽出する。
      const roomRowMatches = [...html.matchAll(/<TH[^>]*>\s*([0-9]{3}[A-Z])\s*<\/TH>[\s\S]*?<\/TR>/gi)];

      for (const rowMatch of roomRowMatches) {
        const roomLabel = rowMatch[1];
        if (!(roomLabel in slotsByRoom)) continue;

        const rowHtml = rowMatch[0];
        // 部屋名・広さ・開始分を表す先頭3つの<TH>を除いた残りが、1時間ごと24列の<TD>。
        const cellMatches = [...rowHtml.matchAll(/<TD[^>]*>([\s\S]*?)<\/td>/gi)];

        for (let colIdx = 0; colIdx < cellMatches.length && colIdx < 24; colIdx++) {
          const cellHtml = cellMatches[colIdx][1];
          const stimeMatch = cellHtml.match(/name="stime"\s+value="(\d{12})"/);
          const isAvailable = /value="○"/.test(cellHtml);

          let hour: number;
          let minute: number;
          if (stimeMatch) {
            hour = parseInt(stimeMatch[1].substring(8, 10), 10);
            minute = parseInt(stimeMatch[1].substring(10, 12), 10);
          } else {
            // 埋まっているセルにはstimeが無いため、列インデックス（0時始まり1時間刻み）
            // と部屋の開始分（start_time_offset）から実時刻を算出する。
            const spec = rooms.find((r) => r.roomLabel === roomLabel);
            hour = colIdx;
            minute = spec?.start_time_offset || 0;
          }

          slotsByRoom[roomLabel].push({
            id: `slot-orpheus-${pno}-${roomLabel}-${dateStr}-${String(colIdx).padStart(2, '0')}`,
            start_time: toIsoWithRollover(dateStr, hour, minute),
            end_time: toIsoWithRollover(dateStr, hour + 1, minute),
            status: isAvailable ? 'AVAILABLE' : 'BOOKED',
          });
        }
      }

      await new Promise((r) => setTimeout(r, 100));
    } catch (err: any) {
      console.error(`  ❌ [Orpheus] ${storeLabel} ${dateStr} 取得エラー:`, err.message);
    }
  }

  const result: OrpheusRoomData[] = rooms.map((r) => ({
    id: r.id,
    name: r.name,
    size_sqm: r.size_sqm,
    capacity: r.capacity,
    hourly_rate: r.hourly_rate,
    day_rate: r.day_rate,
    individual_rate: r.individual_rate,
    features: r.features,
    start_time_offset: r.start_time_offset,
    slots: slotsByRoom[r.roomLabel] || [],
  }));

  console.log(`  ✅ [Orpheus] ${storeLabel}: ${result.length}部屋、計${result.reduce((a, b) => a + b.slots.length, 0)}スロット取得完了`);
  return result;
}

// pno=1はorpheusrecords.info上でSOUND STUDIO M小岩店を指す（ブラウザ実地確認済み）。
// 部屋タイプ別の帖数・料金は公式サイト料金表（Type A/B/C/D）、機材は機材ページ
// （studioごと機材紹介）から取得。開始分は「毎時00分スタート」「毎時30分スタート」の
// 公式案内と一致（studi-ol.com/shop/751のstarttime属性とも整合確認済み）。
export const SOUND_STUDIO_M_KOIWA_ROOMS: OrpheusRoomSpec[] = [
  { id: 'soundm-koiwa-301', roomLabel: '301A', name: '301st (20畳)', size_sqm: 33, capacity: 12, hourly_rate: 4180, day_rate: 3410, individual_rate: 750, start_time_offset: 0, features: ['Marshall JCM900', 'MESA BOOGIE Dual Rectifier', 'Roland JC-120', 'BASS::Ampeg SVT-450', 'DRUM::Pearl MMX(12/13/16/22)', 'NOTE::KAWAI Uplightピアノ（オプション¥220/h）'] },
  { id: 'soundm-koiwa-302', roomLabel: '302D', name: '302st (7畳)', size_sqm: 12, capacity: 4, hourly_rate: 1870, day_rate: 1210, individual_rate: 750, start_time_offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Gallien Krueger 400RBIV', 'DRUM::YAMAHA Birch Custom(10/12/14/20)'] },
  { id: 'soundm-koiwa-303', roomLabel: '303C', name: '303st (9畳)', size_sqm: 15, capacity: 4, hourly_rate: 2750, day_rate: 1760, individual_rate: 750, start_time_offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Ampeg B2R', 'DRUM::Pearl MRX(12/13/16/22)'] },
  { id: 'soundm-koiwa-304', roomLabel: '304C', name: '304st (9畳)', size_sqm: 15, capacity: 4, hourly_rate: 2750, day_rate: 1760, individual_rate: 750, start_time_offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Ampeg B2R', 'DRUM::Pearl Masters Studio(12/13/16/22)'] },
  { id: 'soundm-koiwa-305', roomLabel: '305B', name: '305st (14畳)', size_sqm: 23, capacity: 7, hourly_rate: 3850, day_rate: 2860, individual_rate: 750, start_time_offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'PEAVEY 6505+', 'BASS::Ampeg SVT-350', 'DRUM::Pearl MMX(12/13/16/22)'] },
  { id: 'soundm-koiwa-306', roomLabel: '306C', name: '306st (9畳)', size_sqm: 15, capacity: 4, hourly_rate: 2750, day_rate: 1760, individual_rate: 750, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Ampeg B2R', 'DRUM::CANOPUS Birch(12/13/16/22)'] },
  { id: 'soundm-koiwa-307', roomLabel: '307C', name: '307st (9畳)', size_sqm: 15, capacity: 4, hourly_rate: 2750, day_rate: 1760, individual_rate: 750, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Ampeg B2R', 'DRUM::CANOPUS YAIBAII GROOVE KIT(12/13/16/22)'] },
  { id: 'soundm-koiwa-409', roomLabel: '409C', name: '409st (9畳)', size_sqm: 15, capacity: 4, hourly_rate: 2750, day_rate: 1760, individual_rate: 750, start_time_offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Ampeg B2R', 'DRUM::TAMA Starclassic(10/12/14/20)', 'NOTE::KAWAI Grand Piano A1L常設（オプション¥330/h）'] },
  { id: 'soundm-koiwa-410', roomLabel: '410C', name: '410st (9畳)', size_sqm: 15, capacity: 4, hourly_rate: 2750, day_rate: 1760, individual_rate: 750, start_time_offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'BASS::Gallien Krueger 400RBIV', 'DRUM::TAMA Starclassic(10/12/14/20)'] },
  { id: 'soundm-koiwa-411', roomLabel: '411B', name: '411st (14畳)', size_sqm: 23, capacity: 7, hourly_rate: 3850, day_rate: 2860, individual_rate: 750, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'PEAVEY 6505+', 'BASS::Ampeg SVT450', 'DRUM::Pearl MMX(10/12/13/16/22)', 'NOTE::YAMAHA Uplightピアノ常設（オプション¥220/h）'] },
  { id: 'soundm-koiwa-412', roomLabel: '412A', name: '412st (20畳)', size_sqm: 33, capacity: 12, hourly_rate: 4180, day_rate: 3410, individual_rate: 750, start_time_offset: 0, features: ['Marshall JCM2000', 'Roland JC-120', 'MESA Dual Rectifire', 'BASS::Ampeg SVT450', 'DRUM::SAKAE The Almighty Birch(12/13/16/22)', 'NOTE::Roland RD-700 E.Piano常設（オプション¥220/h）、Roland KC-300キーボードアンプ常設'] },
  { id: 'soundm-koiwa-413', roomLabel: '413B', name: '413st (14畳)', size_sqm: 23, capacity: 7, hourly_rate: 3850, day_rate: 2860, individual_rate: 750, start_time_offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'MESA Dual Rectifire', 'BASS::Ampeg SVT450', 'DRUM::YAMAHA Oak Custom(10/12/13/16/22)', 'NOTE::Roland RD-700GX E.Piano常設（オプション¥220/h）'] },
];

export async function fetchSoundStudioMKoiwaDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<OrpheusRoomData[]> {
  return fetchOrpheusStudioDays(1, SOUND_STUDIO_M_KOIWA_ROOMS, 'SOUND STUDIO M 小岩店', baseDate, dayCount);
}
