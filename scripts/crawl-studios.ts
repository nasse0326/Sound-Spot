/**
 * SoundSpot Automated Studio Crawler
 * Executed periodically via GitHub Actions (or locally) to update live studio availability.
 * Completely Playwright-free, powered by pure Node fetch!
 */
import fs from 'fs';
import path from 'path';
import { format, addDays } from 'date-fns';
import { createClient } from '@supabase/supabase-js';
import { fetchReserve1Days } from './lib/reserve1-fetcher';
import { fetchBotAkibaDays, fetchBotTakadanobabaDays, fetchBotIkebukuroDays } from './lib/bot-fetcher';
import { fetchOngakukanAkibaDays, fetchOngakukanShinjukuWestDays, fetchOngakukanTakadanobabaDays } from './lib/ongakukan-fetcher';
import { fetchAllNoahTokyoDays } from './lib/noah-fetcher';
import { fetchNodeShinjukuDays } from './lib/node-fetcher';
import { fetchPentaShinjukuDays } from './lib/penta-fetcher';
import { toUUID } from './lib/id-utils';

// Supabase client initialization (service_role or anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
let supabase: ReturnType<typeof createClient> | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (err: any) {
    console.warn(`⚠️ [Supabase] クライアント初期化をスキップしました: ${err?.message}`);
  }
}

/**
 * availability_slotsへ200件ずつupsertし、実際の成功/失敗件数を正しく報告する。
 * 以前は個々のチャンクが全て失敗しても「同期完了！」と表示してしまっていたため、
 * 実際の成否をラベル付きでログ出力するよう共通化。
 */
async function upsertAvailabilitySlots(label: string, rawDbSlots: any[]): Promise<void> {
  if (!supabase || rawDbSlots.length === 0) return;

  // 深夜営業（24時以降）のロールオーバー処理により、日をまたいだ2つの取得が
  // 同一のroom_id/start_time/end_timeを指すことがある。同一チャンク内に主キーの
  // 重複があると「ON CONFLICT DO UPDATE command cannot affect row a second time」で
  // チャンク全体が失敗するため、事前に重複除去する（後勝ちで問題ない）。
  const dedupMap = new Map<string, any>();
  for (const slot of rawDbSlots) {
    dedupMap.set(`${slot.room_id}|${slot.start_time}|${slot.end_time}`, slot);
  }
  const dbSlots = [...dedupMap.values()];

  let failedCount = 0;
  let firstError: string | null = null;

  for (let i = 0; i < dbSlots.length; i += 200) {
    const chunk = dbSlots.slice(i, i + 200);
    const { error } = await supabase.from('availability_slots').upsert(chunk, { onConflict: 'room_id,start_time,end_time' });
    if (error) {
      failedCount += chunk.length;
      firstError ??= error.message;
      console.error(`  ❌ [Supabase Sync] ${label}チャンク同期エラー: ${error.message}`);
    }
  }

  const succeeded = dbSlots.length - failedCount;
  if (failedCount === 0) {
    console.log(`✨ [Supabase Sync] ${label}: ${dbSlots.length}件のスロットをDBへ直接同期完了！`);
  } else if (succeeded > 0) {
    console.warn(`  ⚠️ [Supabase Sync] ${label}: ${succeeded}/${dbSlots.length}件のみ同期成功（${failedCount}件失敗、例: ${firstError}）`);
  } else {
    console.error(`  ❌ [Supabase Sync] ${label}: 全${dbSlots.length}件が同期失敗しました（例: ${firstError}）`);
  }
}

/**
 * 毎日固定スケジュール判定ガード
 * 曜日を問わず毎日 06:33, 11:48, 17:18, 21:33 (JST) の4回のみ巡回を許可します。
 * GitHub Actionsの実行遅延（5〜20分程度）を吸収するため、前後ウィンドウで判定します。
 */
export function isScheduledCrawlTime(nowDate: Date = new Date()): { canProceed: boolean; reason?: string } {
  if (process.env.IGNORE_GUARDS === 'true') {
    return { canProceed: true, reason: 'IGNORE_GUARDS=true のため即時実行します。' };
  }

  // 実行環境のローカルタイムゾーンに依存せずJST時刻を求めるトリック:
  // getTimezoneOffset()でいったんUTC epochへ正規化してから+9時間するため、
  // 直後のgetHours()/getMinutes()（ローカルタイムゾーン基準）が返す値は
  // 常にJSTの壁時計時刻と一致する（実行環境がUTCでもJSTでも結果は変わらない）。
  // 一見「ローカル基準のgetHours()を使っているのに大丈夫か」と誤解しやすいが、
  // 上のgetTimezoneOffset()による正規化とちょうど打ち消し合う形になっている。
  const utc = nowDate.getTime() + nowDate.getTimezoneOffset() * 60000;
  const jstDate = new Date(utc + 3600000 * 9);

  const currentMinutes = jstDate.getHours() * 60 + jstDate.getMinutes();

  // 毎日固定 4回（分換算）
  // 06:33 -> 393
  // 11:48 -> 708
  // 17:18 -> 1038
  // 21:33 -> 1293
  const targets = [393, 708, 1038, 1293];

  // 各目標時刻に対して [-15分, +45分] の許容ウィンドウ（GitHub Actions のキュー遅延を余裕を持って吸収）
  const isMatched = targets.some(target => {
    return currentMinutes >= target - 15 && currentMinutes <= target + 45;
  });

  const jstTimeStr = `${String(jstDate.getHours()).padStart(2, '0')}:${String(jstDate.getMinutes()).padStart(2, '0')}`;

  if (isMatched) {
    return {
      canProceed: true,
      reason: `JST ${jstTimeStr} は毎日定時巡回スケジュール枠（06:33, 11:48, 17:18, 21:33）内に合致しています。`,
    };
  }

  return {
    canProceed: false,
    reason: `JST ${jstTimeStr} は毎日定時巡回スケジュール（06:33, 11:48, 17:18, 21:33）の対象時間外のためスキップします。`,
  };
}

