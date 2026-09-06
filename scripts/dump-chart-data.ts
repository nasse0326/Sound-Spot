import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

async function dumpChartData() {
  console.log('📡 [Step 1 最終確認] get_chart_data のAPI詳細をダンプします...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  let capturedReqData = null;
  let capturedResData = null;

  page.on('request', (req) => {
    if (req.url().includes('get_chart_data')) {
      capturedReqData = {
        url: req.url(),
        method: req.method(),
        headers: req.headers(),
        postData: req.postData(),
      };
    }
  });

  page.on('response', async (res) => {
    if (res.url().includes('get_chart_data')) {
      try {
        capturedResData = await res.json();
      } catch (e) {
        capturedResData = await res.text();
      }
    }
  });

  const targetUrl = 'https://www.studionoah.jp/noahweb/webs/render_chart/shibuya2';
  console.log(`📡 渋谷2号店のチャートURLへ直接アクセスします: ${targetUrl}`);
  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // リクエストとレスポンスを保存
  if (capturedReqData) {
    fs.writeFileSync('noah-request-sample.json', JSON.stringify(capturedReqData, null, 2));
    console.log('✅ リクエストパラメータを保存: noah-request-sample.json');
  }
  if (capturedResData) {
    fs.writeFileSync('noah-chart-response-sample.json', JSON.stringify(capturedResData, null, 2));
    console.log('🎉 2週間分のレスポンスJSONを保存: noah-chart-response-sample.json');
  }

  await browser.close();
}

dumpChartData();
