/**
 * SoundSpot Automated Studio Crawler
 * Executed periodically via GitHub Actions (or locally) to update live studio availability.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { chromium } from 'playwright';
import { format, addDays } from 'date-fns';
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization (service_role or anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

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

// -------------------------------------------------------------
// 1. Gateway Studio Shibuya Scraper (Reserve1.jp)
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

async function crawlGatewayShibuya(browser: any, baseDate: Date, dayCount: number = 7) {
  console.log('🎸 [Gateway Shibuya] スケジュール巡回を開始します...');
  const page = await browser.newPage();

  try {
    await page.goto('https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=tlsccmeco&mn=8', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // 渋谷道玄坂店 (grand=8) を選択して更新
    await page.selectOption('select[name="grand"]', '8');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('input[type="submit"][value="更新"]')
    ]);

    const targetDates: string[] = [];
    for (let i = 0; i < dayCount; i++) {
      targetDates.push(format(addDays(baseDate, i), 'yyyy-MM-dd'));
    }

    const resultsByDate: Record<string, any> = {};

    for (const dateStr of targetDates) {
      console.log(`  - ゲートウェイ渋谷: ${dateStr} を取得中...`);
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.evaluate((d: string) => (window as any).SubmitFormD(d), dateStr)
      ]);

      const pageData = await page.evaluate((dStr: string) => {
        const rows = Array.from(document.querySelectorAll('tr'));
        const roomMap: Record<string, any> = {};

        rows.forEach(tr => {
          const cells = Array.from(tr.children) as HTMLElement[];
          if (cells.length < 3) return;
          const firstCell = cells[0];
          const nameText = firstCell.innerText.trim();
          if (!nameText.includes('st') && !nameText.includes('SUBROOM')) return;

          let currentHour = 9;
          let currentMin = 0;
          const slotCells = cells.slice(1, cells.length - 1);
          const slots: any[] = [];

          slotCells.forEach(td => {
            const div = td.firstElementChild as HTMLElement;
            const className = (div ? div.className : td.className) || '';
            const input = td.querySelector('input[type="checkbox"]') as HTMLInputElement;

            let durationHours = 1;
            if (className.includes('koma_sp30')) {
              durationHours = 0.5;
            } else {
              const matchX = className.match(/_x(\d+)_/);
              if (matchX) durationHours = parseInt(matchX[1], 10);
            }

            const sh = currentHour;
            const sm = currentMin;
            const totalM = currentHour * 60 + currentMin + Math.round(durationHours * 60);
            currentHour = Math.floor(totalM / 60);
            currentMin = totalM % 60;

            if (className.includes('koma_sp30')) return;

            const shStr = sh < 10 ? '0' + sh : '' + sh;
            const smStr = sm < 10 ? '0' + sm : '' + sm;
            const ehStr = currentHour < 10 ? '0' + currentHour : '' + currentHour;
            const emStr = currentMin < 10 ? '0' + currentMin : '' + currentMin;

            const startTimeIso = dStr + 'T' + shStr + ':' + smStr + ':00+09:00';
            const endTimeIso = dStr + 'T' + ehStr + ':' + emStr + ':00+09:00';

            if (input && !input.disabled) {
              slots.push({ start_time: startTimeIso, end_time: endTimeIso, status: 'AVAILABLE' });
            } else {
              for (let h = 0; h < durationHours; h++) {
                const bStartH = sh + h;
                const bEndH = bStartH + 1;
                const bshStr = bStartH < 10 ? '0' + bStartH : '' + bStartH;
                const behStr = bEndH < 10 ? '0' + bEndH : '' + bEndH;
                slots.push({
                  start_time: dStr + 'T' + bshStr + ':' + smStr + ':00+09:00',
                  end_time: dStr + 'T' + behStr + ':' + smStr + ':00+09:00',
                  status: 'BOOKED'
                });
              }
            }
          });

          const matchSt = nameText.match(/(\d+st)/);
          const key = matchSt ? matchSt[1] : nameText;
          roomMap[key] = { rawName: nameText, slots };
        });

        return roomMap;
      }, dateStr);

      resultsByDate[dateStr] = pageData;
    }

    // データアセンブル
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
      const allSlots: any[] = [];

      targetDates.forEach(dStr => {
        const dayData = resultsByDate[dStr] || {};
        const roomData = dayData[stKey];
        if (roomData && roomData.slots) {
          roomData.slots.forEach((s: any, sIdx: number) => {
            allSlots.push({
              id: `slot-${roomId}-${dStr}-${sIdx}`,
              start_time: s.start_time,
              end_time: s.end_time,
              status: s.status,
              price: spec.hourlyWeekend
            });
          });
        }
      });

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
        slots: allSlots
      });
    });

    const outPath = path.join(process.cwd(), 'src', 'data', 'gateway-shibuya-real.json');
    fs.writeFileSync(outPath, JSON.stringify(studioObject, null, 2), 'utf8');
    console.log(`✅ [Gateway Shibuya] 完了: ${studioObject.rooms.length}部屋のデータを ${outPath} に保存しました。`);

    // Supabaseが設定されていれば直接空き枠テーブルを更新
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
  } finally {
    await page.close();
  }
}

// -------------------------------------------------------------
// 2. NOAH Stealth Guard & Cloud Crawler Engine (人間化・BAN完全回避)
// -------------------------------------------------------------
interface NoahGuardStatus {
  canProceed: boolean;
  reason?: string;
}

/**
 * 仕様書に規定された「4大ステルス（人間化）ロジック」に基づく事前判定
 */
