/**
 * SoundSpot Automated Studio Crawler
 * Executed periodically via GitHub Actions (or locally) to update live studio availability.
 */
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { format, addDays } from 'date-fns';

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
  } finally {
    await page.close();
  }
}

// -------------------------------------------------------------
// 2. NOAH Cloud Connectivity Test (Cloud IP verification)
// -------------------------------------------------------------
async function testNoahCloudConnectivity() {
  console.log('🔍 [NOAH Cloud Check] クラウド環境からのNOAH API疎通テストを開始します...');
  try {
    const storageStatePath = path.resolve(process.cwd(), 'storageState.json');
    const hasStorage = fs.existsSync(storageStatePath);
    let cookieHeader = '';
    if (hasStorage) {
      const state = JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'));
      const cookies = state.cookies || [];
      cookieHeader = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
      console.log(`  - storageState.json 検出: ${cookies.length} 個のCookieをロードしました`);
    }

    const res = await fetch('https://www.studionoah.jp/noahweb/webs/render_chart/shibuya2', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.studionoah.jp/noahweb/webs/chart/',
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {})
      }
    });

    console.log(`  - NOAH API レスポンスステータス: HTTP ${res.status} ${res.statusText}`);
    if (res.status === 403) {
      console.log('  ⚠️ 注意: NOAHサーバーがクラウド/データセンターIPを拒否（403 Forbidden）しました。');
    } else if (res.status === 200) {
      console.log(`  🎉 朗報: クラウド環境からのAPI呼び出しが成功しました (Status: 200 OK)！`);
    } else {
      console.log(`  ℹ️ レスポンスコード: ${res.status}`);
    }
  } catch (err: any) {
    console.log(`  ⚠️ NOAH API 接続エラー: ${err.message}`);
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

    // 2. Test NOAH cloud connectivity
    await testNoahCloudConnectivity();

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
