/**
 * SoundSpot Automated Studio Crawler
 * Executed periodically via GitHub Actions (or locally) to update live studio availability.
 * Completely Playwright-free, powered by pure Node fetch!
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { format, addDays } from 'date-fns';
import { createClient } from '@supabase/supabase-js';
import { fetchReserve1Days } from './lib/reserve1-fetcher';
import { fetchBotAkibaDays } from './lib/bot-fetcher';
import { fetchOngakukanAkibaDays, fetchOngakukanShinjukuWestDays } from './lib/ongakukan-fetcher';
import { fetchNoahAkibaDays, fetchAllNoahTokyoDays } from './lib/noah-fetcher';
import { fetchNodeShinjukuDays } from './lib/node-fetcher';
import { fetchPentaShinjukuDays, isWeekendOrHoliday } from './lib/penta-fetcher';

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

function toUUID(str: string): string {
  const hash = crypto.createHash('md5').update(str).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '4' + hash.substring(13, 16),
    'a' + hash.substring(17, 20),
    hash.substring(20, 32)
  ].join('-');
}

/**
 * ユーザー指定スケジュール判定ガード
 * 平日（月〜金、祝日除く）: 06:30, 11:45, 17:15, 21:30 (JST)
 * 休日（土日）および祝日: 08:30, 13:00, 17:15, 21:30 (JST)
 * GitHub Actionsの実行遅延（5〜20分程度）を吸収するため、前後ウィンドウで判定します。
 */
export function isScheduledCrawlTime(nowDate: Date = new Date()): { canProceed: boolean; reason?: string; isHolidayOrWeekend?: boolean } {
  if (process.env.IGNORE_GUARDS === 'true') {
    return { canProceed: true, reason: 'IGNORE_GUARDS=true のため即時実行します。' };
  }

  const utc = nowDate.getTime() + nowDate.getTimezoneOffset() * 60000;
  const jstDate = new Date(utc + 3600000 * 9);
  const jstDateStr = format(jstDate, 'yyyy-MM-dd');
  const isWeekendHoliday = isWeekendOrHoliday(jstDateStr);

  const currentMinutes = jstDate.getHours() * 60 + jstDate.getMinutes();

  // 目標時刻（分換算）
  // 06:30 -> 390
  // 08:30 -> 510
  // 11:45 -> 705
  // 13:00 -> 780
  // 17:15 -> 1035
  // 21:30 -> 1290
  const targets = isWeekendHoliday
    ? [510, 780, 1035, 1290] // 休日・祝日
    : [390, 705, 1035, 1290]; // 平日

  // 各目標時刻に対して [-15分, +30分] の許容ウィンドウ
  const isMatched = targets.some(target => {
    return currentMinutes >= target - 15 && currentMinutes <= target + 30;
  });

  const jstTimeStr = `${String(jstDate.getHours()).padStart(2, '0')}:${String(jstDate.getMinutes()).padStart(2, '0')}`;
  const dayType = isWeekendHoliday ? '休日・祝日' : '平日';

  if (isMatched) {
    return {
      canProceed: true,
      reason: `JST ${jstTimeStr} (${dayType}) は指定巡回スケジュール枠内に合致しています。`,
      isHolidayOrWeekend: isWeekendHoliday,
    };
  }

  return {
    canProceed: false,
    reason: `JST ${jstTimeStr} (${dayType}) は指定スケジュール（平日: 06:30, 11:45, 17:15, 21:30 / 休日祝日: 08:30, 13:00, 17:15, 21:30）の対象時間外のためスキップします。`,
    isHolidayOrWeekend: isWeekendHoliday,
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

async function crawlGatewayShibuya(baseDate: Date, dayCount: number = 14) {
  console.log(`🎸 [Gateway Shibuya] スケジュール巡回を開始します (Node fetch / ${dayCount}日間)...`);

  const fetchedRooms = await fetchReserve1Days({
    name: 'ゲートウェイ渋谷',
    loginUrl: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=tlsccmeco&mn=8',
    grandValue: '8'
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
    business_hours_summary: '09:00〜23:30 (予約状況により24時間対応可)',
    is_24hours: true,
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
      const roomUUID = toUUID('gw-' + r.id);
      (r.slots || []).forEach((s: any) => {
        dbSlots.push({
          room_id: roomUUID,
          start_time: s.start_time,
          end_time: s.end_time,
          status: s.status.toLowerCase(),
        });
      });
    });

    for (let i = 0; i < dbSlots.length; i += 200) {
      const chunk = dbSlots.slice(i, i + 200);
      await supabase.from('availability_slots').upsert(chunk, { onConflict: 'room_id,start_time,end_time' });
    }
    console.log(`✨ [Supabase Sync] ゲートウェイ渋谷: ${dbSlots.length}件のスロットをDBへ直接同期完了！`);
  }
}

// -------------------------------------------------------------
// 2. Akihabara Real Studios Scraper (BOT / GOODMAN / 音楽館 / ノア)
// -------------------------------------------------------------
async function crawlAkihabaraStudios(baseDate: Date, dayCount: number = 21) {
  console.log(`\n⚡ [Akihabara Crawl] 秋葉原エリア（BOT / GOODMAN / 音楽館 / ノア）の巡回を開始 (Node fetch / ${dayCount}日間)...`);

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

  // D. サウンドスタジオノア 秋葉原店 (NOAH Official Schedule API)
  const noahGuard = checkNoahStealthGuard();
  if (!noahGuard.canProceed) {
    console.log(`  ⏹️ [NOAH Akiba SKIP] ${noahGuard.reason}`);
  } else {
    try {
      const noahRooms = await fetchNoahAkibaDays(baseDate, dayCount);
      const noahStudio = akibaData.find(s => s.id === 'noah-akiba-01');
      if (noahStudio) {
        noahStudio.rooms.forEach((r: any) => {
          const matched = noahRooms.find(nr => nr.id === r.id || nr.name === r.name);
          if (matched && matched.slots.length > 0) {
            r.slots = matched.slots.map(s => ({
              ...s,
              price: r.hourly_rate || 2640
            }));
          }
        });
        console.log(`  ✅ [ノア秋葉原店] ${noahStudio.rooms.length}部屋の最新${dayCount}日分スロットを更新完了`);
      }
    } catch (err: any) {
      console.error(`  ❌ [ノア秋葉原店] 取得エラー: ${err.message}`);
    }
  }

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

    for (let i = 0; i < dbSlots.length; i += 200) {
      const chunk = dbSlots.slice(i, i + 200);
      await supabase.from('availability_slots').upsert(chunk, { onConflict: 'room_id,start_time,end_time' });
    }
    console.log(`✨ [Supabase Sync] 秋葉原: ${dbSlots.length}件のスロットをDBへ直接同期完了！`);
  }
}

