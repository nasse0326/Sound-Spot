import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

async function clickNoahStudio() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  let chartData: any = null;
  page.on('response', async (res) => {
    if (res.url().includes('get_chart_data') || res.url().includes('schedule')) {
      console.log('RES:', res.status(), res.url());
      try {
        chartData = await res.json();
        console.log('🎉 JSON captured from:', res.url());
      } catch (e) {}
    }
  });

  await page.goto('https://www.studionoah.jp/noahweb/webs/chart/akihabara/', { waitUntil: 'networkidle', timeout: 30000 });

  // Inspect the input or click label
  const label = page.locator('.chart_st_list_label').first();
  console.log('Clicking label:', await label.textContent());
  await label.click();

  await page.waitForTimeout(5000);

  if (chartData) {
    fs.writeFileSync('noah-akiba-chart-success.json', JSON.stringify(chartData, null, 2));
    console.log('SUCCESS! Saved noah-akiba-chart-success.json');
  } else {
    console.log('Current URL after click:', page.url());
    await page.screenshot({ path: 'after-click-akiba.png' });
  }

  await browser.close();
}

clickNoahStudio();
