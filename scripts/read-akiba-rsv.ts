import { chromium } from 'playwright';

async function readAkibaReservationPage() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://www.st-ongakukan.com/reservation/akiba.html');

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, form, iframe')).map((el: any) => ({
      tag: el.tagName,
      href: el.href || el.action || el.src || '',
      text: (el.textContent || '').trim(),
    }));
  });

  console.log('Links on reservation/akiba.html:', links);
  await browser.close();
}

readAkibaReservationPage();
