import { chromium } from 'playwright';
import fs from 'fs';

async function fetchOngakukan() {
  console.log('📡 スタジオ音楽館の予約システム (ajg.jp) へアクセス中...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  });

  // 店舗の予約エントリー（トップ）にアクセス
  // 以前の検索結果で、音楽館の各店舗予約リンクがあった
  const entryUrls = [
    'https://www.ajg.jp/shop/',
    'http://www.st-ongakukan.com/akihabara/pr2.html',
    'https://www.ajg.jp/shop/ReservationStaff.php',
  ];

  for (const u of entryUrls) {
    console.log(`アクセス試行: ${u}`);
    try {
      await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 15000 });
      console.log('  URL:', page.url(), 'Title:', await page.title());
      const content = await page.content();
      if (content.includes('スタジオ') || content.includes('音楽館') || content.includes('アキバ')) {
        console.log('  🎯 音楽館コンテンツ発見！');
        fs.writeFileSync('ongakukan-shop-page.html', content);
      }
    } catch (e: any) {
      console.log('  Error:', e.message);
    }
  }

  await browser.close();
}

fetchOngakukan();