export function checkNoahStealthGuard(nowDate: Date = new Date()): NoahGuardStatus {
  // JST (日本時間 UTC+9) を厳密に計算
  const utc = nowDate.getTime() + nowDate.getTimezoneOffset() * 60000;
  const jstDate = new Date(utc + 3600000 * 9);

  const jstHour = jstDate.getHours();
  const jstMin = jstDate.getMinutes();
  const jstDay = jstDate.getDay(); // 0 = 日, 6 = 土

  // ガード1: 深夜睡眠（JST 01:00 〜 07:30 は巡回完全停止）
  const isNightSleep = (jstHour >= 1 && jstHour < 7) || (jstHour === 7 && jstMin < 30);
  if (isNightSleep) {
    return {
      canProceed: false,
      reason: `🌙 深夜睡眠時間帯（JST 01:00〜07:30 現在 ${jstHour}:${String(jstMin).padStart(2, '0')}）のため、ノアのアクセスを完全停止（睡眠中）します。`
    };
  }

  // ガード2: 平日昼の間引き（月〜金 11:00 〜 16:00 の :30 実行時はスキップして1時間間隔にする）
  const isWeekday = jstDay >= 1 && jstDay <= 5;
  const isDaytime = jstHour >= 11 && jstHour < 16;
  if (isWeekday && isDaytime && jstMin >= 20 && jstMin <= 40) {
    return {
      canProceed: false,
      reason: `☕ 平日昼帯（JST ${jstHour}:${String(jstMin).padStart(2, '0')}）のため間引き運用（1時間間隔）とし、30分枠巡回をスキップします。`
    };
  }

  return { canProceed: true };
}

async function runNoahWithStealthSafeguards() {
  console.log('\n🛡️ [NOAH Stealth Guard] 人間化・BAN回避判定を実行中...');

  const guard = checkNoahStealthGuard();
  if (!guard.canProceed) {
    console.log(`  ⏹️ [SKIP] ${guard.reason}`);
    return;
  }

  // ガード3: ランダムゆらぎ（Jitter）待機（キリ番秒アクセスを防止）
  const jitterSec = Math.floor(Math.random() * 15) + 5; // 5〜20秒のランダム待機
  console.log(`  🎲 [Jitter] キリ番アクセス回避のため、${jitterSec}秒 ランダム待機（ゆらぎ付与）します...`);
  await new Promise(r => setTimeout(r, jitterSec * 1000));

  // ガード4: Cookieセッションのロードとログイン試行遮断（ID/PWの送信はゼロ）
  const storageStatePath = path.resolve(process.cwd(), 'storageState.json');
  if (!fs.existsSync(storageStatePath)) {
    console.log('  ⚠️ storageState.json が存在しないため、安全のためノアの巡回をパスします。');
    return;
  }

  const state = JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'));
  const cookies = state.cookies || [];
  const cookieHeader = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
  console.log(`  🍪 [Cookie] 保存済みセッション（${cookies.length}個のCookie）を使用して安全にアクセスします（ID/PW再送ゼロ）。`);

  // 対象店舗リスト
  const noahStores = [
    { id: 'shibuya2', name: 'サウンドスタジオノア 渋谷2号店' }
  ];

  for (let i = 0; i < noahStores.length; i++) {
    const store = noahStores[i];
    console.log(`  📡 [NOAH] ${store.name} の最新チャートを取得中...`);

    // ガード5: 店舗間人間インターバル（3〜6秒のページめくり間隔）
    if (i > 0) {
      const storeWaitSec = Math.floor(Math.random() * 4) + 3;
      console.log(`  ⏳ 人間らしい閲覧間隔のため ${storeWaitSec}秒 待機...`);
      await new Promise(r => setTimeout(r, storeWaitSec * 1000));
    }

    try {
      const res = await fetch(`https://www.studionoah.jp/noahweb/webs/render_chart/${store.id}`, {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': 'https://www.studionoah.jp/noahweb/webs/chart/',
          'Cookie': cookieHeader
        }
      });

      console.log(`  📥 レスポンス: HTTP ${res.status} ${res.statusText}`);

      // ガード6: 401/403 or 認証切れ時の安全緊急停止（アカウントロックを完全防止）
      if (res.status === 401 || res.status === 403) {
        console.warn(`  🚨 [ALERT] NOAHサーバーより ${res.status} が返却されました。アカウント保護のため即座に巡回を緊急停止します。`);
        break;
      }

      if (res.status === 200) {
        console.log(`  ✅ [NOAH] ${store.name} のセッション通信が安全に完了しました。`);
      }
    } catch (err: any) {
      console.error(`  ⚠️ [NOAH Error] 通信エラー: ${err.message}`);
      break;
    }
  }
}

// -------------------------------------------------------------
// Main Runner
// -------------------------------------------------------------
async function main() {
  console.log('====================================================');
  console.log('🚀 SoundSpot クラウド自動クローラー 実行開始');
  console.log(`   実行日時: ${new Date().toISOString()}`);
  console.log('====================================================');

  const now = new Date();
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Gateway Studio Shibuya
    await crawlGatewayShibuya(browser, now, 7);

    // 2. NOAH Studio (Stealth Guarded)
    await runNoahWithStealthSafeguards();

    console.log('====================================================');
    console.log('✨ 全スタジオの自動巡回が正常に完了しました！');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ クローラー実行中にエラーが発生しました:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
