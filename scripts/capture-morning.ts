import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 1. 希望時間帯を「08:00〜10:00」（早朝枠）に変更
  const startSelect = page.locator('select').nth(0); // first select in form: startTime
  await startSelect.selectOption('08:00');
  await page.waitForTimeout(300);

  const endSelect = page.locator('select').nth(1); // second select in form: endTime
  await endSelect.selectOption('10:00');
  await page.waitForTimeout(600);

  await page.screenshot({
    path: 'C:/Users/user/.gemini/antigravity/brain/20c7b6b8-1db8-4c4a-a768-7e3be8e3fbc0/akiba-morning-search.png'
  });
  console.log('Captured akiba-morning-search.png');

  // 2. タイムライン表示に切り替え（06:00から始まる拡張タイムライン）
  const timelineBtn = page.getByRole('button', { name: 'タイムライン' });
  await timelineBtn.click();
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: 'C:/Users/user/.gemini/antigravity/brain/20c7b6b8-1db8-4c4a-a768-7e3be8e3fbc0/akiba-timeline-morning.png'
  });
  console.log('Captured akiba-timeline-morning.png');

  await browser.close();
  console.log('All morning screenshots captured successfully!');
}

main().catch(console.error);
