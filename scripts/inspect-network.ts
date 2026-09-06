import { chromium, Request, Response } from 'playwright';
import fs from 'fs';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function inspectNoahNetwork() {
  console.log('🔍 [Step 1] ネットワーク通信監視モードで起動します...');

  if (!fs.existsSync(STORAGE_STATE_PATH)) {
    console.error('❌ storageState.json が見つかりません。');
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  });

  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
  });

  const page = await context.newPage();

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  // 内部API通信（XHR/Fetch）をすべて記録
  const apiRequests: Array<{ url: string; method: string; status?: number; dataPreview?: string }> = [];

  page.on('response', async (response: Response) => {
    const req = response.request();
    const url = req.url();
    const resourceType = req.resourceType();

    if (resourceType === 'xhr' || resourceType === 'fetch' || url.includes('/webs/') || url.includes('/api/') || url.includes('chart')) {
      let preview = '';
      try {
        const text = await response.text();
        preview = text.slice(0, 300); // 冒頭300文字
      } catch (e) {
        preview = '[Binary or Unreadable]';
      }

      apiRequests.push({
        url,
        method: req.method(),
        status: response.status(),
        dataPreview: preview,
      });
    }
  });

  try {
    const targetUrl = 'https://www.studionoah.jp/noahweb/webs/chart/';
    console.log(`📡 カレンダー画面を開きます (1回のみ): ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(2500);

    // 渋谷2号店のチェックボックス/ボタンを探してクリック
    console.log('🔍 渋谷2号店の選択を試行中...');
    const shibuya2Btn = page.getByText('渋谷2号').first();

    if (await shibuya2Btn.count() > 0) {
      console.log('👆 渋谷2号店を選択...');
      await shibuya2Btn.click();
      await sleep(1500);

      // 「この条件で検索」ボタンがあればクリック
      const searchSubmit = page.locator('button:has-text("この条件で検索"), input[value*="検索"]').first();
      if (await searchSubmit.count() > 0 && await searchSubmit.isVisible()) {
        console.log('👆 「この条件で検索」をクリック...');
        await searchSubmit.click();
        await sleep(3500);
      }
    }

    // スクリーンショット保存
    const screenshotPath = path.resolve(process.cwd(), 'noah-shibuya2-calendar.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 カレンダー画面のスクリーンショットを保存: ${screenshotPath}`);

    // 通信ログのサマリーを出力
    console.log(`\n📊 === 検出された内部API通信 (${apiRequests.length}件) ===`);
    for (const r of apiRequests) {
      console.log(`[${r.method}] ${r.status} ${r.url}`);
      if (r.dataPreview && !r.dataPreview.includes('<!DOCTYPE')) {
        console.log(`   Preview: ${r.dataPreview.replace(/\s+/g, ' ')}\n`);
      }
    }

    // 画面に日付が何日分表示されているかDOMから探索
    const dateElements = await page.locator('.date, .calendar_date, .day, th:has-text("/"), td:has-text("/")').allInnerTexts();
    console.log('\n📅 画面上で検出された日付テキスト:', dateElements.slice(0, 15));

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await browser.close();
    console.log('🔒 ブラウザを終了しました（セッション安全終了）。');
  }
}

inspectNoahNetwork();
