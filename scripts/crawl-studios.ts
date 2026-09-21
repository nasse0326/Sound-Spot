/**
 * SoundSpot Automated Studio Crawler
 * Executed periodically via GitHub Actions (or locally) to update live studio availability.
 * Completely Playwright-free, powered by pure Node fetch!
 */
// tsxは.env.localを自動読み込みしないため明示的にロードする。ローカル実行時に
// NOAH_LOGIN_ID/PASSWORD等が空文字のままになり、ログイン必須部屋が常にセッション切れ
// 扱いになって自動再ログインが一度も発火しない不具合の原因だった。GitHub Actions側は
// env:ブロックで直接環境変数を注入しており.env.localファイル自体が存在しないため、
// dotenv.config()はファイル無しでも例外を投げず静かに無視される（安全）。
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { format, addDays } from 'date-fns';
import { createClient } from '@supabase/supabase-js';
import { fetchReserve1Days } from './lib/reserve1-fetcher';
import { fetchBotAkibaDays, fetchBotTakadanobabaDays, fetchBotIkebukuroDays, fetchAndysDays, fetchStandbyDays, fetchGourdislandWestDays, fetchGourdislandSouthDays, fetchMuseumShinjukuDays, fetchHillvalleyDays, fetchVantageDays, fetchSoundStudioDomDays, fetchPigStudioDays, fetchSonicBandStudioDays, fetchKoyamaMainDays, fetchKoyamaRDays, fetchMusiraDays } from './lib/bot-fetcher';
import { fetchStudioBaydKoenjiDays } from './lib/wnspace-fetcher';
import { fetchStudioSunNishiFunabashiDays, fetchStudioDivoKameidoDays } from './lib/webtoru-fetcher';
import { fetchCloud9YokohamaKitaguchiDays } from './lib/cloud9-fetcher';
import { fetchStudio2TimesDays } from './lib/bot-fetcher';
import { fetchSoundStudioMKoiwaDays } from './lib/orpheus-fetcher';
import { fetchOngakukanAkibaDays, fetchOngakukanShinjukuWestDays, fetchOngakukanTakadanobabaDays } from './lib/ongakukan-fetcher';
import { fetchAllNoahTokyoDays } from './lib/noah-fetcher';
import { fetchNodeShinjukuDays } from './lib/node-fetcher';
import { fetchPentaShinjukuDays } from './lib/penta-fetcher';
import { toUUID } from './lib/id-utils';
import { CRAWL_DAY_COUNT } from '../src/config/crawl-schedule';

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

  // GitHub Actionsランナーの一部の外部ホスト（Supabase等）向けIPv6経路が不安定で
  // "TypeError: fetch failed" のような一過性のネットワークエラーが起きることが
  // 既知（.github/workflows/crawl-studios.ymlのNODE_OPTIONSコメント参照）。
  // 以前はチャンクが1回失敗したら即座に諦めて次のチャンクへ進んでいたため、
  // 一過性のエラーでもそのチャンク分のデータが恒久的に欠落し、10/11のGOODMAN
  // AKIBA等で部屋ごとにバラバラの件数しか同期されない実害が出た。各チャンクに
  // 最大3回・短い間隔でのリトライを入れ、一過性の失敗を吸収する。
  for (let i = 0; i < dbSlots.length; i += 200) {
    const chunk = dbSlots.slice(i, i + 200);
    let lastError: string | null = null;
    let chunkSucceeded = false;
    for (let attempt = 1; attempt <= 3 && !chunkSucceeded; attempt++) {
      const { error } = await supabase.from('availability_slots').upsert(chunk, { onConflict: 'room_id,start_time,end_time' });
      if (!error) {
        chunkSucceeded = true;
        break;
      }
      lastError = error.message;
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, attempt * 1000));
      }
    }
    if (!chunkSucceeded) {
      failedCount += chunk.length;
      firstError ??= lastError;
      console.error(`  ❌ [Supabase Sync] ${label}チャンク同期エラー（3回リトライ後も失敗）: ${lastError}`);
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

export async function crawlGatewayTakadanobaba(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
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

export async function crawlGatewayIkebukuro(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
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

async function crawlGatewayShibuya(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
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
async function crawlAkihabaraStudios(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
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

async function crawlNodeShinjuku(now: Date, dayCount: number = CRAWL_DAY_COUNT) {
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

async function crawlPentaShinjuku(now: Date, dayCount: number = CRAWL_DAY_COUNT) {
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

export async function crawlOngakukanTakadanobaba(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
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

export async function crawlBotIkebukuro(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
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

export async function crawlBotTakadanobaba(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
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

async function crawlOngakukanShinjuku(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
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

export async function crawlAndys(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  console.log("\n--- ANDY'S STUDIO 下北沢店 (studi-ol.com) ---");
  try {
    const rooms = await fetchAndysDays(baseDate, dayCount);
    if (rooms && rooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/andys-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [ANDY'S STUDIO] 計${rooms.length}部屋の最新スロットを ${outPath} に保存完了`);

      if (supabase) {
        console.log("  ⚡ [Supabase Sync] ANDY'S STUDIOのスロットをSupabaseに同期中...");
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
        await upsertAvailabilitySlots("ANDY'S STUDIO", dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [ANDY'S STUDIO 取得エラー] ${err.message}`);
  }
}

export async function crawlStandby(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  console.log('\n--- STANDBY MUSIC STUDIO 下北沢店 (studi-ol.com) ---');
  try {
    const rooms = await fetchStandbyDays(baseDate, dayCount);
    if (rooms && rooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/standby-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [STANDBY MUSIC STUDIO] 計${rooms.length}部屋の最新スロットを ${outPath} に保存完了`);

      if (supabase) {
        console.log('  ⚡ [Supabase Sync] STANDBY MUSIC STUDIOのスロットをSupabaseに同期中...');
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
        await upsertAvailabilitySlots('STANDBY MUSIC STUDIO', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [STANDBY MUSIC STUDIO 取得エラー] ${err.message}`);
  }
}

export async function crawlGourdislandWest(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  console.log('\n--- ガードアイランドスタジオ下北沢ウエスト店 (studi-ol.com) ---');
  try {
    const rooms = await fetchGourdislandWestDays(baseDate, dayCount);
    if (rooms && rooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/gourdisland-west-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [ガードアイランド下北沢ウエスト店] 計${rooms.length}部屋の最新スロットを ${outPath} に保存完了`);

      if (supabase) {
        console.log('  ⚡ [Supabase Sync] ガードアイランド下北沢ウエスト店のスロットをSupabaseに同期中...');
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
        await upsertAvailabilitySlots('ガードアイランド下北沢ウエスト店', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [ガードアイランド下北沢ウエスト店 取得エラー] ${err.message}`);
  }
}

export async function crawlGourdislandSouth(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  console.log('\n--- ガードアイランドスタジオ下北沢南口店 (studi-ol.com) ---');
  try {
    const rooms = await fetchGourdislandSouthDays(baseDate, dayCount);
    if (rooms && rooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/gourdisland-south-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [ガードアイランド下北沢南口店] 計${rooms.length}部屋の最新スロットを ${outPath} に保存完了`);

      if (supabase) {
        console.log('  ⚡ [Supabase Sync] ガードアイランド下北沢南口店のスロットをSupabaseに同期中...');
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
        await upsertAvailabilitySlots('ガードアイランド下北沢南口店', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [ガードアイランド下北沢南口店 取得エラー] ${err.message}`);
  }
}

export async function crawlMuseumShinjuku(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  console.log('\n--- スタジオミュージアム新宿店 (studi-ol.com) ---');
  try {
    const rooms = await fetchMuseumShinjukuDays(baseDate, dayCount);
    if (rooms && rooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/museum-shinjuku-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [スタジオミュージアム新宿店] 計${rooms.length}部屋の最新スロットを ${outPath} に保存完了`);

      if (supabase) {
        console.log('  ⚡ [Supabase Sync] スタジオミュージアム新宿店のスロットをSupabaseに同期中...');
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
        await upsertAvailabilitySlots('スタジオミュージアム新宿店', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [スタジオミュージアム新宿店 取得エラー] ${err.message}`);
  }
}

export async function crawlHillvalley(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  console.log('\n--- ヒルバレースタジオ (studi-ol.com) ---');
  try {
    const rooms = await fetchHillvalleyDays(baseDate, dayCount);
    if (rooms && rooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/hillvalley-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [ヒルバレースタジオ] 計${rooms.length}部屋の最新スロットを ${outPath} に保存完了`);

      if (supabase) {
        console.log('  ⚡ [Supabase Sync] ヒルバレースタジオのスロットをSupabaseに同期中...');
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
        await upsertAvailabilitySlots('ヒルバレースタジオ', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [ヒルバレースタジオ 取得エラー] ${err.message}`);
  }
}

export async function crawlVantage(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  console.log('\n--- Sound Studio Vantage (studi-ol.com) ---');
  try {
    const rooms = await fetchVantageDays(baseDate, dayCount);
    if (rooms && rooms.length > 0) {
      const outPath = path.resolve(process.cwd(), 'src/data/vantage-real.json');
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [Sound Studio Vantage] 計${rooms.length}部屋の最新スロットを ${outPath} に保存完了`);

      if (supabase) {
        console.log('  ⚡ [Supabase Sync] Sound Studio Vantageのスロットを Supabase に同期中...');
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
        await upsertAvailabilitySlots('Sound Studio Vantage', dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [Sound Studio Vantage 取得エラー] ${err.message}`);
  }
}

// -------------------------------------------------------------
// Music man サウンドスタジオ (Reserve1.jp / ReserveMart, ゲスト閲覧可能インスタンス)
// -------------------------------------------------------------
const MUSIC_MAN_ROOM_SPECS: Record<string, {
  name: string;
  tatami: number;
  capacity: number;
  hourlyWeekend: number;
  hourlyWeekday: number;
  soloRate: number;
  offset: number;
  floor: string;
  features: string[];
}> = {
  'Lst': { name: 'Lst (11畳)', tatami: 11, capacity: 6, hourlyWeekend: 2950, hourlyWeekday: 1970, soloRate: 690, offset: 30, floor: '2F', features: ['Marshall JCM2000 DSL100 + 1960A', 'Roland JC-120', 'BASS::HARTKE 3500A + 4.5XL', 'DRUM::PEARL Masters(22/16/13/12) + Zildjian(14/16/18/20)'] },
  '3-Lst': { name: '3Lst (11畳)', tatami: 11, capacity: 6, hourlyWeekend: 2950, hourlyWeekday: 1970, soloRate: 690, offset: 30, floor: '3F', features: ['Marshall JCM2000 DSL100 + 1960A', 'Roland JC-120', 'BASS::HARTKE 3500A + 4.5XL', 'DRUM::PEARL Masters(22/16/13/12) + Zildjian(14/16/18/20)'] },
  'Bst': { name: 'Bst (7畳)', tatami: 7, capacity: 4, hourlyWeekend: 2350, hourlyWeekday: 1580, soloRate: 690, offset: 30, floor: '2F', features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::HARTKE 2500A 410TP', 'DRUM::PEARL Masters(22/16/13/12) + Zildjian(14/16/18/20)'] },
  '3-Bst': { name: '3Bst (7畳)', tatami: 7, capacity: 4, hourlyWeekend: 2350, hourlyWeekday: 1580, soloRate: 690, offset: 30, floor: '3F', features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::HARTKE 2500A 410TP', 'DRUM::PEARL Masters(22/16/13/12) + Zildjian(14/16/18/20)'] },
  'Gst': { name: 'Gst (13畳)', tatami: 13, capacity: 7, hourlyWeekend: 3200, hourlyWeekday: 2190, soloRate: 690, offset: 0, floor: '2F', features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::Ampeg SVT350H + SVT810E', 'DRUM::PEARL Masters(22/16/13/12) + Zildjian(14/16/18/20)'] },
  '3-Gst': { name: '3Gst (13畳)', tatami: 13, capacity: 7, hourlyWeekend: 3200, hourlyWeekday: 2190, soloRate: 690, offset: 0, floor: '3F', features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::Ampeg B2R + SVT810E', 'DRUM::PEARL Masters(22/16/13/12) + Zildjian(14/16/18/20)', 'NOTE::Fender Rhodes常設（レンタル1h¥440）'] },
  'Ast': { name: 'Ast (10畳)', tatami: 10, capacity: 5, hourlyWeekend: 2850, hourlyWeekday: 1860, soloRate: 690, offset: 0, floor: '2F', features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::HARTKE 3500A + 4.5XL', 'DRUM::PEARL Masters(22/16/13/12) + Zildjian(14/16/18/20)'] },
  '3-Ast': { name: '3Ast (10畳)', tatami: 10, capacity: 5, hourlyWeekend: 2850, hourlyWeekday: 1860, soloRate: 690, offset: 0, floor: '3F', features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::HARTKE 3500A + 4.5XL', 'DRUM::PEARL Masters(22/16/13/12) + Zildjian(14/16/18/20)'] },
  'Cst': { name: 'Cst (11畳)', tatami: 11, capacity: 6, hourlyWeekend: 2950, hourlyWeekday: 1970, soloRate: 690, offset: 0, floor: '2F', features: ['Marshall JCM2000 DSL100 + 1960A', 'Roland JC-120', 'BASS::HARTKE 3500A + 4.5XL', 'DRUM::PEARL Masters(22/16/13/12) + Zildjian(14/16/18/20)', 'NOTE::エレピ常設（レンタル1h¥220）'] },
  '3-Cst': { name: '3Cst (11畳)', tatami: 11, capacity: 6, hourlyWeekend: 2950, hourlyWeekday: 1970, soloRate: 690, offset: 0, floor: '3F', features: ['Marshall JCM2000 DSL100 + 1960A', 'Roland JC-120', 'BASS::HARTKE 3500A + 4.5XL', 'DRUM::PEARL Masters(22/16/13/12) + Zildjian(14/16/18/20)', 'NOTE::エレピ常設（レンタル1h¥220）'] },
};

export async function crawlMusicMan(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  console.log('\n🎸 [Music man サウンドスタジオ] スケジュール巡回を開始します (Node fetch / ' + dayCount + '日間)...');

  try {
    const fetchedRooms = await fetchReserve1Days({
      name: 'Music man サウンドスタジオ',
      loginUrl: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=alcacsdol&mn=1&gr=1',
      openHour: 9,
    }, baseDate, dayCount);

    const studioObject = {
      id: 'music-man-shinjuku',
      name: 'Music man サウンドスタジオ',
      chain_name: 'Music man',
      area: '新宿',
      prefecture: '東京都',
      nearest_station: 'JR新宿駅 西口 徒歩4分',
      address: '東京都新宿区西新宿7-10-13 ガイアビル2F・3F',
      tel: '03-3367-2727',
      url: 'https://www.music-man.jp/index.php',
      booking_url: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=alcacsdol&mn=1&gr=1',
      business_hours_summary: '9:30〜24:00（予約により深夜営業あり）',
      is_24hours: false,
      group_booking_rule: '前日21:00までのWEB/電話予約を推奨（オンライン会員登録要）',
      group_booking_lead_months: 2,
      solo_booking_rule: '前日21:00よりWEB/電話にて受付開始（全室一律1名690円/h）',
      solo_booking_lead_hours: 27,
      rooms: [] as any[],
    };

    Object.keys(MUSIC_MAN_ROOM_SPECS).forEach((key) => {
      const spec = MUSIC_MAN_ROOM_SPECS[key];
      const roomId = `musicman-${key.toLowerCase()}`;
      const matchedRoom = fetchedRooms.find((r) => r.id === key);

      const roomSlots = (matchedRoom?.slots || []).map((s, sIdx) => ({
        id: `slot-${roomId}-${s.id || sIdx}`,
        start_time: s.start_time,
        end_time: s.end_time,
        status: s.status,
      }));

      studioObject.rooms.push({
        id: roomId,
        studio_id: studioObject.id,
        name: spec.name,
        floor: spec.floor,
        size_tatami: spec.tatami,
        capacity: spec.capacity,
        hourly_rate: spec.hourlyWeekend,
        day_rate: spec.hourlyWeekday,
        individual_rate: spec.soloRate,
        features: spec.features,
        start_time_offset: spec.offset,
        slots: roomSlots,
      });
    });

    const outPath = path.join(process.cwd(), 'src', 'data', 'music-man-real.json');
    fs.writeFileSync(outPath, JSON.stringify(studioObject, null, 2), 'utf8');
    console.log(`✅ [Music man] 完了: ${studioObject.rooms.length}部屋（計${studioObject.rooms.reduce((a, b) => a + b.slots.length, 0)}スロット）を ${outPath} に保存しました。`);

    if (supabase) {
      console.log('⚡ [Supabase Sync] Music manの最新スロットをSupabaseに同期中...');
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
      await upsertAvailabilitySlots('Music man', dbSlots);
    }
  } catch (err: any) {
    console.error(`  ❌ [Music man 取得エラー] ${err.message}`);
  }
}

// -------------------------------------------------------------
// 高円寺エリア追加分（2026-09-20）。うちSound Studio DOM/P.I.G.Studio/
// SONIC BAND STUDIO/スタジオ・コヤーマ（本店・R店）/MUSIRA Studioの6店舗は
// studi-ol.com ASPを使っておりログイン不要でカレンダーが閲覧できることを
// ブラウザで実地確認済み。fetcher自体が価格・帖数・機材込みの完全なRoom
// オブジェクトを返すため、他のstudi-ol系店舗と同様rooms配列をそのままJSON化する。
// -------------------------------------------------------------

async function crawlStudiOlKoenjiShop(
  label: string,
  fetchFn: (baseDate: Date, dayCount?: number) => Promise<any[]>,
  outFileName: string,
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT,
  sourceLabel: string = 'studi-ol.com'
) {
  console.log(`\n--- ${label} (${sourceLabel}) ---`);
  try {
    const rooms = await fetchFn(baseDate, dayCount);
    if (rooms && rooms.length > 0) {
      const outPath = path.resolve(process.cwd(), `src/data/${outFileName}.json`);
      fs.writeFileSync(outPath, JSON.stringify({
        updatedAt: new Date().toISOString(),
        rooms,
      }, null, 2), 'utf-8');
      console.log(`  💾 [${label}] 計${rooms.length}部屋の最新スロットを ${outPath} に保存完了`);

      if (supabase) {
        console.log(`  ⚡ [Supabase Sync] ${label}のスロットをSupabaseに同期中...`);
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
        await upsertAvailabilitySlots(label, dbSlots);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [${label} 取得エラー] ${err.message}`);
  }
}

export async function crawlSoundStudioDom(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  await crawlStudiOlKoenjiShop('Sound Studio DOM', fetchSoundStudioDomDays, 'sound-studio-dom-real', baseDate, dayCount);
}

export async function crawlPigStudio(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  await crawlStudiOlKoenjiShop('P.I.G.Studio', fetchPigStudioDays, 'pig-studio-real', baseDate, dayCount);
}

export async function crawlSonicBandStudio(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  await crawlStudiOlKoenjiShop('SONIC BAND STUDIO', fetchSonicBandStudioDays, 'sonic-band-studio-real', baseDate, dayCount);
}

export async function crawlKoyamaMain(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  await crawlStudiOlKoenjiShop('スタジオ・コヤーマ本店', fetchKoyamaMainDays, 'koyama-main-real', baseDate, dayCount);
}

export async function crawlKoyamaR(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  await crawlStudiOlKoenjiShop('スタジオ・コヤーマR店', fetchKoyamaRDays, 'koyama-r-real', baseDate, dayCount);
}

export async function crawlMusira(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  await crawlStudiOlKoenjiShop('MUSIRA Studio', fetchMusiraDays, 'musira-real', baseDate, dayCount);
}

// -------------------------------------------------------------
// 船橋エリア追加分（2026-09-20）。STUDIO SUN西船橋店はwebtoru.com ASPを使っており
// ログイン不要でカレンダーが閲覧できることをブラウザで実地確認済み（パックス船橋店は
// 会員ログイン必須のためクロール非対応・静的リスティングのみ、詳細はfunabashi-converter.ts）。
// -------------------------------------------------------------
export async function crawlStudioSunNishiFunabashi(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  await crawlStudiOlKoenjiShop('STUDIO SUN 西船橋店', fetchStudioSunNishiFunabashiDays, 'studiosun-nishifunabashi-real', baseDate, dayCount, 'webtoru.com');
}

// -------------------------------------------------------------
// 横浜エリア追加分（2026-09-21）のうちクラウドナインスタジオ横浜北口店。
// cloud9-web.jp（2026年2月更新の新予約システム）の公開API（ログイン不要）で
// 自動巡回可能なことをブラウザでJSバンドル解析の上確認済み（詳細はcloud9-fetcher.ts）。
// -------------------------------------------------------------
export async function crawlCloud9YokohamaKitaguchi(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  await crawlStudiOlKoenjiShop('クラウドナインスタジオ 横浜北口店', fetchCloud9YokohamaKitaguchiDays, 'cloud9-yokohama-kitaguchi-real', baseDate, dayCount, 'cloud9-web.jp');
}

// -------------------------------------------------------------
// 亀戸〜小岩エリア追加分（2026-09-21）。
// ・Studio DIVO 亀戸: webtoru.com（ログイン不要でカレンダー閲覧可能）
// ・Studio 2Times: studi-ol.com（ログイン不要でカレンダー閲覧可能）
// ・SOUND STUDIO M 小岩店: studi-ol.com（無人営業時間帯のみ）とorpheusrecords.info
//   （有人営業時間帯を含む全室・全日データ）のハイブリッド構成。後者の方が全日を
//   カバーできるためorpheusrecords.infoを採用（詳細はorpheus-fetcher.ts）。
// -------------------------------------------------------------
export async function crawlStudioDivoKameido(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  await crawlStudiOlKoenjiShop('Studio DIVO 亀戸', fetchStudioDivoKameidoDays, 'studio-divo-kameido-real', baseDate, dayCount, 'webtoru.com');
}

export async function crawlStudio2Times(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  await crawlStudiOlKoenjiShop('Studio 2Times', fetchStudio2TimesDays, 'studio-2times-real', baseDate, dayCount, 'studi-ol.com');
}

export async function crawlSoundStudioMKoiwa(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  await crawlStudiOlKoenjiShop('SOUND STUDIO M 小岩店', fetchSoundStudioMKoiwaDays, 'soundstudio-m-koiwa-real', baseDate, dayCount, 'orpheusrecords.info');
}

// -------------------------------------------------------------
// STUDIO BAYD 高円寺店 (WnSpaceMusic / 独自プラットフォーム、公開REST API直叩き)
// -------------------------------------------------------------
const STUDIO_BAYD_KOENJI_ROOM_SPECS: Record<number, {
  name: string;
  tatami: number;
  capacity: number;
  hourlyRate: number;
  dayRate: number;
  soloRate: number;
  features: string[];
}> = {
  54: { name: 'Aスタジオ', tatami: 36, capacity: 60, hourlyRate: 5000, dayRate: 4000, soloRate: 900, features: ['Marshall JCM900', 'Roland JC-120P', 'Fender TwinReverb', 'BASS::Ampeg SVT-3PRO', 'DRUM::Pearl PROFESSIONAL Series', 'NOTE::イベント・ライブ利用可（最大60名）'] },
  55: { name: 'Bスタジオ', tatami: 16, capacity: 7, hourlyRate: 2900, dayRate: 2100, soloRate: 770, features: ['Marshall JCM900', 'Roland JC-120P', 'Fender TwinReverb', 'BASS::Ampeg SVT-3PRO', 'DRUM::Pearl SESSION STUDIO SELECT Series', 'NOTE::深夜割0:00-6:00は1h¥1,000'] },
  56: { name: 'Cスタジオ', tatami: 14, capacity: 6, hourlyRate: 2700, dayRate: 1900, soloRate: 770, features: ['Marshall JCM900', 'Roland JC-120P', 'Fender TwinReverb', 'BASS::Ampeg SVT-3PRO', 'DRUM::Pearl SESSION STUDIO SELECT Series', 'NOTE::深夜割0:00-6:00は1h¥1,000'] },
  57: { name: 'Dスタジオ(ドラムルーム)', tatami: 6, capacity: 2, hourlyRate: 1300, dayRate: 1300, soloRate: 770, features: ['DRUM::Pearl REFERENCE ONE Series x2set', 'NOTE::ドラム専用ブース、ギター/ベースアンプなし'] },
  58: { name: 'Eスタジオ(Vo Booth)', tatami: 0, capacity: 2, hourlyRate: 1200, dayRate: 1200, soloRate: 600, features: ['NOTE::ボーカルブース、深夜割0:00-6:00は1h¥1,000'] },
};

export async function crawlStudioBaydKoenji(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  console.log('\n🎸 [STUDIO BAYD 高円寺店] スケジュール巡回を開始します (WnSpaceMusic 公開API / ' + dayCount + '日間)...');

  try {
    const fetchedRooms = await fetchStudioBaydKoenjiDays(baseDate, dayCount);

    const targetDates: string[] = [];
    for (let i = 0; i < dayCount; i++) {
      targetDates.push(format(addDays(baseDate, i), 'yyyy-MM-dd'));
    }

    const studioObject = {
      id: 'studio-bayd-koenji',
      name: 'STUDIO BAYD 高円寺店',
      chain_name: 'STUDIO BAYD',
      area: '高円寺',
      prefecture: '東京都',
      nearest_station: '高円寺駅 徒歩3分',
      address: '東京都杉並区高円寺南4-30-4 高円寺Kyテラス地下1階',
      tel: '',
      url: 'https://wnspacemusic.jp/studios/9',
      booking_url: 'https://wnspacemusic.jp/studios/9',
      business_hours_summary: '24時間営業（完全無人店舗）',
      is_24hours: true,
      group_booking_rule: 'WEB予約は24時間オンライン受付（要WnSpaceMusic会員登録）',
      group_booking_lead_months: 6,
      solo_booking_rule: '1週間前18時よりWEB予約受付開始',
      solo_booking_lead_hours: 168,
      scraped_at: new Date().toISOString(),
      dates_available: targetDates,
      rooms: [] as any[],
    };

    Object.entries(STUDIO_BAYD_KOENJI_ROOM_SPECS).forEach(([roomIdStr, spec]) => {
      const roomIdNum = Number(roomIdStr);
      const roomId = `studio-bayd-koenji-${roomIdNum}`;
      const matchedRoom = fetchedRooms.find((r) => r.id === roomIdNum);

      const roomSlots = (matchedRoom?.slots || []).map((s, sIdx) => ({
        id: `slot-${roomId}-${s.id || sIdx}`,
        start_time: s.start_time,
        end_time: s.end_time,
        status: s.status,
      }));

      studioObject.rooms.push({
        id: roomId,
        studio_id: studioObject.id,
        name: spec.name,
        size_tatami: spec.tatami,
        capacity: spec.capacity,
        hourly_rate: spec.hourlyRate,
        day_rate: spec.dayRate,
        individual_rate: spec.soloRate,
        features: spec.features,
        start_time_offset: 0,
        slots: roomSlots,
      });
    });

    const outPath = path.join(process.cwd(), 'src', 'data', 'studio-bayd-koenji-real.json');
    fs.writeFileSync(outPath, JSON.stringify(studioObject, null, 2), 'utf8');
    console.log(`✅ [STUDIO BAYD 高円寺店] 完了: ${studioObject.rooms.length}部屋（計${studioObject.rooms.reduce((a, b) => a + b.slots.length, 0)}スロット）を ${outPath} に保存しました。`);

    if (supabase) {
      console.log('⚡ [Supabase Sync] STUDIO BAYD 高円寺店の最新スロットをSupabaseに同期中...');
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
      await upsertAvailabilitySlots('STUDIO BAYD 高円寺店', dbSlots);
    }
  } catch (err: any) {
    console.error(`  ❌ [STUDIO BAYD 高円寺店 取得エラー] ${err.message}`);
  }
}

// -------------------------------------------------------------
// ヨコハマ・セーラスタジオ (Reserve1.jp / ReserveMart, ゲスト閲覧可能インスタンス)
// -------------------------------------------------------------
const SAILA_ROOM_SPECS: Record<string, {
  name: string;
  tatami: number;
  capacity: number;
  hourlyWeekend: number;
  hourlyWeekday: number;
  soloRate: number;
  offset: number;
  features: string[];
}> = {
  'A-STUDIO': { name: 'Ast (16畳)', tatami: 16, capacity: 10, hourlyWeekend: 3300, hourlyWeekday: 3190, soloRate: 880, offset: 0, features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::Ampeg SVT-3PRO', 'DRUM::Pearl Export Series', 'NOTE::片面前面鏡、10人以上のバンドにも対応'] },
  'B-STUDIO': { name: 'Bst (14畳)', tatami: 14, capacity: 8, hourlyWeekend: 3190, hourlyWeekday: 2970, soloRate: 880, offset: 0, features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::Ampeg SVT-3PRO', 'DRUM::Pearl Export Series', 'NOTE::ミキシングルーム隣接、レコーディング収録用'] },
  'C-STUDIO': { name: 'Cst (11.5畳)', tatami: 12, capacity: 6, hourlyWeekend: 2970, hourlyWeekday: 2750, soloRate: 880, offset: 0, features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::Ampeg SVT-3PRO', 'DRUM::Pearl Export Series'] },
  'D-STUDIO': { name: 'Dst (9.5畳)', tatami: 10, capacity: 4, hourlyWeekend: 2640, hourlyWeekday: 2420, soloRate: 880, offset: 0, features: ['Marshall JCM900 + 1960A', 'Roland JC-120', 'BASS::Ampeg SVT-3PRO', 'DRUM::Pearl Export Series', 'NOTE::天井が一番高く開放的な音、学生バンドに人気'] },
};

export async function crawlYokohamaSaila(baseDate: Date, dayCount: number = CRAWL_DAY_COUNT) {
  console.log('\n🎸 [ヨコハマ・セーラスタジオ] スケジュール巡回を開始します (Node fetch / ' + dayCount + '日間)...');

  try {
    const fetchedRooms = await fetchReserve1Days({
      name: 'ヨコハマ・セーラスタジオ',
      loginUrl: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=llcacvmsv&mn=1&gr=1',
      openHour: 9,
    }, baseDate, dayCount);

    const targetDates: string[] = [];
    for (let i = 0; i < dayCount; i++) {
      targetDates.push(format(addDays(baseDate, i), 'yyyy-MM-dd'));
    }

    const studioObject = {
      id: 'yokohama-saila',
      name: 'ヨコハマ・セーラスタジオ',
      chain_name: 'ヨコハマセーラスタジオ',
      area: '横浜',
      prefecture: '神奈川県',
      nearest_station: '桜木町駅 徒歩3分',
      address: '神奈川県横浜市',
      tel: '045-201-4988',
      url: 'https://saila-s.jp/',
      booking_url: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=llcacvmsv&mn=1&gr=1',
      business_hours_summary: '9:00〜24:00',
      is_24hours: false,
      group_booking_rule: 'WEB（バンド会員）にて随時予約受付可能',
      group_booking_lead_months: 2,
      solo_booking_rule: '個人練習・24時以降の予約は電話のみ',
      solo_booking_lead_hours: 24,
      scraped_at: new Date().toISOString(),
      dates_available: targetDates,
      rooms: [] as any[],
    };

    Object.keys(SAILA_ROOM_SPECS).forEach((key) => {
      const spec = SAILA_ROOM_SPECS[key];
      const roomId = `saila-${key.toLowerCase().replace('-studio', '')}`;
      const matchedRoom = fetchedRooms.find((r) => r.id === key);

      const roomSlots = (matchedRoom?.slots || []).map((s, sIdx) => ({
        id: `slot-${roomId}-${s.id || sIdx}`,
        start_time: s.start_time,
        end_time: s.end_time,
        status: s.status,
      }));

      studioObject.rooms.push({
        id: roomId,
        studio_id: studioObject.id,
        name: spec.name,
        size_tatami: spec.tatami,
        capacity: spec.capacity,
        hourly_rate: spec.hourlyWeekend,
        day_rate: spec.hourlyWeekday,
        individual_rate: spec.soloRate,
        features: spec.features,
        start_time_offset: spec.offset,
        slots: roomSlots,
      });
    });

    const outPath = path.join(process.cwd(), 'src', 'data', 'yokohama-saila-real.json');
    fs.writeFileSync(outPath, JSON.stringify(studioObject, null, 2), 'utf8');
    console.log(`✅ [ヨコハマ・セーラスタジオ] 完了: ${studioObject.rooms.length}部屋（計${studioObject.rooms.reduce((a, b) => a + b.slots.length, 0)}スロット）を ${outPath} に保存しました。`);

    if (supabase) {
      console.log('⚡ [Supabase Sync] ヨコハマ・セーラスタジオの最新スロットをSupabaseに同期中...');
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
      await upsertAvailabilitySlots('ヨコハマ・セーラスタジオ', dbSlots);
    }
  } catch (err: any) {
    console.error(`  ❌ [ヨコハマ・セーラスタジオ 取得エラー] ${err.message}`);
  }
}

async function runNoahWithStealthSafeguards(now: Date, dayCount: number = CRAWL_DAY_COUNT) {
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

  // 以前はここで固定4時刻（06:33/11:48/17:18/21:33 JST）への近さをチェックし、
  // 外れていれば巡回を丸ごとスキップするガードがあった。しかしGitHub Actionsの
  // スケジュール実行はベストエフォートで、実測（2026-09-20時点の直近53回の
  // 定時実行）で平均195分・最大381分もの遅延があり、96%の実行がガードに
  // 弾かれて巡回が一切行われていなかったことが判明した。1日4回という頻度は
  // cronの定義（4エントリ）自体がすでに保証しているため、アプリ側の時刻ガードは
  // 実質的な安全性を追加せず「本来実行すべき巡回を誤って弾く」害の方が大きいと
  // 判断し、撤廃した。手動実行はworkflow_dispatchでいつでも可能。
  const now = new Date();

  try {
    console.log('⚡ [Parallel Execution] 渋谷（ゲートウェイ）、新宿（NODE・ペンタ新宿・音楽館新宿西口）、秋葉原（BOT・GOODMAN・音楽館）、高田馬場（ゲートウェイ・BOT・音楽館）を並行巡回します（ノアはローカル環境実行時のみ、渋谷4店・新宿・秋葉原・御茶ノ水・高田馬場を一括巡回）...');
    const results = await Promise.allSettled([
      crawlGatewayShibuya(now, CRAWL_DAY_COUNT),
      crawlAkihabaraStudios(now, CRAWL_DAY_COUNT),
      crawlNodeShinjuku(now, CRAWL_DAY_COUNT),
      crawlPentaShinjuku(now, CRAWL_DAY_COUNT),
      crawlOngakukanShinjuku(now, CRAWL_DAY_COUNT),
      runNoahWithStealthSafeguards(now, CRAWL_DAY_COUNT),
      crawlGatewayTakadanobaba(now, CRAWL_DAY_COUNT),
      crawlOngakukanTakadanobaba(now, CRAWL_DAY_COUNT),
      crawlBotTakadanobaba(now, CRAWL_DAY_COUNT),
      crawlBotIkebukuro(now, CRAWL_DAY_COUNT),
      crawlGatewayIkebukuro(now, CRAWL_DAY_COUNT),
      crawlAndys(now, CRAWL_DAY_COUNT),
      crawlStandby(now, CRAWL_DAY_COUNT),
      crawlGourdislandWest(now, CRAWL_DAY_COUNT),
      crawlGourdislandSouth(now, CRAWL_DAY_COUNT),
      crawlMuseumShinjuku(now, CRAWL_DAY_COUNT),
      crawlHillvalley(now, CRAWL_DAY_COUNT),
      crawlVantage(now, CRAWL_DAY_COUNT),
      crawlMusicMan(now, CRAWL_DAY_COUNT),
      crawlSoundStudioDom(now, CRAWL_DAY_COUNT),
      crawlPigStudio(now, CRAWL_DAY_COUNT),
      crawlSonicBandStudio(now, CRAWL_DAY_COUNT),
      crawlKoyamaMain(now, CRAWL_DAY_COUNT),
      crawlKoyamaR(now, CRAWL_DAY_COUNT),
      crawlMusira(now, CRAWL_DAY_COUNT),
      crawlStudioBaydKoenji(now, CRAWL_DAY_COUNT),
      crawlStudioSunNishiFunabashi(now, CRAWL_DAY_COUNT),
      crawlYokohamaSaila(now, CRAWL_DAY_COUNT),
      crawlCloud9YokohamaKitaguchi(now, CRAWL_DAY_COUNT),
      crawlStudioDivoKameido(now, CRAWL_DAY_COUNT),
      crawlStudio2Times(now, CRAWL_DAY_COUNT),
      crawlSoundStudioMKoiwa(now, CRAWL_DAY_COUNT),
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
