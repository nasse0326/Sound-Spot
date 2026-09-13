import fs from 'fs';
import path from 'path';
import { fetchNoahStoreDays } from './lib/noah-fetcher';

async function main() {
  console.log('🚀 サウンドスタジオノア 御茶ノ水店の21日間リアル空き枠を取得中...');
  try {
    const ochanomizuRooms = await fetchNoahStoreDays('ochanomizu', new Date(), 21);
    console.log(`✅ 御茶ノ水店 ${ochanomizuRooms.length}部屋の枠を取得完了`);

    const jsonPath = path.resolve(process.cwd(), 'src/data/noah-tokyo-real.json');
    let data: { updatedAt: string; rooms: any[] } = { updatedAt: new Date().toISOString(), rooms: [] };
    if (fs.existsSync(jsonPath)) {
      data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    }

    // Remove existing ochanomizu rooms if any
    const existingOtherRooms = data.rooms.filter((r: any) => !r.id.startsWith('noah-ochanomizu-'));
    data.rooms = [...existingOtherRooms, ...ochanomizuRooms];
    data.updatedAt = new Date().toISOString();

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`💾 ${jsonPath} に御茶ノ水店を追加保存しました（全体部屋数: ${data.rooms.length}部屋）`);
  } catch (e: any) {
    console.error('❌ エラー:', e.message);
  }
}

main();
