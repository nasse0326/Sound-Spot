/**
 * webtoru.com系3店舗（STUDIO SUN西船橋店・Studio DIVO亀戸・スタジオ ダグアウト2）のみを
 * 単独巡回するエントリポイント。2026-09-26、webtoru.comがGitHub ActionsのIPを403で
 * 一律ブロックするようになったため、NOAHと同様ローカル実行専用に切り替えた。
 * `npm run crawl`（scripts/crawl-studios.ts）はimport時にmain()が自動実行され
 * 全店舗を巡回してしまうため、IS_TEST_RUNを先にセットしてから動的importすることで
 * main()の自動発火を止め、webtoru系3店舗の巡回関数だけを呼び出す。
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
process.env.IS_TEST_RUN = '1';

async function main() {
  const {
    crawlStudioSunNishiFunabashi,
    crawlStudioDivoKameido,
    crawlStudioDugout2Matsudo,
  } = await import('./crawl-studios');
  const { CRAWL_DAY_COUNT } = await import('../src/config/crawl-schedule');
  const now = new Date();
  await crawlStudioSunNishiFunabashi(now, CRAWL_DAY_COUNT);
  await crawlStudioDivoKameido(now, CRAWL_DAY_COUNT);
  await crawlStudioDugout2Matsudo(now, CRAWL_DAY_COUNT);
}

main();
