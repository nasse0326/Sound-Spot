import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://studi-ol.com/shop/705', { waitUntil: 'networkidle' });

  const fetchTest = await page.evaluate(async () => {
    const token = (window as any).$ ? (window as any).$('input[name="_token"]').val() : '';
    const dates = [
      '2026-12-05',
      '2026-12-06',
      '2026-12-07',
      '2026-12-08',
      '2026-12-09',
      '2026-12-10'
    ];
    const out: any[] = [];
    for (const d of dates) {
      try {
        const res = await fetch('https://studi-ol.com/get_schedule_shop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: `_token=${encodeURIComponent(token)}&shop_id=705&start=${encodeURIComponent(d + ' 00:00:00')}&end=${encodeURIComponent(d + ' 23:59:59')}`
        });
        const json = await res.json();
        out.push({
          date: d,
          status: res.status,
          eventsCount: Array.isArray(json) ? json.length : 0,
          sampleEvent: Array.isArray(json) && json.length > 0 ? { title: json[0].title, start: json[0].start } : null
        });
      } catch (e: any) {
        out.push({ date: d, error: e.message });
      }
    }
    return out;
  });

  console.log('Fetch test results:', JSON.stringify(fetchTest, null, 2));
  await browser.close();
}

main().catch(console.error);
