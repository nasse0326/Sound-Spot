import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  // 1. 秋葉原エリア カードビュー（デフォルト: 空きありのみ表示）
  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  await page.screenshot({
    path: 'C:/Users/user/.gemini/antigravity/brain/20c7b6b8-1db8-4c4a-a768-7e3be8e3fbc0/akiba-available-only.png'
  });
  console.log('Captured akiba-available-only.png');

  // 2. 「満室を非表示中」ボタンをクリックして全36部屋を表示
  const toggleBtn = page.getByRole('button', { name: '満室を非表示中' });
  await toggleBtn.click();
  await page.waitForTimeout(600);

  await page.screenshot({
    path: 'C:/Users/user/.gemini/antigravity/brain/20c7b6b8-1db8-4c4a-a768-7e3be8e3fbc0/akiba-all-rooms-toggle.png'
  });
  console.log('Captured akiba-all-rooms-toggle.png');

  // 3. タイムライン表示に切り替え
  const timelineBtn = page.getByRole('button', { name: 'タイムライン' });
  await timelineBtn.click();
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: 'C:/Users/user/.gemini/antigravity/brain/20c7b6b8-1db8-4c4a-a768-7e3be8e3fbc0/akiba-timeline-view.png'
  });
  console.log('Captured akiba-timeline-view.png');

  // 4. 再度カードビューに戻り、部屋詳細モーダルを開く
  const cardBtn = page.getByRole('button', { name: 'カード' });
  await cardBtn.click();
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  const detailBtn = page.getByRole('button', { name: '機材・部屋詳細' }).first();
  await detailBtn.click();
  await page.waitForTimeout(600);

  await page.screenshot({
    path: 'C:/Users/user/.gemini/antigravity/brain/20c7b6b8-1db8-4c4a-a768-7e3be8e3fbc0/akiba-room-modal.png'
  });
  console.log('Captured akiba-room-modal.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch(console.error);
