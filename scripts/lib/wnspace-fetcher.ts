/**
 * WnSpaceMusic（STUDIO BAYDチェーン等が使う独自の予約プラットフォーム）向けフェッチャー。
 * studi-ol.com/Reserve1.jpと異なり、ログイン不要で叩ける公開REST API
 * (https://wnspacemusic.jp/api/studios/bookings?studioIds=<id>&date=YYYY-MM-DD) が
 * 「既存の確定予約一覧」を直接JSONで返すため、HTMLスクレイピングが一切不要。
 * 24時間分の各コマについて、確定予約と重なるかどうかだけで空き/予約済みを判定する。
 */
import { format, addDays } from 'date-fns';
import { toIsoWithRollover } from './time-utils';
import { CRAWL_DAY_COUNT } from '../../src/config/crawl-schedule';

export interface WnspaceRoomSlot {
  id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
}

export interface WnspaceRoomData {
  id: number;
  name: string;
  slots: WnspaceRoomSlot[];
}

interface WnspaceStudioRoom {
  id: number;
  name: string;
}

export async function fetchWnspaceStudioDays(
  studioId: number,
  storeLabel: string,
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<WnspaceRoomData[]> {
  console.log(`📡 [WnSpaceMusic] ${storeLabel}の高速取得（公開API / ${dayCount}日間）を開始...`);

  const studioRes = await fetch(`https://wnspacemusic.jp/api/studios/${studioId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });
  if (!studioRes.ok) {
    throw new Error(`[WnSpaceMusic] ${storeLabel}: 部屋一覧の取得に失敗しました (HTTP ${studioRes.status})`);
  }
  const studio = await studioRes.json();
  const rooms: WnspaceStudioRoom[] = studio.rooms || [];

  const slotsByRoom: Record<number, WnspaceRoomSlot[]> = {};
  rooms.forEach((r) => { slotsByRoom[r.id] = []; });

  for (let d = 0; d < dayCount; d++) {
    const dateStr = format(addDays(baseDate, d), 'yyyy-MM-dd');
    try {
      const [bookingsRes, blockedRes] = await Promise.all([
        fetch(`https://wnspacemusic.jp/api/studios/bookings?studioIds=${studioId}&date=${dateStr}`),
        fetch(`https://wnspacemusic.jp/api/studios/blocked-slots?studioIds=${studioId}&date=${dateStr}`),
      ]);

      if (!bookingsRes.ok) {
        console.warn(`  ⚠️ [WnSpaceMusic] ${storeLabel} ${dateStr} HTTP ${bookingsRes.status}`);
        continue;
      }

      const bookings: any[] = await bookingsRes.json();
      const blocked = blockedRes.ok ? await blockedRes.json() : {};
      const studioBlock = blocked?.[String(studioId)] || { studioClosures: [], roomBlackouts: {} };
      const isStudioClosedToday = Array.isArray(studioBlock.studioClosures) && studioBlock.studioClosures.length > 0;
      const blackedOutRoomIds = new Set(Object.keys(studioBlock.roomBlackouts || {}).map((k) => Number(k)));

      // 部屋ごとに、その日の確定予約（分単位の区間）を集める。
      // 予約1件は複数部屋（イベント時のA+Eセット等）にまたがることがあるため、
      // トップレベルのstartTime/endTimeではなく各room要素自身の時刻を使う
      // （まれに部屋ごとに時刻が異なるケースがあるため安全側で個別に見る）。
      const bookedByRoom: Record<number, { start: number; end: number }[]> = {};
      rooms.forEach((r) => { bookedByRoom[r.id] = []; });

      for (const b of bookings) {
        if (b.status !== 'confirmed') continue;
        for (const room of (b.rooms || [])) {
          if (!(room.id in bookedByRoom)) continue;
          const [sh, sm] = String(room.startTime).split(':').map(Number);
          const [eh, em] = String(room.endTime).split(':').map(Number);
          bookedByRoom[room.id].push({ start: sh * 60 + sm, end: eh * 60 + em });
        }
      }

      for (const r of rooms) {
        const roomClosed = isStudioClosedToday || blackedOutRoomIds.has(r.id);
        const booked = bookedByRoom[r.id] || [];

        for (let h = 0; h < 24; h++) {
          const slotStartMin = h * 60;
          const slotEndMin = (h + 1) * 60;
          const startTimeIso = toIsoWithRollover(dateStr, h, 0);
          const endTimeIso = toIsoWithRollover(dateStr, h + 1, 0);

          let status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
          if (roomClosed) {
            status = 'MAINTENANCE';
          } else {
            const overlaps = booked.some((bk) => bk.start < slotEndMin && bk.end > slotStartMin);
            status = overlaps ? 'BOOKED' : 'AVAILABLE';
          }

          slotsByRoom[r.id].push({
            id: `slot-wnspace-${studioId}-${r.id}-${dateStr}-${String(h).padStart(2, '0')}00`,
            start_time: startTimeIso,
            end_time: endTimeIso,
            status,
          });
        }
      }

      await new Promise((res) => setTimeout(res, 100));
    } catch (err: any) {
      console.error(`  ❌ [WnSpaceMusic] ${storeLabel} ${dateStr} 取得エラー:`, err.message);
    }
  }

  const result: WnspaceRoomData[] = rooms.map((r) => ({ id: r.id, name: r.name, slots: slotsByRoom[r.id] || [] }));
  console.log(`  ✅ [WnSpaceMusic] ${storeLabel}: ${result.length}部屋、計${result.reduce((a, b) => a + b.slots.length, 0)}スロット取得完了`);
  return result;
}

// studioId=9はwnspacemusic.jp/api/studios経由で確認済み（STUDIO BAYD 高円寺店）。
export async function fetchStudioBaydKoenjiDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<WnspaceRoomData[]> {
  return fetchWnspaceStudioDays(9, 'STUDIO BAYD 高円寺店', baseDate, dayCount);
}

// studioId=7はwnspacemusic.jp/api/studios経由で確認済み（STUDIO BAYD 下北沢店）。
export async function fetchStudioBaydShimokitazawaDays(
  baseDate: Date,
  dayCount: number = CRAWL_DAY_COUNT
): Promise<WnspaceRoomData[]> {
  return fetchWnspaceStudioDays(7, 'STUDIO BAYD 下北沢店', baseDate, dayCount);
}
