/**
 * HMVP大手町スタジオ／新御徒町スタジオ（hmvp.net、ビッグバンド練習用の大型レンタルスタジオ）
 * 向けフェッチャー。両スタジオとも1店舗=1部屋（大部屋を貸し切る形式）で、他の予約ASPのような
 * 日付ごとのAPIは無く、https://www.hmvp.net/studio/schedule.html 1ページに数ヶ月分の
 * スケジュール表が丸ごと静的HTMLとして埋め込まれている（<h3 id="09">2026年 9月</h3>に続く
 * <table class="schetb">内、日付ごとの<tr class="col_day">行）。
 * 各行は「時間帯リスト（<br>区切り）」と「同じ数だけ並ぶラベルリスト（空 or 予約団体名）」の
 * 2カラムがペアになっている（col_ote_t/col_ote=大手町、col_shin_t/col_shin=新御徒町）。
 * 予約は毎時00分区切りのため、パース後は1時間単位のスロットに正規化する。
 */
import { format, addDays } from 'date-fns';
import { toIsoWithRollover } from './time-utils';
import { CRAWL_DAY_COUNT } from '../../src/config/crawl-schedule';

export interface HmvpSlot {
  id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED';
}

export interface HmvpRoomData {
  id: string;
  name: string;
  size_sqm: number;
  capacity: number;
  hourly_rate: number;
  individual_rate: number;
  features: string[];
  start_time_offset: number;
  slots: HmvpSlot[];
}

interface HmvpStudioSpec {
  key: 'ote' | 'shin';
  id: string;
  name: string;
  size_sqm: number;
  capacity: number;
  hourly_rate: number;
  individual_rate: number;
  features: string[];
}

// 料金は2時間パック制（例: 大手町平日10-18時=6,325円/2h）のため、平日10-18時の
// 2時間料金÷2を代表値としてhourly_rateに採用（表示用の目安であり、実際は時間帯・曜日で変動）。
const HMVP_STUDIOS: HmvpStudioSpec[] = [
  {
    key: 'ote',
    id: 'hmvp-otemachi',
    name: '大手町スタジオ (30畳)',
    size_sqm: 50,
    capacity: 17,
    hourly_rate: 3163,
    individual_rate: 1265,
    features: ['グランドピアノ常設', 'ウッドベース常設', 'ドラムセット常設', 'PA常設', 'ビッグバンド17名収容可', '平日10-18時は個人利用プランあり(1名1,265円/h)'],
  },
  {
    key: 'shin',
    id: 'hmvp-shinokachimachi',
    name: '新御徒町スタジオ (35畳)',
    size_sqm: 58,
    capacity: 17,
    hourly_rate: 2530,
    individual_rate: 2530,
    features: ['グランドピアノ常設', 'ウッドベース常設', 'ドラムセット常設', 'PA常設', 'ビッグバンド17名収容可', '個人利用プランなし(最少2時間〜)'],
  },
];

