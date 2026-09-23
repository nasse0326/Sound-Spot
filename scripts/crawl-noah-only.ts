/**
 * ノア（SOUND STUDIO NOAH）のみを単独巡回するエントリポイント。
 * `npm run crawl`（scripts/crawl-studios.ts）はimport時にmain()が自動実行され
 * 全店舗を巡回してしまうため、IS_TEST_RUNを先にセットしてから動的importすることで
 * main()の自動発火を止め、ノアの巡回関数だけを呼び出す。
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
process.env.IS_TEST_RUN = '1';

async function main() {
  const { runNoahWithStealthSafeguards } = await import('./crawl-studios');
  const { CRAWL_DAY_COUNT } = await import('../src/config/crawl-schedule');
  await runNoahWithStealthSafeguards(new Date(), CRAWL_DAY_COUNT);
}

main();
