import { chromium } from 'playwright';
import fs from 'fs';

async function fetchOngakukanSchedule() {
  console.log('📡 音楽館アキバ店のReservationTopへアクセス...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.ajg.jp/shop/ReservationTop.php?id=Twb03vvjqn2fba1', { waitUntil: 'networkidle' });
  console.log('Current URL after ReservationTop:', page.url());

  // Find buttons/links (e.g. 空き状況確認 or スタジオから選ぶ or 日時から選ぶ)
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, button, input[type="submit"], input[type="button"]')).map((el: any) => ({
      tag: el.tagName,
      text: (el.textContent || el.value || '').trim(),
      href: el.href || '',
      onclick: el.getAttribute('onclick') || '',
    }));
  });
  console.log('Links found:', links);

  // Click date or studio button if available
  const dateBtn = page.locator('a:has-text("空き状況"), a:has-text("スタジオ"), a:has-text("日時"), input[value*="空き"], input[value*="スタジオ"]').first();
  if (await dateBtn.count() > 0) {
    console.log('Clicking button:', await dateBtn.textContent() || await dateBtn.getAttribute('value'));
    await dateBtn.click();
    await page.waitForLoadState('networkidle');
    console.log('New URL:', page.url());
    fs.writeFileSync('ongakukan-calendar-page.html', await page.content());
    console.log('Saved: ongakukan-calendar-page.html');
  }

  await browser.close();
}

fetchOngakukanSchedule();
