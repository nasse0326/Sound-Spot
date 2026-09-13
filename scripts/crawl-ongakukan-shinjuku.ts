import fs from 'fs';
import path from 'path';
import { fetchOngakukanShinjukuWestDays } from './lib/ongakukan-fetcher';

async function main() {
  console.log('🚀 スタジオ音楽館 新宿西口店の21日間リアル空き状況を取得開始...');
  try {
    const rooms = await fetchOngakukanShinjukuWestDays(new Date(), 21);
    const outPath = path.resolve(process.cwd(), 'src/data/ongakukan-shinjuku-real.json');
    fs.writeFileSync(outPath, JSON.stringify({
      updatedAt: new Date().toISOString(),
      rooms,
    }, null, 2), 'utf-8');
    console.log(`💾 計${rooms.length}部屋の空き状況を ${outPath} に保存しました！`);
  } catch (err: any) {
    console.error('❌ 取得エラー:', err.message);
    process.exit(1);
  }
}

main();
