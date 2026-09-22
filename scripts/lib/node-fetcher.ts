/**
 * Pure Node fetch scraper for STUDIO NODE (studio-node.jp ASP system, "ReserveMart" powered).
 * Shinjuku and Suidobashi are both served by the same account (office=1020013) under different
 * grand/gr branch IDs (Shinjuku=3, Suidobashi=1) - same VisitorLogin.php + member_select.php flow,
 * only the branch parameter and room list differ.
 * Completely eliminates browser overhead and fetches CRAWL_DAY_COUNT days of slot data.
 */
import { format, addDays } from 'date-fns';
import { CRAWL_DAY_COUNT } from '../../src/config/crawl-schedule';

export interface NodeSlot {
  id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED';
  price?: number;
}

export interface NodeRoomData {
  id: string;
  name: string;
  tatami: number;
  offset: number;
  slots: NodeSlot[];
}

export const NODE_ROOM_SPECS: Record<string, { id: string; name: string; tatami: number; offset: number }> = {
  '3Cst': { id: 'node-shinjuku-3Cst', name: '3Cst (10帖)', tatami: 10, offset: 0 },
  '3Dst': { id: 'node-shinjuku-3Dst', name: '3Dst (16帖)', tatami: 16, offset: 0 },
  '4Est': { id: 'node-shinjuku-4Est', name: '4Est (12帖)', tatami: 12, offset: 0 },
  '4Fst': { id: 'node-shinjuku-4Fst', name: '4Fst (14帖)', tatami: 14, offset: 0 },
  '2Ast': { id: 'node-shinjuku-2Ast', name: '2Ast (9帖)', tatami: 9, offset: 30 },
  '2Bst': { id: 'node-shinjuku-2Bst', name: '2Bst (11帖)', tatami: 11, offset: 30 },
  '5Gst': { id: 'node-shinjuku-5Gst', name: '5Gst (26帖)', tatami: 26, offset: 30 },
};

// 水道橋店の部屋キー。201st/202st/301st/302st/403st/SRroomは00分スタート、
// 203st/204st/303st/401st/402st/501stは30分スタート（公式サイト予約表の「00分～」
// 「30分～」表記どおり。ブラウザでVisitorLogin.php?lc=llcvcamtc&mn=1&gr=1経由で確認済み）。
export const NODE_SUIDOBASHI_ROOM_SPECS: Record<string, { id: string; name: string; tatami: number; offset: number }> = {
  '201st': { id: 'node-suidobashi-201st', name: '201st (10帖)', tatami: 10, offset: 0 },
  '202st': { id: 'node-suidobashi-202st', name: '202st (10帖)', tatami: 10, offset: 0 },
  '301st': { id: 'node-suidobashi-301st', name: '301st (10帖)', tatami: 10, offset: 0 },
  '302st': { id: 'node-suidobashi-302st', name: '302st (10帖)', tatami: 10, offset: 0 },
  '403st': { id: 'node-suidobashi-403st', name: '403st (20帖)', tatami: 20, offset: 0 },
  'SRroom': { id: 'node-suidobashi-srroom', name: 'SR room (7帖)', tatami: 7, offset: 0 },
  '203st': { id: 'node-suidobashi-203st', name: '203st (9帖)', tatami: 9, offset: 30 },
  '204st': { id: 'node-suidobashi-204st', name: '204st (8帖)', tatami: 8, offset: 30 },
  '303st': { id: 'node-suidobashi-303st', name: '303st (20帖)', tatami: 20, offset: 30 },
  '401st': { id: 'node-suidobashi-401st', name: '401st (10帖)', tatami: 10, offset: 30 },
  '402st': { id: 'node-suidobashi-402st', name: '402st (10帖)', tatami: 10, offset: 30 },
  '501st': { id: 'node-suidobashi-501st', name: '501st (14帖)', tatami: 14, offset: 30 },
};

/**
 * Fetches availability slots for a STUDIO NODE branch for up to dayCount days.
 */
