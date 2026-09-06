import { chromium } from 'playwright';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

async function debugNoahAkibaPage() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  page.on('request', (req) => {
    if (req.url().includes('noahweb')) {
      console.log('REQ:', req.method(), req.url());
    }
  });

  await page.goto('https://www.studionoah.jp/noahweb/webs/chart/akihabara/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'noah-akiba-debug.png' });
  console.log('Saved screenshot: noah-akiba-debug.png');

  await browser.close();
}

debugNoahAkibaPage();