interface DayBlock {
  dateStr: string;
  oteRanges: { startMin: number; endMin: number; available: boolean }[];
  shinRanges: { startMin: number; endMin: number; available: boolean }[];
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function parseRangesAndLabels(timeCellHtml: string, labelCellHtml: string): { startMin: number; endMin: number; available: boolean }[] {
  const rangeTexts = timeCellHtml.split(/<br\s*\/?>/i).map(stripTags).filter((t) => t.length > 0);
  const labelTexts = labelCellHtml.split(/<br\s*\/?>/i).map(stripTags).filter((t) => t.length > 0);

  if (rangeTexts.length === 0 || rangeTexts.length !== labelTexts.length) {
    return [];
  }

  const results: { startMin: number; endMin: number; available: boolean }[] = [];
  for (let i = 0; i < rangeTexts.length; i++) {
    const m = rangeTexts[i].match(/(\d{1,2}):(\d{2})[〜～](\d{1,2}):(\d{2})/);
    if (!m) continue;
    const startMin = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    const endMin = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
    results.push({ startMin, endMin, available: labelTexts[i].includes('空') });
  }
  return results;
}

function rangesToHourlySlots(ranges: { startMin: number; endMin: number; available: boolean }[], dateStr: string, idPrefix: string): HmvpSlot[] {
  if (ranges.length === 0) return [];
  const minStart = Math.min(...ranges.map((r) => r.startMin));
  const maxEnd = Math.max(...ranges.map((r) => r.endMin));
  const slots: HmvpSlot[] = [];

  for (let h = Math.floor(minStart / 60); h < Math.ceil(maxEnd / 60); h++) {
    const hourStartMin = h * 60;
    const covering = ranges.find((r) => r.startMin <= hourStartMin && r.endMin > hourStartMin);
    if (!covering) continue;

    slots.push({
      id: `slot-${idPrefix}-${dateStr}-${String(h).padStart(2, '0')}`,
      start_time: toIsoWithRollover(dateStr, h, 0),
      end_time: toIsoWithRollover(dateStr, h + 1, 0),
      status: covering.available ? 'AVAILABLE' : 'BOOKED',
    });
  }
  return slots;
}

export async function fetchHmvpDays(
  baseDate: Date = new Date(),
  dayCount: number = CRAWL_DAY_COUNT
): Promise<HmvpRoomData[]> {
  console.log(`📡 [HMVP] 大手町・新御徒町スタジオの高速取得（Node fetch / ${dayCount}日間）を開始...`);

  const targetDateStrs = new Set<string>();
  for (let d = 0; d < dayCount; d++) {
    targetDateStrs.add(format(addDays(baseDate, d), 'yyyy-MM-dd'));
  }

  const dayBlocks: DayBlock[] = [];

  try {
    const res = await fetch('https://www.hmvp.net/studio/schedule.html', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    if (!res.ok) {
      console.warn(`  ⚠️ [HMVP] スケジュールページ取得失敗 HTTP ${res.status}`);
      return HMVP_STUDIOS.map((s) => ({ ...s, slots: [] }));
    }
    const html = await res.text();

    // 月見出し（<h3 class="schmon" id="09">2026年 9月</h3>）ごとにチャンク分割し、
    // その月に属する<tr class="col_day">行だけを対象にその年・月を適用する。
    const monthHeadingRe = /<h3 class="schmon" id="\d+">(\d{4})年\s*(\d{1,2})月<\/h3>/g;
    const headingMatches = [...html.matchAll(monthHeadingRe)];

    for (let i = 0; i < headingMatches.length; i++) {
      const year = parseInt(headingMatches[i][1], 10);
      const chunkStart = headingMatches[i].index! + headingMatches[i][0].length;
      const chunkEnd = i + 1 < headingMatches.length ? headingMatches[i + 1].index! : html.length;
      const chunk = html.slice(chunkStart, chunkEnd);

      const rowRe = /<tr class="col_day">([\s\S]*?)<\/tr>/g;
      let rowMatch: RegExpExecArray | null;
      while ((rowMatch = rowRe.exec(chunk))) {
        const rowHtml = rowMatch[1];
        const dateMatch = rowHtml.match(/<td[^>]*>(\d{1,2})\/(\d{1,2})<\/td>/);
        if (!dateMatch) continue;
        const month = parseInt(dateMatch[1], 10);
        const day = parseInt(dateMatch[2], 10);
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (!targetDateStrs.has(dateStr)) continue;

        const oteTMatch = rowHtml.match(/<td class="col_ote_t">([\s\S]*?)<\/td>/);
        const oteMatch = rowHtml.match(/<td class="col_ote">([\s\S]*?)<\/td>/);
        const shinTMatch = rowHtml.match(/<td class="col_shin_t">([\s\S]*?)<\/td>/);
        const shinMatch = rowHtml.match(/<td class="col_shin">([\s\S]*?)<\/td>/);

        dayBlocks.push({
          dateStr,
          oteRanges: oteTMatch && oteMatch ? parseRangesAndLabels(oteTMatch[1], oteMatch[1]) : [],
          shinRanges: shinTMatch && shinMatch ? parseRangesAndLabels(shinTMatch[1], shinMatch[1]) : [],
        });
      }
    }
  } catch (err: any) {
    console.error('  ❌ [HMVP] 取得エラー:', err.message);
  }

  const result: HmvpRoomData[] = HMVP_STUDIOS.map((spec) => {
    const slots: HmvpSlot[] = [];
    for (const block of dayBlocks) {
      const ranges = spec.key === 'ote' ? block.oteRanges : block.shinRanges;
      slots.push(...rangesToHourlySlots(ranges, block.dateStr, spec.id));
    }
    return {
      id: spec.id,
      name: spec.name,
      size_sqm: spec.size_sqm,
      capacity: spec.capacity,
      hourly_rate: spec.hourly_rate,
      individual_rate: spec.individual_rate,
      features: spec.features,
      start_time_offset: 0,
      slots,
    };
  });

  console.log(`  ✅ [HMVP] ${result.length}部屋、計${result.reduce((a, b) => a + b.slots.length, 0)}スロット取得完了`);
  return result;
}