// -------------------------------------------------------------
// 1. Gateway Studio Shibuya Specs
// -------------------------------------------------------------
const GATEWAY_ROOM_SPECS: Record<string, {
  name: string;
  tatami: number;
  capacity: number;
  hourlyWeekend: number;
  hourlyWeekday: number;
  soloRate: number;
  offset: number;
  features: string[];
}> = {
  '1st': {
    name: '1st (15帖)',
    tatami: 15,
    capacity: 7,
    hourlyWeekend: 3630,
    hourlyWeekday: 2420,
    soloRate: 770,
    offset: 0,
    features: ['Marshall JCM2000', 'Roland JC-120B', 'Ampeg SVT-450H', 'Pearl Drums', 'セルフレコ対応', '15帖以上']
  },
  '2st': {
    name: '2st (13帖)',
    tatami: 13,
    capacity: 6,
    hourlyWeekend: 3190,
    hourlyWeekday: 2310,
    soloRate: 770,
    offset: 0,
    features: ['Marshall JCM900', 'Roland JC-120B', 'Ampeg SVT-450H', 'Pearl Drums']
  },
  '3st': {
    name: '3st (10帖)',
    tatami: 10,
    capacity: 5,
    hourlyWeekend: 2750,
    hourlyWeekday: 1980,
    soloRate: 770,
    offset: 0,
    features: ['Marshall DSL100H', 'Roland JC-120B', 'Hartke 3500', 'Pearl Drums']
  },
  '4st': {
    name: '4st (8帖)',
    tatami: 8,
    capacity: 4,
    hourlyWeekend: 2310,
    hourlyWeekday: 1650,
    soloRate: 770,
    offset: 0,
    features: ['Marshall DSL40CR', 'Roland JC-120B', 'Hartke 3500', 'Pearl Drums', '少人数割']
  },
  '5st': {
    name: '5st (8帖 Vo/Rec/Key)',
    tatami: 8,
    capacity: 4,
    hourlyWeekend: 2000,
    hourlyWeekday: 1500,
    soloRate: 770,
    offset: 0,
    features: ['Roland JC-120B', 'YAMAHA CP4 STAGE', 'ドラムレスブース', 'ボーカル・配信特化']
  },
  '6st': {
    name: '6st (9帖)',
    tatami: 9,
    capacity: 5,
    hourlyWeekend: 2420,
    hourlyWeekday: 1870,
    soloRate: 770,
    offset: 30,
    features: ['Marshall JCM900', 'Roland JC-120B', 'Ampeg SVT', 'Pearl Drums', '30分スタート']
  },
  '7st': {
    name: '7st (12帖+ミーティング)',
    tatami: 12,
    capacity: 6,
    hourlyWeekend: 3300,
    hourlyWeekday: 2420,
    soloRate: 770,
    offset: 30,
    features: ['Marshall JCM2000', 'Roland JC-120B', 'Ampeg SVT', 'Pearl Drums', '30分スタート', '専用ミーティングブース']
  },
  '8st': {
    name: '8st (9帖)',
    tatami: 9,
    capacity: 5,
    hourlyWeekend: 2420,
    hourlyWeekday: 1870,
    soloRate: 770,
    offset: 30,
    features: ['Marshall DSL100H', 'Roland JC-120B', 'Hartke 3500', 'Pearl Drums', '30分スタート']
  },
  '9st': {
    name: '9st (9帖)',
    tatami: 9,
    capacity: 5,
    hourlyWeekend: 2420,
    hourlyWeekday: 1870,
    soloRate: 770,
    offset: 30,
    features: ['Marshall DSL100H', 'Roland JC-120B', 'Hartke 3500', 'Pearl Drums', '30分スタート']
  },
  '10st': {
    name: '10st (28帖 ゲネプロ特大)',
    tatami: 28,
    capacity: 15,
    hourlyWeekend: 4950,
    hourlyWeekday: 3300,
    soloRate: 770,
    offset: 0,
    features: ['Marshall JVM410H', 'Fender Twin Reverb', 'Roland JC-120B', 'Ampeg SVT-CL', 'Pearl Masters', '20帖以上', 'セルフレコ対応', 'ゲネプロ特大']
  },
  '11st': {
    name: '11st (10帖)',
    tatami: 10,
    capacity: 5,
    hourlyWeekend: 2750,
    hourlyWeekday: 1980,
    soloRate: 770,
    offset: 30,
    features: ['Marshall JCM900', 'Roland JC-120B', 'Ampeg SVT', 'Pearl Drums', '30分スタート']
  },
  '12st': {
    name: '12st (18帖)',
    tatami: 18,
    capacity: 8,
    hourlyWeekend: 3960,
    hourlyWeekday: 2860,
    soloRate: 770,
    offset: 0,
    features: ['Marshall JVM210H', 'Mesa/Boogie Dual Rectifier', 'Roland JC-120B', 'Ampeg SVT-VR', 'Canopus Yaiba II', '15帖以上', 'セルフレコ対応']
  }
};