async function fetchNodeBranchDays(
  grand: number,
  roomSpecs: Record<string, { id: string; name: string; tatami: number; offset: number }>,
  storeLabel: string,
  baseDate: Date,
  dayCount: number
): Promise<NodeRoomData[]> {
  console.log(`📡 [STUDIO NODE ${storeLabel}] リアルタイム空き状況を取得中 (Node fetch / 全${Object.keys(roomSpecs).length}部屋 / ${dayCount}日間)...`);

  const loginUrl = `https://www.studio-node.jp/studio/member/VisitorLogin.php?lc=llcvcamtc&mn=1&gr=${grand}`;
  const postUrl = 'https://www.studio-node.jp/studio/member/member_select.php';

  const roomKeys = Object.keys(roomSpecs);
  const roomMap: Record<string, NodeRoomData> = {};
  for (const k of roomKeys) {
    const spec = roomSpecs[k];
    roomMap[k] = {
      id: spec.id,
      name: spec.name,
      tatami: spec.tatami,
      offset: spec.offset,
      slots: [],
    };
  }

  try {
    const initRes = await fetch(loginUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      }
    });

    const setCookies = (initRes.headers as any).getSetCookie ? (initRes.headers as any).getSetCookie() : [initRes.headers.get('set-cookie') || ''];
    const cookieHeader = setCookies.map((c: string) => c.split(';')[0]).filter(Boolean).join('; ');

    const dateList: string[] = [];
    for (let i = 0; i < dayCount; i++) {
      dateList.push(format(addDays(baseDate, i), 'yyyy-MM-dd'));
    }

    for (const dateStr of dateList) {
      const form = new URLSearchParams();
      form.append('office', '1020013');
      form.append('grand', String(grand));
      form.append('mngfg', '1');
      form.append('rdate', dateStr);
      form.append('member_select', '3');
      form.append('sid', '');
      form.append('day_btn', dateStr);
      form.append('button', '更新');

      try {
        const res = await fetch(postUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
            'Cookie': cookieHeader,
            'Referer': loginUrl,
          },
          body: form.toString()
        });

        const buffer = await res.arrayBuffer();
        const html = new TextDecoder('euc-jp').decode(buffer);

        const trs = [...html.matchAll(/<tr[^>]*class=["']tr_base["'][^>]*>([\s\S]*?)<\/tr>/gi)];

        for (const tr of trs) {
          const rowHtml = tr[1];
          let currentRoomKey = '';
          for (const key of roomKeys) {
            if (rowHtml.includes(key)) {
              currentRoomKey = key;
              break;
            }
          }
          if (!currentRoomKey || !roomMap[currentRoomKey]) continue;

          const cells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1]);

          const availableSlots = new Set<number>();
          for (const c of cells) {
            const valMatch = c.match(/name=["']c_v\[\]["'][^>]*value=["'](\d{2})(\d{2})["']/i);
            if (valMatch) {
              const slotIdx = parseInt(valMatch[2], 10);
              availableSlots.add(slotIdx);
            }
          }

          // 実カレンダーは10:00始まり・22:00-23:00終わりの13コマ（slotIdx 1が10:00〜11:00に対応）。
          // 以前は8時始まり・14コマとして扱っており、実在しない9:00枠を生成した上で
          // 全スロットの時刻を1時間早くズラしてしまっていた（実際のチェックボックスvalue
          // "01xx"のxxで検証済み）。水道橋店も同一グリッド仕様であることを実地確認済み。
          const offset = roomMap[currentRoomKey].offset;
          for (let slotIdx = 1; slotIdx <= 13; slotIdx++) {
            const startH = 9 + slotIdx;
            const endH = 10 + slotIdx;
            const minStr = offset === 30 ? '30' : '00';
            const startHStr = String(startH).padStart(2, '0');
            const endHStr = String(endH).padStart(2, '0');
            const isAvail = availableSlots.has(slotIdx);

            roomMap[currentRoomKey].slots.push({
              id: `node-${grand}-${currentRoomKey}-${dateStr}-${startHStr}${minStr}`,
              start_time: `${dateStr}T${startHStr}:${minStr}:00+09:00`,
              end_time: `${dateStr}T${endHStr}:${minStr}:00+09:00`,
              status: isAvail ? 'AVAILABLE' : 'BOOKED',
            });
          }
        }
      } catch (err: any) {
        console.warn(`  ⚠️ [NODE ${storeLabel}] ${dateStr} の取得中にエラー: ${err.message}`);
      }

      // 礼儀正しいウェイト（120ms）。GitHub Actions側は実測30秒未満で完走しており
      // 時間的な余裕があるため、より人間らしいペースへ倍増した。
      await new Promise(r => setTimeout(r, 120));
    }
  } catch (err: any) {
    console.error(`  ❌ [NODE ${storeLabel} Error] ${err.message}`);
  }

  const results = Object.values(roomMap);
  console.log(`  ✅ [STUDIO NODE ${storeLabel}] 取得完了: ${results.length}部屋 (各${results[0]?.slots.length || 0}スロット)`);
  return results;
}

export async function fetchNodeShinjukuDays(
  baseDate: Date = new Date(),
  dayCount: number = CRAWL_DAY_COUNT
): Promise<NodeRoomData[]> {
  return fetchNodeBranchDays(3, NODE_ROOM_SPECS, '新宿店', baseDate, dayCount);
}

export async function fetchNodeSuidobashiDays(
  baseDate: Date = new Date(),
  dayCount: number = CRAWL_DAY_COUNT
): Promise<NodeRoomData[]> {
  return fetchNodeBranchDays(1, NODE_SUIDOBASHI_ROOM_SPECS, '水道橋店', baseDate, dayCount);
}
