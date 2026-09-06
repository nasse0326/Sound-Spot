import { chromium } from 'playwright';

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  // 1. タイムライン表示（スクロールして30分枠を見る）
  await page.goto('http://localhost:3000/?area=%E6%B8%8B%E8%B0%B7&date=2026-09-07', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const timelineBtn = page.getByRole('button', { name: 'タイムライン' });
  await timelineBtn.click();
  await page.waitForTimeout(500);

  // 少し下にスクロールして30分開始の部屋（Sst, A3st, G3st, B3st, E2st, Cst）を中央に捉える
  await page.evaluate(() => window.scrollBy(0, 350));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/20c7b6b8-1db8-4c4a-a768-7e3be8e3fbc0/timeline-30min-shift-scrolled.png' });

  await browser.close();
  console.log('✅ スクロール版スクリーンショット保存完了！');
}

takeScreenshots();
