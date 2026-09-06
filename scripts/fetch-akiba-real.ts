import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

async function fetchAkibaReal() {
  console.log('🚀 [Akihabara] 実データ取得スクリプトを開始します...');
  const browser = await chromium.launch({ headless: true });

  // 1. サウンドスタジオノア 秋葉原店
  console.log('📡 [1/4] サウンドスタジオノア 秋葉原店 を取得中...');
  let noahData: any = null;
  try {
    const noahContext = await browser.newContext({
      storageState: STORAGE_STATE_PATH,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    });
    const noahPage = await noahContext.newPage();

    noahPage.on('response', async (res) => {
      if (res.url().includes('get_chart_data')) {
        try {
          noahData = await res.json();
          console.log('  ✅ ノア秋葉原店 get_chart_data 受信成功！');
        } catch (e) {}
      }
    });

    await noahPage.goto('https://www.studionoah.jp/noahweb/webs/render_chart/akihabara', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await noahPage.waitForTimeout(3000);
    await noahContext.close();
  } catch (err: any) {
    console.error('  ❌ ノア秋葉原店 取得エラー:', err.message);
  }

  // 2. ベースオントップ 秋葉原昭和通り口店 (スタジオル shop/118)
  console.log('📡 [2/4] ベースオントップ 秋葉原昭和通り口店 を取得中...');
  let botHtml = '';
  try {
    const botContext = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    });
    const botPage = await botContext.newPage();
    await botPage.goto('https://studi-ol.com/shop/118', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await botPage.waitForTimeout(2000);
    botHtml = await botPage.content();
    fs.writeFileSync('bot-akiba-raw.html', botHtml);
    console.log('  ✅ ベースオントップ HTML取得完了 (bot-akiba-raw.html に保存)');
    await botContext.close();
  } catch (err: any) {
    console.error('  ❌ ベースオントップ 取得エラー:', err.message);
  }

  // 3. STUDIO GOODMAN AKIBA (Reserve1)
  console.log('📡 [3/4] STUDIO GOODMAN AKIBA を取得中...');
  let goodmanHtml = '';
  try {
    const gmContext = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    });
    const gmPage = await gmContext.newPage();
    // VisitorLogin form submit
    await gmPage.goto('https://studio.goodman2020.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const [popup] = await Promise.all([
      gmPage.waitForEvent('popup', { timeout: 15000 }).catch(() => null),
      gmPage.evaluate(() => {
        const form = document.querySelector('form[action*="VisitorLogin.php"]') as HTMLFormElement;
        if (form) form.submit();
      }),
    ]);

    const targetPage = popup || gmPage;
    await targetPage.waitForLoadState('networkidle');
    await targetPage.waitForTimeout(2000);
    goodmanHtml = await targetPage.content();
    fs.writeFileSync('goodman-akiba-raw.html', goodmanHtml);
    console.log('  ✅ STUDIO GOODMAN HTML取得完了 (goodman-akiba-raw.html に保存)');
    await gmContext.close();
  } catch (err: any) {
    console.error('  ❌ STUDIO GOODMAN 取得エラー:', err.message);
  }

  // 4. スタジオ音楽館 アキバ店 (ajg.jp)
  console.log('📡 [4/4] スタジオ音楽館 アキバ店 を取得中...');
  let ongakukanHtml = '';
  try {
    const ogContext = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    });
    const ogPage = await ogContext.newPage();
    await ogPage.goto('http://www.st-ongakukan.com/akihabara/pr.html', { waitUntil: 'networkidle', timeout: 30000 });
    await ogPage.waitForTimeout(2000);
    ongakukanHtml = await ogPage.content();
    fs.writeFileSync('ongakukan-akiba-raw.html', ongakukanHtml);
    console.log('  ✅ スタジオ音楽館 HTML取得完了 (ongakukan-akiba-raw.html に保存)');
    await ogContext.close();
  } catch (err: any) {
    console.error('  ❌ スタジオ音楽館 取得エラー:', err.message);
  }

  await browser.close();

  // 保存
  if (noahData) {
    fs.writeFileSync('noah-akiba-raw.json', JSON.stringify(noahData, null, 2));
    console.log('💾 ノア秋葉原店 RAWデータを noah-akiba-raw.json に保存しました。');
  }

  console.log('🏁 データ取得完了！');
}

fetchAkibaReal();
