import { chromium } from 'playwright';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

async function findNoahBranches() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  // NOAHのマイページまたはトップへ行く
  await page.goto('https://www.studionoah.jp/noahweb/Mypages/', { waitUntil: 'networkidle', timeout: 30000 });

  // fetchで /noahweb/Chart/studios を実行
  const res = await page.evaluate(async () => {
    const r = await fetch('https://www.studionoah.jp/noahweb/Chart/studios');
    return await r.json();
  });

  console.log('Branches count:', res.branches ? res.branches.length : 0);
  if (res.branches) {
    for (const b of res.branches) {
      if (b.branch_name.includes('秋葉原') || b.web_branch_name.includes('秋葉原')) {
        console.log('🎯 FOUND AKIHABARA:', b.branch_id, b.branch_name, b.web_branch_name);
        console.log('Studios:', b.studios ? b.studios.map((s: any) => `${s.studio_name} (${s.view_size})`).join(', ') : 'none');
      }
    }
  }

  await browser.close();
}

findNoahBranches();
