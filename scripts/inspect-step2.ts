import { chromium } from 'playwright';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

async function inspectStep2() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  let capturedChart: any = null;
  page.on('response', async (res) => {
    if (res.url().includes('get_chart_data') || res.url().includes('render_chart') || res.url().includes('schedule')) {
      console.log('RES:', res.status(), res.url());
      try {
        const json = await res.json();
        console.log('JSON received from:', res.url(), Object.keys(json));
        if (json.studios || json.body || json.header) {
          capturedChart = json;
        }
      } catch (e) {}
    }
  });

  await page.goto('https://www.studionoah.jp/noahweb/webs/chart/akihabara/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Inspect studios listed in STEP 02
  const studios = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('a, button, li, input, label')).map((el) => ({
      text: (el.textContent || '').trim(),
      tag: el.tagName,
      className: el.className,
      href: (el as any).href || '',
      id: el.id,
    })).filter(i => i.text.length > 0 && i.text.length < 30 && (i.text.includes('st') || i.text.includes('Booth')));
    return items;
  });

  console.log('Studios in STEP 02:', studios);

  // Click the first studio link if found
  const firstStudio = page.locator('a:has-text("st"), button:has-text("st")').first();
  if (await firstStudio.count() > 0) {
    console.log('Clicking first studio...');
    await firstStudio.click();
    await page.waitForTimeout(3000);
  }

  await browser.close();
}

inspectStep2();
