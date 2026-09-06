import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 950 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. デフォルトカード表示（24hバッジ、14:00〜15:00の1時間自動設定確認）
  await page.screenshot({ path: 'akiba-default-cards-24h.png' });

  // 2. タイムライン切り替え（9:00〜24:00、指定枠14:00〜15:00ハイライト確認）
  const timelineBtn = page.getByRole('button', { name: 'タイムライン' });
  await timelineBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'akiba-timeline-highlight-9to24.png' });

  // 3. 早朝枠トグルをクリック（6:00〜24:00への展開確認）
  const earlyBtn = page.locator('button:has-text("早朝枠(6〜9時)")');
  await earlyBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'akiba-timeline-early-expanded.png' });

  await browser.close();
  console.log('Screenshots captured successfully');
}

main().catch(console.error);
