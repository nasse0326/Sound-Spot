import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

async function fetchNoahAkibaChart() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  let chartData: any = null;
  page.on('response', async (res) => {
    if (res.url().includes('get_chart_data')) {
      try {
        chartData = await res.json();
        console.log('🎉 get_chart_data 受信成功！');
      } catch (e) {}
    }
  });

  console.log('📡 https://www.studionoah.jp/noahweb/webs/chart/akihabara/ へアクセス中...');
  await page.goto('https://www.studionoah.jp/noahweb/webs/chart/akihabara/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  if (chartData) {
    fs.writeFileSync('noah-akiba-chart.json', JSON.stringify(chartData, null, 2));
    console.log('✅ noah-akiba-chart.json 保存完了！部屋数:', chartData.studios ? chartData.studios.length : '不明');
  } else {
    console.log('❌ get_chart_data が受信できませんでした。現在のURL:', page.url());
  }

  await browser.close();
}

fetchNoahAkibaChart();
