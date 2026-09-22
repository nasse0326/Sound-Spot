/**
 * 音楽スタジオ ensemble（上野、s-ens.net）向けフェッチャー。
 * ログイン不要でPOST /reserve/index.cgi に targetDay=YYYYMMDD を送ると、その日の
 * 4部屋（A/B/C/D studio）分の空き状況テーブルをHTML全体の一部として返す。
 * グリッドは10:00始まり30分刻み26列（10:00〜23:00）で、各部屋の行は
 * `<th><div>A studio</div></th>` に続く一連の`<td class="reserved|nonreserved" colspan="N">`
 * （colspanは省略時1、属性の引用符・順序はレスポンスによって揺れるため緩く読む）。
 * 月曜定休日は全列reservedとして返ってくるため、特別扱い不要でそのままBOOKED判定で正しい。
 */
import { format, addDays } from 'date-fns';
import { toIsoWithRollover } from './time-utils';
import { CRAWL_DAY_COUNT } from '../../src/config/crawl-schedule';

export interface EnsembleSlot {
  id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED';
}

export interface EnsembleRoomData {
  id: string;
  name: string;
  size_sqm: number;
  capacity: number;
  hourly_rate: number;
  day_rate: number;
  individual_rate: number;
  features: string[];
  start_time_offset: number;
  slots: EnsembleSlot[];
}

export interface EnsembleRoomSpec {
  letter: 'A' | 'B' | 'C' | 'D';
  id: string;
  name: string;
  size_sqm: number;
  capacity: number;
  hourly_rate: number;
  day_rate: number;
  individual_rate: number;
  start_time_offset: number;
  features: string[];
}

const GRID_START_HOUR = 10;

export const ENSEMBLE_UENO_ROOMS: EnsembleRoomSpec[] = [
  { letter: 'A', id: 'ensemble-ueno-ast', name: 'Ast (11帖)', size_sqm: 18, capacity: 6, hourly_rate: 2600, day_rate: 1600, individual_rate: 700, start_time_offset: 0, features: ['アップライトピアノ常設'] },
  { letter: 'B', id: 'ensemble-ueno-bst', name: 'Bst (11帖)', size_sqm: 18, capacity: 6, hourly_rate: 2600, day_rate: 1600, individual_rate: 700, start_time_offset: 0, features: ['正方形に近い部屋形状でバンドの音合わせに最適'] },
  { letter: 'C', id: 'ensemble-ueno-cst', name: 'Cst (13帖)', size_sqm: 21, capacity: 7, hourly_rate: 2900, day_rate: 2200, individual_rate: 800, start_time_offset: 30, features: ['一辺の壁全面に鏡を設置、ライブリハに最適'] },
  { letter: 'D', id: 'ensemble-ueno-dst', name: 'Dst (8帖)', size_sqm: 13, capacity: 4, hourly_rate: 2300, day_rate: 1600, individual_rate: 700, start_time_offset: 30, features: ['落ち着いた小部屋、個人練習・少人数向け'] },
];

export async function fetchEnsembleUenoDays(
  baseDate: Date = new Date(),
  dayCount: number = CRAWL_DAY_COUNT
): Promise<EnsembleRoomData[]> {
  console.log(`📡 [ensemble] 音楽スタジオ ensemble（上野）の高速取得（Node fetch / ${dayCount}日間）を開始...`);

  const slotsByLetter: Record<string, EnsembleSlot[]> = { A: [], B: [], C: [], D: [] };

  for (let d = 0; d < dayCount; d++) {
    const dateStr = format(addDays(baseDate, d), 'yyyy-MM-dd');
    const targetDay = dateStr.replace(/-/g, '');
    try {
      const res = await fetch('https://s-ens.net/reserve/index.cgi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: `targetDay=${targetDay}`,
      });

      if (!res.ok) {
        console.warn(`  ⚠️ [ensemble] ${dateStr} HTTP ${res.status}`);
        continue;
      }

      const html = await res.text();
      const rowRe = /<th class="cap">\s*<div>([A-D]) studio<\/div>\s*<\/th>([\s\S]*?)<\/tr>/g;
      let rowMatch: RegExpExecArray | null;

      while ((rowMatch = rowRe.exec(html))) {
        const letter = rowMatch[1];
        const rowHtml = rowMatch[2];
        const cellRe = /<td\s+([^>]*)>/g;
        let cellMatch: RegExpExecArray | null;
        let colIdx = 0;

        while ((cellMatch = cellRe.exec(rowHtml))) {
          const attrs = cellMatch[1];
          const classMatch = attrs.match(/class=["']?(reserved|nonreserved)["']?/);
          if (!classMatch) continue;
          const colspanMatch = attrs.match(/colspan=["']?(\d+)["']?/);
          const colspan = colspanMatch ? parseInt(colspanMatch[1], 10) : 1;
          const isReserved = classMatch[1] === 'reserved';

          for (let i = 0; i < colspan; i++) {
            const slotStartMin = GRID_START_HOUR * 60 + colIdx * 30;
            const startH = Math.floor(slotStartMin / 60);
            const startM = slotStartMin % 60;
            const endMin = slotStartMin + 30;
            const endH = Math.floor(endMin / 60);
            const endM = endMin % 60;

            slotsByLetter[letter].push({
              id: `slot-ensemble-ueno-${letter.toLowerCase()}-${dateStr}-${String(colIdx).padStart(2, '0')}`,
              start_time: toIsoWithRollover(dateStr, startH, startM),
              end_time: toIsoWithRollover(dateStr, endH, endM),
              status: isReserved ? 'BOOKED' : 'AVAILABLE',
            });
            colIdx++;
          }
        }
      }

      await new Promise((r) => setTimeout(r, 150));
    } catch (err: any) {
      console.error(`  ❌ [ensemble] ${dateStr} 取得エラー:`, err.message);
    }
  }

  const result: EnsembleRoomData[] = ENSEMBLE_UENO_ROOMS.map((spec) => ({
    id: spec.id,
    name: spec.name,
    size_sqm: spec.size_sqm,
    capacity: spec.capacity,
    hourly_rate: spec.hourly_rate,
    day_rate: spec.day_rate,
    individual_rate: spec.individual_rate,
    features: spec.features,
    start_time_offset: spec.start_time_offset,
    slots: slotsByLetter[spec.letter] || [],
  }));

  console.log(`  ✅ [ensemble] 音楽スタジオ ensemble: ${result.length}部屋、計${result.reduce((a, b) => a + b.slots.length, 0)}スロット取得完了`);
  return result;
}