// -------------------------------------------------------------
// 1b. Gateway Studio Takadanobaba 3rd Specs
//     ※ 高田馬場3号店はカレンダー表の開始列が10:00で、部屋によって
//        00分/15分/30分/45分の4種類の開始オフセットが混在する特殊な店舗
//        （reserve1-fetcher.ts側にopenHour設定と汎用端数フィラー処理を追加して対応）
// -------------------------------------------------------------
const GATEWAY_BABA_ROOM_SPECS: Record<string, {
  name: string;
  tatami: number;
  capacity: number;
  hourlyWeekend: number;
  hourlyWeekday: number;
  soloRate: number;
  offset: number;
  features: string[];
}> = {
  '2B': { name: '2B (10帖)', tatami: 10, capacity: 5, hourlyWeekend: 2530, hourlyWeekday: 1375, soloRate: 700, offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-3pro', 'Pearl Drums'] },
  '2D': { name: '2D (14帖)', tatami: 14, capacity: 7, hourlyWeekend: 2860, hourlyWeekday: 1870, soloRate: 700, offset: 0, features: ['Marshall DSL100H', 'Roland JC-120', 'HUGHES&KETTNER TRIAMP MKII', 'Pearl Drums', 'セルフレコ対応'] },
  '3B': { name: '3B (10帖)', tatami: 10, capacity: 5, hourlyWeekend: 2530, hourlyWeekday: 1375, soloRate: 700, offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-3pro', 'Pearl Drums'] },
  '3D': { name: '3D (14帖)', tatami: 14, capacity: 7, hourlyWeekend: 2860, hourlyWeekday: 1870, soloRate: 700, offset: 0, features: ['Marshall DSL100H', 'Roland JC-120', 'HUGHES&KETTNER TRIAMP MKII', 'Pearl Drums', 'セルフレコ対応'] },
  '2A': { name: '2A (12帖)', tatami: 12, capacity: 6, hourlyWeekend: 2750, hourlyWeekday: 1650, soloRate: 700, offset: 30, features: ['Marshall JCM2000', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Drums', '30分スタート'] },
  '2C': { name: '2C (10帖)', tatami: 10, capacity: 5, hourlyWeekend: 2530, hourlyWeekday: 1375, soloRate: 700, offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-3pro', 'Pearl Drums', '30分スタート'] },
  '3A': { name: '3A (12帖)', tatami: 12, capacity: 6, hourlyWeekend: 2750, hourlyWeekday: 1650, soloRate: 700, offset: 30, features: ['Marshall JCM2000', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Drums', '30分スタート'] },
  '3C': { name: '3C (10帖)', tatami: 10, capacity: 5, hourlyWeekend: 2530, hourlyWeekday: 1375, soloRate: 700, offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-3pro', 'Pearl Drums', '30分スタート'] },
  '1A': { name: '1A (12帖)', tatami: 12, capacity: 6, hourlyWeekend: 2750, hourlyWeekday: 1650, soloRate: 700, offset: 15, features: ['Marshall JCM2000', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Drums', '15分スタート'] },
  '4A': { name: '4A (16帖)', tatami: 16, capacity: 8, hourlyWeekend: 2970, hourlyWeekday: 2090, soloRate: 700, offset: 15, features: ['Marshall JVM410H', 'Roland JC-120', 'Mesa/Boogie Dual Rectifier', 'Pearl Masters', '15帖以上', '15分スタート'] },
  '4C': { name: '4C (16帖)', tatami: 16, capacity: 8, hourlyWeekend: 2970, hourlyWeekday: 2090, soloRate: 700, offset: 15, features: ['Marshall JVM410H', 'Roland JC-120', "Fender Twin Reverb '65", 'Pearl Masters', '15帖以上', '15分スタート'] },
  '5B': { name: '5B (16帖・ダンス兼用)', tatami: 16, capacity: 8, hourlyWeekend: 2970, hourlyWeekday: 2090, soloRate: 700, offset: 0, features: ['Marshall JVM410H', 'Roland JC-120', 'Ampeg SVT-CL', 'Pearl Masters', '15帖以上', 'ダンスルーム兼用'] },
  '4B': { name: '4B (16帖)', tatami: 16, capacity: 8, hourlyWeekend: 2970, hourlyWeekday: 2090, soloRate: 700, offset: 45, features: ['Marshall JVM410H', 'Roland JC-120', 'Mesa/Boogie Dual Rectifier', 'Pearl Masters', '15帖以上', '45分スタート'] },
  '5A': { name: '5A (16帖)', tatami: 16, capacity: 8, hourlyWeekend: 2970, hourlyWeekday: 2090, soloRate: 700, offset: 45, features: ['Marshall JVM410H', 'Roland JC-120', "Fender Twin Reverb '65", 'Pearl Masters', '15帖以上', '45分スタート'] },
  '5C': { name: '5C (16帖・ツインドラム)', tatami: 16, capacity: 8, hourlyWeekend: 2970, hourlyWeekday: 2090, soloRate: 700, offset: 45, features: ['Marshall JVM410H', 'Roland JC-120', 'ツインドラムセット常設', 'Pearl Masters x2', '15帖以上', '45分スタート'] },
};

export async function crawlGatewayTakadanobaba(baseDate: Date, dayCount: number = 14) {
  console.log(`🎸 [Gateway 高田馬場3号店] スケジュール巡回を開始します (Node fetch / ${dayCount}日間)...`);

  const fetchedRooms = await fetchReserve1Days({
    name: 'ゲートウェイ高田馬場3号店',
    loginUrl: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=tlsccmeco&mn=3&gr=4',
    openHour: 10,
  }, baseDate, dayCount);

  const targetDates: string[] = [];
  for (let i = 0; i < dayCount; i++) {
    targetDates.push(format(addDays(baseDate, i), 'yyyy-MM-dd'));
  }

  const studioObject = {
    id: 'gateway-takadanobaba-3rd',
    name: 'ゲートウェイスタジオ 高田馬場3号店',
    slug: 'gateway-takadanobaba-3rd',
    chain_name: 'GATEWAY STUDIO',
    area: '高田馬場',
    prefecture: '東京都',
    nearest_station: '高田馬場駅 徒歩3分',
    address: '東京都新宿区高田馬場1-28-6 和光ビルB棟',
    tel: '03-3200-9997',
    url: 'http://www.gw-studio.com/studios/studio_baba3rd/index',
    booking_url: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=tlsccmeco&mn=3&gr=4',
    business_hours_summary: '10:00〜23:00',
    is_24hours: false,
    group_booking_rule: '3ヶ月前の同日よりWEB/電話にて予約可能',
    group_booking_lead_months: 3,
    solo_booking_rule: '前日のオープン（10:00）よりWEB/電話受付開始 (1名700円/h、2名1,100円/h)',
    solo_booking_lead_hours: 24,
    scraped_at: new Date().toISOString(),
    dates_available: targetDates,
    rooms: [] as any[]
  };

  Object.keys(GATEWAY_BABA_ROOM_SPECS).forEach(stKey => {
    const spec = GATEWAY_BABA_ROOM_SPECS[stKey];
    const roomId = `gw-baba-${stKey.toLowerCase()}`;
    const matchedRoom = fetchedRooms.find(r => r.id === stKey);

    const roomSlots = (matchedRoom?.slots || []).map((s, sIdx) => ({
      id: `slot-${roomId}-${s.id || sIdx}`,
      start_time: s.start_time,
      end_time: s.end_time,
      status: s.status,
      price: spec.hourlyWeekend
    }));

    studioObject.rooms.push({
      id: roomId,
      studio_id: studioObject.id,
      name: spec.name,
      size_sqm: Math.round(spec.tatami * 1.65),
      size_tatami: spec.tatami,
      capacity: spec.capacity,
      hourly_rate: spec.hourlyWeekend,
      day_rate: spec.hourlyWeekday,
      individual_rate: spec.soloRate,
      features: spec.features,
      start_time_offset: spec.offset,
      slots: roomSlots
    });
  });

  const outPath = path.join(process.cwd(), 'src', 'data', 'gateway-takadanobaba-real.json');
  fs.writeFileSync(outPath, JSON.stringify(studioObject, null, 2), 'utf8');
  console.log(`✅ [Gateway 高田馬場3号店] 完了: ${studioObject.rooms.length}部屋（計${studioObject.rooms.reduce((a, b) => a + b.slots.length, 0)}スロット）を ${outPath} に保存しました。`);

  if (supabase) {
    console.log('⚡ [Supabase Sync] ゲートウェイ高田馬場3号店の最新スロットをSupabaseに同期中...');
    const dbSlots: any[] = [];
    studioObject.rooms.forEach((r: any) => {
      const roomUUID = toUUID(r.id);
      (r.slots || []).forEach((s: any) => {
        dbSlots.push({
          room_id: roomUUID,
          start_time: s.start_time,
          end_time: s.end_time,
          status: s.status.toLowerCase(),
        });
      });
    });

    await upsertAvailabilitySlots('ゲートウェイ高田馬場3号店', dbSlots);
  }
}

// -------------------------------------------------------------
// 1c. Gateway Studio Ikebukuro (5F・6F) Specs
//     ※ 同一建物・同一tel・同一Reserve1カレンダー(lc=tlsccmeco&mn=3&gr=1)を
//        5F(A〜G)/6F(1〜8+SUBROOM)で共有する店舗（渋谷ゲートウェイの
//        3F・4F・5F統合と同じ扱い）。公式サイトの各フロア「料金」ページ
//        （https://www.gw-studio.com/studios/studio_iken(5f)/price）と
//        実カレンダーのroom_id/開始オフセットを直接突き合わせて確認済み。
// -------------------------------------------------------------
const GATEWAY_IKEBUKURO_ROOM_SPECS: Record<string, {
  name: string;
  tatami: number;
  capacity: number;
  hourlyWeekend: number;
  hourlyWeekday: number;
  soloRate: number;
  offset: number;
  features: string[];
}> = {
  '1st': { name: '1st (14帖)', tatami: 14, capacity: 7, hourlyWeekend: 3190, hourlyWeekday: 2090, soloRate: 700, offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Masters Premium'] },
  '2st': { name: '2st (8帖)', tatami: 8, capacity: 4, hourlyWeekend: 2310, hourlyWeekday: 1320, soloRate: 700, offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Masters Premium', '30分スタート'] },
  '3st': { name: '3st (14帖)', tatami: 14, capacity: 7, hourlyWeekend: 3190, hourlyWeekday: 2090, soloRate: 700, offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Masters Premium', '30分スタート'] },
  '4st': { name: '4st (14帖)', tatami: 14, capacity: 7, hourlyWeekend: 3190, hourlyWeekday: 2090, soloRate: 700, offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Masters Premium', '30分スタート'] },
  '5st': { name: '5st (10帖)', tatami: 10, capacity: 5, hourlyWeekend: 2530, hourlyWeekday: 1540, soloRate: 700, offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Masters Premium', '30分スタート'] },
  '6st': { name: '6st (10帖)', tatami: 10, capacity: 5, hourlyWeekend: 2530, hourlyWeekday: 1540, soloRate: 700, offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Masters Premium'] },
  '7st': { name: '7st (18帖)', tatami: 18, capacity: 9, hourlyWeekend: 3740, hourlyWeekday: 2640, soloRate: 700, offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Masters Premium', '音反応LEDフラッシュライト設置'] },
  '8st': { name: '8st (14帖)', tatami: 14, capacity: 7, hourlyWeekend: 3190, hourlyWeekday: 2090, soloRate: 700, offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Reference', 'Subルーム併設'] },
  'SUBROOM': { name: 'Sub Room (3帖)', tatami: 3, capacity: 2, hourlyWeekend: 700, hourlyWeekday: 700, soloRate: 700, offset: 0, features: ['DTM用モニタースピーカー', 'ミニミキサー', 'セルフレコーディング対応', '個人練習/マンツーマンレッスン向け'] },
  'Ast': { name: 'Ast (18帖)', tatami: 18, capacity: 9, hourlyWeekend: 3740, hourlyWeekday: 2640, soloRate: 700, offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Reference'] },
  'Bst': { name: 'Bst (14帖)', tatami: 14, capacity: 7, hourlyWeekend: 3190, hourlyWeekday: 2090, soloRate: 700, offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Masters Premium', '30分スタート'] },
  'Cst': { name: 'Cst (14帖)', tatami: 14, capacity: 7, hourlyWeekend: 3190, hourlyWeekday: 2090, soloRate: 700, offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Masters Premium', '30分スタート'] },
  'Dst': { name: 'Dst (10帖)', tatami: 10, capacity: 5, hourlyWeekend: 2530, hourlyWeekday: 1540, soloRate: 700, offset: 30, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Masters Premium', '30分スタート'] },
  'Est': { name: 'Est (10帖)', tatami: 10, capacity: 5, hourlyWeekend: 2530, hourlyWeekday: 1540, soloRate: 700, offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Masters Premium'] },
  'Fst': { name: 'Fst (18帖)', tatami: 18, capacity: 9, hourlyWeekend: 3740, hourlyWeekday: 2640, soloRate: 700, offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Reference'] },
  'Gst': { name: 'Gst (14帖)', tatami: 14, capacity: 7, hourlyWeekend: 3190, hourlyWeekday: 2090, soloRate: 700, offset: 0, features: ['Marshall JCM900', 'Roland JC-120', 'Ampeg SVT-450H', 'Pearl Masters Premium'] },
};

export async function crawlGatewayIkebukuro(baseDate: Date, dayCount: number = 21) {
  console.log(`🎸 [Gateway 池袋北口店] スケジュール巡回を開始します (Node fetch / ${dayCount}日間)...`);

  const fetchedRooms = await fetchReserve1Days({
    name: 'ゲートウェイ池袋北口店',
    loginUrl: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=tlsccmeco&mn=3&gr=1',
    openHour: 10,
  }, baseDate, dayCount);

  const targetDates: string[] = [];
  for (let i = 0; i < dayCount; i++) {
    targetDates.push(format(addDays(baseDate, i), 'yyyy-MM-dd'));
  }

  const studioObject = {
    id: 'gateway-ikebukuro-kitaguchi',
    name: 'ゲートウェイスタジオ 池袋北口店',
    slug: 'gateway-ikebukuro-kitaguchi',
    chain_name: 'GATEWAY STUDIO',
    area: '池袋',
    prefecture: '東京都',
    nearest_station: '池袋駅 北口 徒歩2分',
    address: '東京都豊島区西池袋1-43-7 福住ビル5F・6F',
    tel: '03-5396-1119',
    url: 'https://www.gw-studio.com/studios/studio_iken/index',
    booking_url: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=tlsccmeco&mn=3&gr=1',
    business_hours_summary: '月〜金・祝10:00〜23:00 / 土日9:30〜23:00',
    is_24hours: false,
    group_booking_rule: '2ヶ月前よりWEB/電話にて予約可能',
    group_booking_lead_months: 2,
    solo_booking_rule: '前日のオープン（10:00）よりWEB/電話受付開始 (1名700円/h、2名1,100円/h)',
    solo_booking_lead_hours: 24,
    scraped_at: new Date().toISOString(),
    dates_available: targetDates,
    rooms: [] as any[]
  };

  Object.keys(GATEWAY_IKEBUKURO_ROOM_SPECS).forEach(stKey => {
    const spec = GATEWAY_IKEBUKURO_ROOM_SPECS[stKey];
    const roomId = `gw-ike-${stKey.toLowerCase()}`;
    const matchedRoom = stKey === 'SUBROOM'
      ? fetchedRooms.find(r => r.rawName.includes('SUBROOM'))
      : fetchedRooms.find(r => r.id === stKey);

    const roomSlots = (matchedRoom?.slots || []).map((s, sIdx) => ({
      id: `slot-${roomId}-${s.id || sIdx}`,
      start_time: s.start_time,
      end_time: s.end_time,
      status: s.status,
      price: spec.hourlyWeekend
    }));

    studioObject.rooms.push({
      id: roomId,
      studio_id: studioObject.id,
      name: spec.name,
      size_sqm: Math.round(spec.tatami * 1.65),
      size_tatami: spec.tatami,
      capacity: spec.capacity,
      hourly_rate: spec.hourlyWeekend,
      day_rate: spec.hourlyWeekday,
      individual_rate: spec.soloRate,
      features: spec.features,
      start_time_offset: spec.offset,
      slots: roomSlots
    });
  });

  const outPath = path.join(process.cwd(), 'src', 'data', 'gateway-ikebukuro-real.json');
  fs.writeFileSync(outPath, JSON.stringify(studioObject, null, 2), 'utf8');
  console.log(`✅ [Gateway 池袋北口店] 完了: ${studioObject.rooms.length}部屋（計${studioObject.rooms.reduce((a, b) => a + b.slots.length, 0)}スロット）を ${outPath} に保存しました。`);

  if (supabase) {
    console.log('⚡ [Supabase Sync] ゲートウェイ池袋北口店の最新スロットをSupabaseに同期中...');
    const dbSlots: any[] = [];
    studioObject.rooms.forEach((r: any) => {
      const roomUUID = toUUID(r.id);
      (r.slots || []).forEach((s: any) => {
        dbSlots.push({
          room_id: roomUUID,
          start_time: s.start_time,
          end_time: s.end_time,
          status: s.status.toLowerCase(),
        });
      });
    });

    await upsertAvailabilitySlots('ゲートウェイ池袋北口店', dbSlots);
  }
}

async function crawlGatewayShibuya(baseDate: Date, dayCount: number = 14) {
  console.log(`🎸 [Gateway Shibuya] スケジュール巡回を開始します (Node fetch / ${dayCount}日間)...`);

  const fetchedRooms = await fetchReserve1Days({
    name: 'ゲートウェイ渋谷',
    loginUrl: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=tlsccmeco&mn=8',
    grandValue: '8',
    openHour: 9, // 実カレンダーは9:00始まり（旧デフォルト値と同じだが、以後は全店舗で明示必須にする）
  }, baseDate, dayCount);

  const targetDates: string[] = [];
  for (let i = 0; i < dayCount; i++) {
    targetDates.push(format(addDays(baseDate, i), 'yyyy-MM-dd'));
  }

  const studioObject = {
    id: 'shibuya-gateway-01',
    name: 'ゲートウェイスタジオ 渋谷道玄坂店',
    slug: 'gateway-shibuya-dogenzaka',
    chain_name: 'GATEWAY STUDIO',
    area: '渋谷',
    prefecture: '東京都',
    nearest_station: '渋谷駅 道玄坂口 徒歩4分 / 神泉駅 徒歩3分',
    address: '東京都渋谷区道玄坂2-13-5 ハーベストビルディング 3F・4F・5F',
    tel: '03-3462-5552',
    url: 'http://www.gw-studio.com/studios/studio_shibu2/',
    booking_url: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=tlsccmeco&mn=8',
    business_hours_summary: '10:00〜23:00',
    is_24hours: false,
    group_booking_rule: '3ヶ月前の同日よりWEB/電話にて予約可能',
    group_booking_lead_months: 3,
    solo_booking_rule: '前日のオープン（09:00）よりWEB/電話受付開始 (1名770円/h、2名1,210円/h)',
    solo_booking_lead_hours: 24,
    scraped_at: new Date().toISOString(),
    dates_available: targetDates,
    rooms: [] as any[]
  };

  Object.keys(GATEWAY_ROOM_SPECS).forEach(stKey => {
    const spec = GATEWAY_ROOM_SPECS[stKey];
    const roomId = `gw-shibu-${stKey}`;
    const matchedRoom = fetchedRooms.find(r => r.id === stKey || r.rawName.includes(stKey));

    const roomSlots = (matchedRoom?.slots || []).map((s, sIdx) => ({
      id: `slot-${roomId}-${s.id || sIdx}`,
      start_time: s.start_time,
      end_time: s.end_time,
      status: s.status,
      price: spec.hourlyWeekend
    }));

    studioObject.rooms.push({
      id: roomId,
      studio_id: studioObject.id,
      name: spec.name,
      size_sqm: Math.round(spec.tatami * 1.65),
      size_tatami: spec.tatami,
      capacity: spec.capacity,
      hourly_rate: spec.hourlyWeekend,
      day_rate: spec.hourlyWeekday,
      individual_rate: spec.soloRate,
      features: spec.features,
      start_time_offset: spec.offset,
      slots: roomSlots
    });
  });

  const outPath = path.join(process.cwd(), 'src', 'data', 'gateway-shibuya-real.json');
  fs.writeFileSync(outPath, JSON.stringify(studioObject, null, 2), 'utf8');
  console.log(`✅ [Gateway Shibuya] 完了: ${studioObject.rooms.length}部屋（計${studioObject.rooms.reduce((a, b) => a + b.slots.length, 0)}スロット）を ${outPath} に保存しました。`);

  // Supabase同期
  if (supabase) {
    console.log('⚡ [Supabase Sync] ゲートウェイ渋谷の最新スロットをSupabaseに同期中...');
    const dbSlots: any[] = [];
    studioObject.rooms.forEach((r: any) => {
      const roomUUID = toUUID(r.id);
      (r.slots || []).forEach((s: any) => {
        dbSlots.push({
          room_id: roomUUID,
          start_time: s.start_time,
          end_time: s.end_time,
          status: s.status.toLowerCase(),
        });
      });
    });

    await upsertAvailabilitySlots('ゲートウェイ渋谷', dbSlots);
  }
}

// -------------------------------------------------------------
// 2. Akihabara Real Studios Scraper (BOT / GOODMAN / 音楽館)
//    ※ NOAH秋葉原店は runNoahWithStealthSafeguards() 側で一括管理
// -------------------------------------------------------------
async function crawlAkihabaraStudios(baseDate: Date, dayCount: number = 21) {
  console.log(`\n⚡ [Akihabara Crawl] 秋葉原エリア（BOT / GOODMAN / 音楽館）の巡回を開始 (Node fetch / ${dayCount}日間)...`);

  const akibaJsonPath = path.join(process.cwd(), 'src', 'data', 'akihabara-real.json');
  if (!fs.existsSync(akibaJsonPath)) {
    console.warn('⚠️ akihabara-real.json が見つかりません。');
    return;
  }

  const akibaData: any[] = JSON.parse(fs.readFileSync(akibaJsonPath, 'utf8'));

  // A. BASS ON TOP 秋葉原昭和通り口店 (studi-ol)
  try {
    const botRooms = await fetchBotAkibaDays(baseDate, dayCount);
    const botStudio = akibaData.find(s => s.id === 'bot-akiba-01');
    if (botStudio) {
      botStudio.rooms.forEach((r: any) => {
        const matched = botRooms.find(br => br.id === r.id || br.name === r.name);
        if (matched) {
          r.slots = matched.slots;
        }
      });
      console.log(`  ✅ [BASS ON TOP] ${botStudio.rooms.length}部屋の最新スロットを更新完了`);
    }
  } catch (err: any) {
    console.error(`  ❌ [BASS ON TOP] 取得エラー: ${err.message}`);
  }

  // B. STUDIO GOODMAN AKIBA (Reserve1)
  try {
    const gmFetchedRooms = await fetchReserve1Days({
      name: 'STUDIO GOODMAN AKIBA',
      loginUrl: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=dlcacvaol&mn=1',
      openHour: 10, // 実カレンダーは10:00始まり（デフォルトの9:00のままだと全スロットが1時間早くズレる）
    }, baseDate, dayCount);

    const gmStudio = akibaData.find(s => s.id === 'gm-akiba-01');
    if (gmStudio) {
      gmStudio.rooms.forEach((r: any) => {
        const matchKey = r.id.replace('gm-akiba-', '');
        const matched = gmFetchedRooms.find(gmr => gmr.id === matchKey || gmr.rawName.includes(matchKey));
        if (matched) {
          r.slots = matched.slots.map(s => ({
            id: s.id,
            start_time: s.start_time,
            end_time: s.end_time,
            status: s.status,
            price: r.hourly_rate || 2420
          }));
        }
      });
      console.log(`  ✅ [STUDIO GOODMAN] ${gmStudio.rooms.length}部屋の最新スロットを更新完了`);
    }
  } catch (err: any) {
    console.error(`  ❌ [STUDIO GOODMAN] 取得エラー: ${err.message}`);
  }

  // C. スタジオ音楽館 アキバ店 (ajg.jp)
  try {
    const ogRooms = await fetchOngakukanAkibaDays(baseDate, dayCount);
    const ogStudio = akibaData.find(s => s.id === 'og-akiba-01');
    if (ogStudio) {
      ogStudio.rooms.forEach((r: any) => {
        const matched = ogRooms.find(ogr => ogr.id === r.id || ogr.name.includes(r.name) || r.name.includes(ogr.name.split(' ')[0]));
        if (matched && matched.slots.length > 0) {
          r.slots = matched.slots.map(s => ({
            ...s,
            price: r.hourly_rate || 2200
          }));
        }
      });
      console.log(`  ✅ [スタジオ音楽館] ${ogStudio.rooms.length}部屋の最新${dayCount}日分スロットを更新完了`);
    }
  } catch (err: any) {
    console.error(`  ❌ [スタジオ音楽館] 取得エラー: ${err.message}`);
  }

  // ※ NOAH秋葉原店はここでは扱わない。ノア全店舗（秋葉原店含む）は
  //   runNoahWithStealthSafeguards() が一括ライブ取得し noah-tokyo-real.json へ
  //   保存する（src/config/noah-master.ts が単一の部屋マスター）。
  //   ここで秋葉原店分を個別に扱うと、同一巡回サイクル内でNOAHサーバーへ
  //   二重・並行アクセスしてしまうため、akihabara-real.json は
  //   BOT/GOODMAN/音楽館の3スタジオのみを対象とする。

  // akihabara-real.json へ書き込み保存
  fs.writeFileSync(akibaJsonPath, JSON.stringify(akibaData, null, 2), 'utf8');
  console.log(`💾 [Akihabara] 更新済みデータを ${akibaJsonPath} に保存しました。`);

  // Supabase同期
  if (supabase) {
    console.log('⚡ [Supabase Sync] 秋葉原エリアのスロットをSupabaseに同期中...');
    const dbSlots: any[] = [];
    akibaData.forEach((s: any) => {
      s.rooms.forEach((r: any) => {
        const roomUUID = toUUID(r.id);
        (r.slots || []).forEach((slot: any) => {
          dbSlots.push({
            room_id: roomUUID,
            start_time: slot.start_time,
            end_time: slot.end_time,
            status: slot.status.toLowerCase(),
          });
        });
      });
    });

    await upsertAvailabilitySlots('秋葉原', dbSlots);
  }
}

// -------------------------------------------------------------
// 3. Cloud Crawler Engine (人間化・BAN完全回避)
// -------------------------------------------------------------
// NOAH向けの個別ガードは廃止済み。実行可否は main() 冒頭の
// isScheduledCrawlTime() による毎日固定4回スケジュール判定のみで一元管理する。

async function crawlNodeShinjuku(now: Date, dayCount: number = 21) {
  try {
    console.log('\n📡 [STUDIO NODE 新宿店] 自動巡回を開始...');
    const nodeRooms = await fetchNodeShinjukuDays(now, dayCount);
    if (nodeRooms && nodeRooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/node-shinjuku-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms: nodeRooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [NODE] 新宿店の全スロットデータを ${outPath} に保存しました。`);

      if (supabase) {
        console.log('  ⚡ [Supabase Sync] STUDIO NODE 新宿店のスロットをSupabaseに同期中...');
        const dbSlots: any[] = [];
        nodeRooms.forEach((r: any) => {
          const roomUUID = toUUID(r.id);
          (r.slots || []).forEach((slot: any) => {
            dbSlots.push({
              room_id: roomUUID,
              start_time: slot.start_time,
              end_time: slot.end_time,
              status: slot.status.toLowerCase(),
            });
          });
        });
        await upsertAvailabilitySlots('NODE新宿', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [NODE Crawl Error] ${err.message}`);
  }
}

async function crawlPentaShinjuku(now: Date, dayCount: number = 21) {
  try {
    console.log('\n📡 [スタジオペンタ 新宿店] リアルタイム空き状況ボードの自動巡回を開始...');
    const pentaRooms = await fetchPentaShinjukuDays(now, dayCount);
    if (pentaRooms && pentaRooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/penta-shinjuku-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms: pentaRooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [PENTA] 新宿店の全スロットデータを ${outPath} に保存しました。`);

      if (supabase) {
        // 平日はスタッフ非運用のためスロット自体が生成されず、pentaRooms全体が空になる日もある
        // （ペンタは電話予約主体で、新宿店のみ土日祝限定でこのボードを公開しているため正常な挙動）。
        const dbSlots: any[] = [];
        for (const room of pentaRooms) {
          const roomId = toUUID(room.id);
          for (const s of room.slots) {
            dbSlots.push({
              room_id: roomId,
              start_time: s.start_time,
              end_time: s.end_time,
              status: s.status.toLowerCase(),
            });
          }
        }
        await upsertAvailabilitySlots('ペンタ新宿', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [Penta Crawl Error] ${err.message}`);
  }
}

export async function crawlOngakukanTakadanobaba(baseDate: Date, dayCount: number = 21) {
  console.log('\n--- 音楽館 馬場駅前店 (ajg.jp) ---');
  try {
    const rooms = await fetchOngakukanTakadanobabaDays(baseDate, dayCount);
    if (rooms && rooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/ongakukan-takadanobaba-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [音楽館 馬場駅前店] 計${rooms.length}部屋の最新スロットを ${outPath} に保存完了`);

      if (supabase) {
        console.log('  ⚡ [Supabase Sync] 音楽館 馬場駅前店のスロットをSupabaseに同期中...');
        const dbSlots: any[] = [];
        rooms.forEach((r: any) => {
          const roomUUID = toUUID(r.id);
          (r.slots || []).forEach((slot: any) => {
            dbSlots.push({
              room_id: roomUUID,
              start_time: slot.start_time,
              end_time: slot.end_time,
              status: slot.status.toLowerCase(),
            });
          });
        });
        await upsertAvailabilitySlots('音楽館馬場駅前店', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [音楽館 馬場駅前店 取得エラー] ${err.message}`);
  }
}

export async function crawlBotIkebukuro(baseDate: Date, dayCount: number = 21) {
  console.log('\n--- ベースオントップ 池袋西口店 (studi-ol.com) ---');
  try {
    const rooms = await fetchBotIkebukuroDays(baseDate, dayCount);
    if (rooms && rooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/bot-ikebukuro-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [BASS ON TOP 池袋西口店] 計${rooms.length}部屋の最新スロットを ${outPath} に保存完了`);

      if (supabase) {
        console.log('  ⚡ [Supabase Sync] BASS ON TOP 池袋西口店のスロットをSupabaseに同期中...');
        const dbSlots: any[] = [];
        rooms.forEach((r: any) => {
          const roomUUID = toUUID(r.id);
          (r.slots || []).forEach((slot: any) => {
            dbSlots.push({
              room_id: roomUUID,
              start_time: slot.start_time,
              end_time: slot.end_time,
              status: slot.status.toLowerCase(),
            });
          });
        });
        await upsertAvailabilitySlots('BOT池袋西口店', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [BASS ON TOP 池袋西口店 取得エラー] ${err.message}`);
  }
}

export async function crawlBotTakadanobaba(baseDate: Date, dayCount: number = 21) {
  console.log('\n--- BASS ON TOP 高田馬場店 (studi-ol.com) ---');
  try {
    const rooms = await fetchBotTakadanobabaDays(baseDate, dayCount);
    if (rooms && rooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/bot-takadanobaba-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [BASS ON TOP 高田馬場店] 計${rooms.length}部屋の最新スロットを ${outPath} に保存完了`);

      if (supabase) {
        console.log('  ⚡ [Supabase Sync] BASS ON TOP 高田馬場店のスロットをSupabaseに同期中...');
        const dbSlots: any[] = [];
        rooms.forEach((r: any) => {
          const roomUUID = toUUID(r.id);
          (r.slots || []).forEach((slot: any) => {
            dbSlots.push({
              room_id: roomUUID,
              start_time: slot.start_time,
              end_time: slot.end_time,
              status: slot.status.toLowerCase(),
            });
          });
        });
        await upsertAvailabilitySlots('BOT高田馬場店', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [BASS ON TOP 高田馬場店 取得エラー] ${err.message}`);
  }
}

async function crawlOngakukanShinjuku(baseDate: Date, dayCount: number = 21) {
  console.log('\n--- 6. スタジオ音楽館 新宿西口店 (ajg.jp) ---');
  try {
    const rooms = await fetchOngakukanShinjukuWestDays(baseDate, dayCount);
    if (rooms && rooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/ongakukan-shinjuku-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [スタジオ音楽館 新宿西口店] 計${rooms.length}部屋の最新スロットを ${outPath} に保存完了`);

      if (supabase) {
        console.log('  ⚡ [Supabase Sync] 音楽館 新宿西口店のスロットをSupabaseに同期中...');
        const dbSlots: any[] = [];
        rooms.forEach((r: any) => {
          const roomUUID = toUUID(r.id);
          (r.slots || []).forEach((slot: any) => {
            dbSlots.push({
              room_id: roomUUID,
              start_time: slot.start_time,
              end_time: slot.end_time,
              status: slot.status.toLowerCase(),
            });
          });
        });
        await upsertAvailabilitySlots('音楽館新宿西口店', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [音楽館新宿西口店 取得エラー] ${err.message}`);
  }
}

async function runNoahWithStealthSafeguards(now: Date, dayCount: number = 21) {
  if (process.env.GITHUB_ACTIONS === 'true') {
    console.log('\n⏭️ [NOAH Skip] GitHub Actionsのランナーは studionoah.jp からIPブロック(403)を受けるため、'
      + 'ノアのクローリングはGitHub上では実行しません。ノアの巡回はローカル環境から `npm run crawl` を実行してください。');
    return;
  }

  console.log('\n🛡️ [NOAH Stealth Guard] 人間化ロジック（ゆらぎ付与）を適用して巡回を開始します...');

  const jitterSec = Math.floor(Math.random() * 4) + 1;
  console.log(`  🎲 [Jitter] キリ番アクセス回避のため、${jitterSec}秒 ランダム待機（ゆらぎ付与）します...`);
  await new Promise(r => setTimeout(r, jitterSec * 1000));

  const storageStatePath = path.resolve(process.cwd(), 'storageState.json');
  if (!fs.existsSync(storageStatePath)) {
    console.log('  ℹ️ storageState.json が存在しないため、認証情報があれば自動ログインし、なければログイン不要スタジオをゲスト巡回して既存キャッシュを保護します。');
  }

  try {
    console.log('  🚀 [NOAH Tokyo] ノア全7店舗（渋谷4店・新宿1店・秋葉原1店・御茶ノ水1店）の空き枠を一括取得中...');
    const noahRooms = await fetchAllNoahTokyoDays(now, dayCount);
    if (noahRooms && noahRooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/noah-tokyo-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms: noahRooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [NOAH] 全7店舗（計${noahRooms.length}部屋）のスロットデータを ${outPath} に保存しました。`);

      if (supabase) {
        console.log('  ⚡ [Supabase Sync] ノア全店舗のスロットをSupabaseに同期中...');
        const dbSlots: any[] = [];
        noahRooms.forEach((r: any) => {
          const roomUUID = toUUID(r.id);
          (r.slots || []).forEach((slot: any) => {
            dbSlots.push({
              room_id: roomUUID,
              start_time: slot.start_time,
              end_time: slot.end_time,
              status: slot.status.toLowerCase(),
            });
          });
        });
        await upsertAvailabilitySlots('NOAH', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ⚠️ [NOAH Error] 通信エラー: ${err.message}`);
  }
}

// -------------------------------------------------------------
// Main Runner
// -------------------------------------------------------------
async function main() {
  console.log('====================================================');
  console.log('🚀 SoundSpot クラウド自動クローラー 実行開始');
  console.log('   モード: Pure Node Fetch (Playwrightゼロ・超軽量化)');
  console.log(`   実行日時: ${new Date().toISOString()}`);
  console.log('====================================================');

  const now = new Date();
  const scheduleCheck = isScheduledCrawlTime(now);
  if (!scheduleCheck.canProceed) {
    console.log(`⏹️ [Schedule Guard] ${scheduleCheck.reason}`);
    console.log('   (手動実行やテスト時は IGNORE_GUARDS=true を指定することで即時実行可能です)');
    console.log('====================================================');
    return;
  }
  console.log(`⏰ [Schedule Guard] ${scheduleCheck.reason}`);

  try {
    console.log('⚡ [Parallel Execution] 渋谷（ゲートウェイ）、新宿（NODE・ペンタ新宿・音楽館新宿西口）、秋葉原（BOT・GOODMAN・音楽館）、高田馬場（ゲートウェイ・BOT・音楽館）を並行巡回します（ノアはローカル環境実行時のみ、渋谷4店・新宿・秋葉原・御茶ノ水・高田馬場を一括巡回）...');
    const results = await Promise.allSettled([
      crawlGatewayShibuya(now, 21),
      crawlAkihabaraStudios(now, 21),
      crawlNodeShinjuku(now, 21),
      crawlPentaShinjuku(now, 21),
      crawlOngakukanShinjuku(now, 21),
      runNoahWithStealthSafeguards(now, 21),
      crawlGatewayTakadanobaba(now, 21),
      crawlOngakukanTakadanobaba(now, 21),
      crawlBotTakadanobaba(now, 21),
      crawlBotIkebukuro(now, 21),
      crawlGatewayIkebukuro(now, 21),
    ]);

    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.warn(`⚠️ [Partial Failures] ${failures.length}件のスタジオ巡回で例外を検知しましたが、成功したスタジオデータを保持し安全に完了します。`);
    }

    console.log('\n====================================================');
    console.log('✨ 全スタジオの自動巡回が正常に完了しました！');
    console.log('====================================================');
  } catch (error: any) {
    console.error('⚠️ [Crawler Error] 予期せぬエラーが発生しましたが、既存キャッシュを維持して終了します:', error?.message);
  }
}

if (process.env.NODE_ENV !== 'test' && !process.env.IS_TEST_RUN) {
  main();
}