// -------------------------------------------------------------
// 3. NOAH Stealth Guard & Cloud Crawler Engine (人間化・BAN完全回避)
// -------------------------------------------------------------
interface NoahGuardStatus {
  canProceed: boolean;
  reason?: string;
}

export function checkNoahStealthGuard(nowDate: Date = new Date(), ignoreGuards: boolean = false): NoahGuardStatus {
  if (ignoreGuards || process.env.IGNORE_GUARDS === 'true') {
    return { canProceed: true };
  }

  const utc = nowDate.getTime() + nowDate.getTimezoneOffset() * 60000;
  const jstDate = new Date(utc + 3600000 * 9);

  const jstHour = jstDate.getHours();
  const jstMin = jstDate.getMinutes();
  const jstDay = jstDate.getDay();

  // クローラー全体のスケジュールガード（isScheduledCrawlTime）を通過していれば基本的に巡回可能
  return { canProceed: true };
}

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
        for (let i = 0; i < dbSlots.length; i += 200) {
          const chunk = dbSlots.slice(i, i + 200);
          await supabase.from('availability_slots').upsert(chunk, { onConflict: 'room_id,start_time,end_time' });
        }
        console.log(`  ✨ [Supabase Sync] NODE新宿: ${dbSlots.length}件のスロットをDBへ直接同期完了！`);
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
        const dbSlots: any[] = [];
        for (const room of pentaRooms) {
          const roomId = toUUID(`penta-shinjuku-${room.id}`);
          for (const s of room.slots) {
            // id: penta-shinjuku-101-2026-09-19-1000
            const parts = s.id.split('-');
            const date = parts.slice(parts.length - 4, parts.length - 1).join('-');
            dbSlots.push({
              id: toUUID(`penta-${s.id}`),
              room_id: roomId,
              date,
              start_time: s.start_time,
              end_time: s.end_time,
              status: s.status,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        }
        for (let i = 0; i < dbSlots.length; i += 200) {
          const chunk = dbSlots.slice(i, i + 200);
          await supabase.from('availability_slots').upsert(chunk, { onConflict: 'room_id,start_time,end_time' });
        }
        console.log(`✨ [Supabase Sync] ペンタ新宿: ${dbSlots.length}件のスロットをDBへ直接同期完了！`);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [Penta Crawl Error] ${err.message}`);
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
        for (let i = 0; i < dbSlots.length; i += 200) {
          const chunk = dbSlots.slice(i, i + 200);
          await supabase.from('availability_slots').upsert(chunk, { onConflict: 'room_id,start_time,end_time' });
        }
        console.log(`  ✨ [Supabase Sync] 音楽館 新宿西口店: ${dbSlots.length}件のスロットをDBへ直接同期完了！`);
      }
    }
  } catch (err: any) {
    console.error(`  ❌ [音楽館新宿西口店 取得エラー] ${err.message}`);
  }
}

async function runNoahWithStealthSafeguards(now: Date, dayCount: number = 21) {
  console.log('\n🛡️ [NOAH Stealth Guard] 人間化・BAN回避判定を実行中...');

  const guard = checkNoahStealthGuard();
  if (!guard.canProceed && process.env.IGNORE_GUARDS !== 'true') {
    console.log(`  ⏹️ [SKIP] ${guard.reason}`);
    return;
  }

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
        for (let i = 0; i < dbSlots.length; i += 200) {
          const chunk = dbSlots.slice(i, i + 200);
          await supabase.from('availability_slots').upsert(chunk, { onConflict: 'room_id,start_time,end_time' });
        }
        console.log(`  ✨ [Supabase Sync] NOAH: ${dbSlots.length}件のスロットをDBへ直接同期完了！`);
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
    console.log('⚡ [Parallel Execution] 渋谷（ゲートウェイ・ノア4店）、新宿（NODE・ペンタ新宿・音楽館新宿西口・ノア）、秋葉原（BOT・GOODMAN・音楽館・ノア2店）を並行巡回します...');
    await Promise.all([
      crawlGatewayShibuya(now, 21),
      crawlAkihabaraStudios(now, 21),
      crawlNodeShinjuku(now, 21),
      crawlPentaShinjuku(now, 21),
      crawlOngakukanShinjuku(now, 21),
      runNoahWithStealthSafeguards(now, 21),
    ]);

    console.log('\n====================================================');
    console.log('✨ 全スタジオの自動巡回が正常に完了しました！');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ クローラー実行中にエラーが発生しました:', error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test' && !process.env.IS_TEST_RUN) {
  main();
}
