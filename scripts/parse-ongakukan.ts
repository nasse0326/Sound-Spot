import { chromium } from 'playwright';
import path from 'path';

async function parseOngakukanHtml() {
  const filePath = path.resolve(process.cwd(), 'ongakukan-real-schedule.html');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`file://${filePath}`);

  const data = await page.evaluate(() => {
    // 音楽館アキバ店のテーブル構造解析
    const rows = Array.from(document.querySelectorAll('tr'));
    const result: any[] = [];

    rows.forEach((tr, idx) => {
      const text = (tr.textContent || '').trim();
      const cells = Array.from(tr.querySelectorAll('th, td')).map(c => (c.textContent || '').trim());
      if (cells.length > 3) {
        result.push({
          row: idx,
          cellsCount: cells.length,
          firstFewCells: cells.slice(0, 5),
        });
      }
    });

    return result;
  });

  console.log('Ongakukan parsed rows (sample):', data.slice(0, 15));
  await browser.close();
}

parseOngakukanHtml();
