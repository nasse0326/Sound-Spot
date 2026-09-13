/**
 * Sound Studio NOAH Official Branch Scanner
 * Automatically fetches room metadata, studio IDs, tatami sizes, start offsets,
 * and authentic `chart_login_required_flg` for any Noah branch using pure Node fetch!
 *
 * Usage:
 *   npx tsx scripts/scan-noah-branch.ts <branch_key_or_id>
 * Example:
 *   npx tsx scripts/scan-noah-branch.ts ebisu
 *   npx tsx scripts/scan-noah-branch.ts 10
 *   npx tsx scripts/scan-noah-branch.ts all
 */

export const NOAH_BRANCH_MAP: Record<string, { id: string; name: string }> = {
  shibuya: { id: '114', name: 'サウンドスタジオノア 渋谷本店' },
  shibuya1: { id: '10', name: 'サウンドスタジオノア 渋谷1号店' },
  shibuya2: { id: '14', name: 'サウンドスタジオノア 渋谷2号店' },
  shibuya3: { id: '118', name: 'サウンドスタジオノア 渋谷3号店' },
  ebisu: { id: '23', name: 'サウンドスタジオノア 恵比寿店' },
  yoyogi: { id: '1', name: 'サウンドスタジオノア 代々木店' },
  shinjuku: { id: '17', name: 'サウンドスタジオノア 新宿店' },
  shinjuku_annex: { id: '76', name: 'サウンドスタジオノア 新宿ANNEX店' },
  takadanobaba: { id: '11', name: 'サウンドスタジオノア 高田馬場店' },
  ikebukuro: { id: '13', name: 'サウンドスタジオノア 池袋店' },
  ikebukuro_annex: { id: '112', name: 'サウンドスタジオノア 池袋ANNEX店' },
  ochanomizu: { id: '100', name: 'サウンドスタジオノア 御茶ノ水店' },
  akihabara: { id: '18', name: 'サウンドスタジオノア 秋葉原店' },
  hatsudai: { id: '7', name: 'サウンドスタジオノア 初台店' },
  shimokitazawa: { id: '9', name: 'サウンドスタジオノア 下北沢店' },
  nakano: { id: '19', name: 'サウンドスタジオノア 中野店' },
  kichijoji: { id: '12', name: 'サウンドスタジオノア 吉祥寺店' },
  nogata: { id: '15', name: 'サウンドスタジオノア 野方店' },
  jiyugaoka: { id: '3', name: 'サウンドスタジオノア 自由が丘店' },
  toritsudai: { id: '8', name: 'サウンドスタジオノア 都立大店' },
  sangenjaya: { id: '5', name: 'サウンドスタジオノア 三軒茶屋店' },
  gakugeidai: { id: '78', name: 'サウンドスタジオノア 学芸大店' },
  komazawa: { id: '6', name: 'サウンドスタジオノア 駒沢店' },
  ginza: { id: '16', name: 'サウンドスタジオノア 銀座店' },
  akasaka: { id: '4', name: 'サウンドスタジオノア 赤坂店' },
  harajuku: { id: '109', name: 'サウンドスタジオノア 原宿店' },
  megurofudomae: { id: '96', name: 'サウンドスタジオノア 目黒不動前店' },
  denenchofu: { id: '21', name: 'サウンドスタジオノア 田園調布店' },
  nakameguro: { id: '117', name: 'サウンドスタジオノア 中目黒店' },
  hakone: { id: '115', name: 'サウンドスタジオノア 箱根仙石原店' },
};

export interface ScannedRoom {
  id: string;
  studioId: number;
  name: string;
  tatami: number;
  offset: number;
  loginRequired: boolean;
  regularPrice: number | null;
  personPrice: number | null;
}

