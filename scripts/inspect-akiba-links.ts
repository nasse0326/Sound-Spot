import { chromium } from 'playwright';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

async function inspectAkibaStorePage() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  await page.goto('https://www.studionoah.jp/akihabara/', { waitUntil: 'networkidle', timeout: 30000 });

  // Find all links containing chart, yoyaku, or booking
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map((a) => ({
      text: (a.textContent || '').trim(),
      href: a.href,
      onclick: a.getAttribute('onclick') || '',
    })).filter(l => l.href.includes('noahweb') || l.href.includes('chart') || l.text.includes('予約') || l.text.includes('空き'));
  });

  console.log('Booking links on Akihabara store page:', links);
  await browser.close();
}

inspectAkibaStorePage();
