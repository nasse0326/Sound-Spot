import { Studio, RoomWithSlots, AvailabilitySlot } from '@/types/studio';
import { getAkihabaraRealRooms, AKIBA_STUDIOS } from './akiba-converter';
import { GATEWAY_SHIBUYA_STUDIO, getGatewayShibuyaRealRooms } from './gateway-converter';
import { getNodeShinjukuRealRooms, NODE_SHINJUKU_STUDIO } from './node-converter';
import { getNoahAllTokyoRealRooms, NOAH_STUDIOS_META } from './noah-tokyo-converter';
import { getPentaRealRooms, PENTA_STUDIOS } from './penta-converter';

// 都内3大エリア（渋谷・新宿・秋葉原）計16店舗の正規スタジオマスター
export const MOCK_STUDIOS: Studio[] = [
  // 秋葉原エリア (4店舗)
  ...AKIBA_STUDIOS,

  // 渋谷エリア (8店舗)
  GATEWAY_SHIBUYA_STUDIO,
  NOAH_STUDIOS_META['shibuya'],
  NOAH_STUDIOS_META['shibuya1'],
  NOAH_STUDIOS_META['shibuya2'],
  NOAH_STUDIOS_META['shibuya3'],
  PENTA_STUDIOS['shibuya-penta-city'],
  PENTA_STUDIOS['shibuya-penta-juke'],
  PENTA_STUDIOS['shibuya-penta-moon'],

  // 新宿エリア (4店舗)
  NOAH_STUDIOS_META['shinjuku'],
  NODE_SHINJUKU_STUDIO,
  PENTA_STUDIOS['shinjuku-penta-main'],
  PENTA_STUDIOS['shinjuku-penta-south'],
];

// 互換性のための空スロット関数
export function getMockSlotsForDate(_dateStr: string): Record<string, AvailabilitySlot[]> {
  return {};
}

/**
 * 部屋とスタジオ、機材、スロットを結合した正規リストを取得（ダミーデータ完全排除）
 * 秋葉原・渋谷・新宿の全16店舗・全165室以上を網羅
 */
export function getMockRoomsWithSlots(dateStr: string): RoomWithSlots[] {
  // 1. 秋葉原エリア (4店舗 / 36部屋: BOT, GOODMAN, 音楽館, ノア秋葉原店)
  const akibaRooms = getAkihabaraRealRooms(dateStr);

  // 2. 渋谷ゲートウェイ (1店舗 / 12部屋)
  const gatewayRooms = getGatewayShibuyaRealRooms(dateStr);

  // 3. 新宿NODE (1店舗 / 4部屋)
  const nodeRooms = getNodeShinjukuRealRooms(dateStr);

  // 4. ノア店舗群 (渋谷本店, 渋谷1号店, 渋谷2号店, 渋谷3号店, 新宿店: 計76部屋)
  // ※秋葉原店はakibaRooms側で反映されるため除外して重複を防ぐ
  const noahRooms = getNoahAllTokyoRealRooms(dateStr).filter(r => r.studioId !== 'akiba-noah');

  // 5. ペンタ店舗群 (渋谷シティ, 渋谷ジューク, 渋谷ムーン, 新宿店, 新宿南口店: 計37部屋)
  const pentaRooms = getPentaRealRooms(dateStr);

  return [...akibaRooms, ...gatewayRooms, ...nodeRooms, ...noahRooms, ...pentaRooms];
}
