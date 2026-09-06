import { chromium } from 'playwright';
import fs from 'fs';

async function fetchOngakukanRealSchedule() {
  console.log('📡 音楽館アキバ店のリアル空き枠テーブルを取得中...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1. エントリーして sescode を取得
  await page.goto('https://www.ajg.jp/shop/ReservationTop.php?id=Twb03vvjqn2fba1', { waitUntil: 'networkidle' });
  // 1. ページ内の「スタジオ料金　1時間」のリンクを取得
  const linkHref = await page.evaluate(() => {
    const a = Array.from(document.querySelectorAll('a')).find(el => el.href.includes('menuid=14'));
    return a ? a.href : '';
  });

  if (!linkHref) {
    console.error('❌ menuid=14 のリンクが見つかりませんでした。');
    await browser.close();
    return;
  }
  console.log('✅ スケジュールURL取得成功:', linkHref);

  // 2. 1時間枠スケジュール画面へ遷移
  await page.goto(linkHref, { waitUntil: 'networkidle' });

  // 3. スタジオ一覧と空き枠を解析
  const data = await page.evaluate(() => {
    // ページ内のテーブルまたはリンク・ラジオを解析
    const rooms: any[] = [];
    document.querySelectorAll('table').forEach((table) => {
      const text = table.textContent || '';
      if (text.includes('時') || text.includes('：') || text.includes('st')) {
        // テーブルの構造をダンプ
      }
    });

    return {
      title: document.title,
      htmlLength: document.body.innerHTML.length,
      tablesCount: document.querySelectorAll('table').length,
      linksCount: document.querySelectorAll('a').length,
    };
  });

  console.log('Parsed summary:', data);
  fs.writeFileSync('ongakukan-real-schedule.html', await page.content());
  console.log('✅ ongakukan-real-schedule.html に保存完了！');

  await browser.close();
}

fetchOngakukanRealSchedule();
