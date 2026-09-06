import { chromium } from 'playwright';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

async function inspectChartPage() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  await page.goto('https://www.studionoah.jp/noahweb/webs/chart/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Extract all branch links or options
  const branches = await page.evaluate(() => {
    const list: any[] = [];
    document.querySelectorAll('a, option, button').forEach((el) => {
      const txt = (el.textContent || '').trim();
      if (txt.includes('秋葉原') || txt.includes('渋谷') || txt.includes('新宿')) {
        list.push({
          tag: el.tagName,
          text: txt,
          href: (el as any).href || '',
          value: (el as any).value || '',
          onclick: el.getAttribute('onclick') || '',
        });
      }
    });
    return list;
  });

  console.log('Branches found on chart page:', branches);
  await browser.close();
}

inspectChartPage();
