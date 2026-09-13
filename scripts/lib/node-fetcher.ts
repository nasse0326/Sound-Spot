/**
 * Pure Node fetch scraper for STUDIO NODE Shinjuku (studio-node.jp ASP system)
 * Completely eliminates browser overhead and fetches 21 days of slot data.
 */
import { format, addDays } from 'date-fns';

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

/**
 * Fetches availability slots for STUDIO NODE Shinjuku for up to dayCount days.
 */
export async function fetchNodeShinjukuDays(
  baseDate: Date = new Date(),
  dayCount: number = 21
): Promise<NodeRoomData[]> {
  console.log(`📡 [STUDIO NODE 新宿店] リアルタイム空き状況を取得中 (Node fetch / 全7部屋 / ${dayCount}日間)...`);

  const loginUrl = 'https://www.studio-node.jp/studio/member/VisitorLogin.php?lc=llcvcamtc&mn=1&gr=3';
  const postUrl = 'https://www.studio-node.jp/studio/member/member_select.php';

  const roomKeys = Object.keys(NODE_ROOM_SPECS);
  const roomMap: Record<string, NodeRoomData> = {};
  for (const k of roomKeys) {
    const spec = NODE_ROOM_SPECS[k];
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
      form.append('grand', '3');
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

          const offset = roomMap[currentRoomKey].offset;
          for (let slotIdx = 1; slotIdx <= 14; slotIdx++) {
            const startH = 8 + slotIdx;
            const endH = 9 + slotIdx;
            const minStr = offset === 30 ? '30' : '00';
            const startHStr = String(startH).padStart(2, '0');
            const endHStr = String(endH).padStart(2, '0');
            const isAvail = availableSlots.has(slotIdx);

            roomMap[currentRoomKey].slots.push({
              id: `node-${currentRoomKey}-${dateStr}-${startHStr}${minStr}`,
              start_time: `${dateStr}T${startHStr}:${minStr}:00+09:00`,
              end_time: `${dateStr}T${endHStr}:${minStr}:00+09:00`,
              status: isAvail ? 'AVAILABLE' : 'BOOKED',
            });
          }
        }
      } catch (err: any) {
        console.warn(`  ⚠️ [NODE] ${dateStr} の取得中にエラー: ${err.message}`);
      }

      await new Promise(r => setTimeout(r, 60));
    }
  } catch (err: any) {
    console.error(`  ❌ [NODE Error] ${err.message}`);
  }

  const results = Object.values(roomMap);
  console.log(`  ✅ [STUDIO NODE 新宿店] 取得完了: ${results.length}部屋 (各${results[0]?.slots.length || 0}スロット)`);
  return results;
}