export async function scanNoahBranch(branchKeyOrId: string): Promise<{ key: string; name: string; rooms: ScannedRoom[] } | null> {
  let branchId = branchKeyOrId;
  let branchKey = branchKeyOrId;
  let branchName = `サウンドスタジオノア (${branchKeyOrId})`;

  if (NOAH_BRANCH_MAP[branchKeyOrId]) {
    branchId = NOAH_BRANCH_MAP[branchKeyOrId].id;
    branchKey = branchKeyOrId;
    branchName = NOAH_BRANCH_MAP[branchKeyOrId].name;
  } else {
    // Find by ID
    const foundEntry = Object.entries(NOAH_BRANCH_MAP).find(([k, v]) => v.id === branchKeyOrId);
    if (foundEntry) {
      branchKey = foundEntry[0];
      branchName = foundEntry[1].name;
    }
  }

  const url = `https://www.studionoah.jp/noahweb/Chart/studios?b[]=${branchId}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
    }
  });

  if (!res.ok) {
    console.error(`❌ HTTP error ${res.status} fetching branch ${branchKeyOrId}`);
    return null;
  }

  const data = await res.json();
  const branches = data.branches || [];
  if (branches.length === 0) {
    console.warn(`⚠️ No branches returned for ID ${branchId}`);
    return null;
  }

  const branchData = branches[0];
  const studios = (branchData.studios || []).filter((s: any) => Boolean(s.view_web_flg));

  const rooms: ScannedRoom[] = studios.map((s: any) => {
    const rawName = s.studio_name || `Studio ${s.studio_id}`;
    const tatamiNum = Math.round(Number(s.size) || 10);
    const viewSize = s.view_size || `${tatamiNum}帖`;
    const offset = s.start_time === 1 ? 30 : 0;
    const loginRequired = s.chart_login_required_flg === 1;

    // clean id slug
    const cleanName = rawName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const roomId = `noah-${branchKey}-${cleanName}`;

    return {
      id: roomId,
      studioId: Number(s.studio_id),
      name: `${rawName} (${viewSize})`,
      tatami: tatamiNum,
      offset,
      loginRequired,
      regularPrice: s.regular_price ? Number(s.regular_price) : null,
      personPrice: s.person_price ? Number(s.person_price) : null,
    };
  });

  return {
    key: branchKey,
    name: branchData.branch_name || branchName,
    rooms
  };
}

// CLI Execution
async function main() {
  const args = process.argv.slice(2);
  const target = args[0] || 'ebisu';

  if (target === 'all') {
    console.log('🚀 全ノア店舗の公式部屋スペック＆ログイン要否を一括スキャンします...\n');
    for (const key of Object.keys(NOAH_BRANCH_MAP)) {
      const result = await scanNoahBranch(key);
      if (result) {
        console.log(`\n### ${result.name} (key: '${result.key}', 全${result.rooms.length}部屋)`);
        const loginReqCount = result.rooms.filter(r => r.loginRequired).length;
        const noLoginCount = result.rooms.length - loginReqCount;
        console.log(`   🟢 ログイン不要: ${noLoginCount}室 / 🔒 ログイン必須: ${loginReqCount}室`);
      }
      await new Promise(r => setTimeout(r, 200));
    }
    return;
  }

  console.log(`🔍 店舗 '${target}' のスタジオスペック＆ログイン要否をスキャン中...`);
  const result = await scanNoahBranch(target);
  if (!result) {
    console.log('スキャン結果を取得できませんでした。');
    return;
  }

  console.log(`\n======================================================`);
  console.log(`店舗名: ${result.name} (Key: ${result.key})`);
  console.log(`部屋数: ${result.rooms.length}部屋`);
  console.log(`======================================================\n`);

  console.log('TypeScript 定義コード:');
  console.log('------------------------------------------------------');
  console.log(`  {`);
  console.log(`    key: '${result.key}',`);
  console.log(`    name: '${result.name}',`);
  console.log(`    rooms: [`);
  result.rooms.forEach(r => {
    console.log(`      { id: '${r.id}', studioId: ${r.studioId}, name: '${r.name}', tatami: ${r.tatami}, offset: ${r.offset}, loginRequired: ${r.loginRequired} },`);
  });
  console.log(`    ]`);
  console.log(`  },`);
  console.log('------------------------------------------------------');
}

if (process.argv[1]?.includes('scan-noah-branch')) {
  main().catch(console.error);
}
