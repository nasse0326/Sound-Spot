import { Studio, RoomWithSlots, AvailabilitySlot } from '@/types/studio';
import { getAkihabaraRealRooms, AKIBA_STUDIOS } from './akiba-converter';
import { GATEWAY_SHIBUYA_STUDIO, getGatewayShibuyaRealRooms } from './gateway-converter';
import { getNodeShinjukuRealRooms, NODE_SHINJUKU_STUDIO } from './node-converter';
import { getNoahAllTokyoRealRooms, NOAH_STUDIOS_META } from './noah-tokyo-converter';
import { getPentaRealRooms, PENTA_STUDIOS } from './penta-converter';
import { getOngakukanShinjukuRealRooms, ONGAKUKAN_SHINJUKU_STUDIO } from './ongakukan-shinjuku-converter';
import { getGatewayTakadanobabaRealRooms, GATEWAY_TAKADANOBABA_STUDIO } from './gateway-takadanobaba-converter';
import { getOngakukanTakadanobabaRealRooms, ONGAKUKAN_TAKADANOBABA_STUDIO } from './ongakukan-takadanobaba-converter';
import { getBotTakadanobabaRealRooms, BOT_TAKADANOBABA_STUDIO } from './bot-takadanobaba-converter';
import { getBazookaRooms, BAZOOKA_STUDIO } from './bazooka-converter';

// 都内3大エリア（渋谷・新宿・秋葉原）計17店舗の正規スタジオマスター
export const MOCK_STUDIOS: Studio[] = [
  // 秋葉原エリア (5店舗)
  ...AKIBA_STUDIOS,
  NOAH_STUDIOS_META['akihabara'],
  NOAH_STUDIOS_META['ochanomizu'],

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
  ONGAKUKAN_SHINJUKU_STUDIO,

  // 高田馬場エリア (5店舗)
  NOAH_STUDIOS_META['takadanobaba'],
  GATEWAY_TAKADANOBABA_STUDIO,
  ONGAKUKAN_TAKADANOBABA_STUDIO,
  BOT_TAKADANOBABA_STUDIO,
  BAZOOKA_STUDIO,
];

// 互換性のための空スロット関数
export function getMockSlotsForDate(_dateStr: string): Record<string, AvailabilitySlot[]> {
  return {};
}

/**
 * 部屋とスタジオ、機材、スロットを結合した正規リストを取得（ダミーデータ完全排除）
 * 秋葉原・渋谷・新宿の全15店舗・全170室を網羅
 */
export function getMockRoomsWithSlots(dateStr: string): RoomWithSlots[] {
  // 1. 秋葉原エリア（NOAH以外）(3店舗 / 22部屋: BOT 8室, GOODMAN 10室, 音楽館 7室)
  const akibaRooms = getAkihabaraRealRooms(dateStr);

  // 2. 渋谷ゲートウェイ (1店舗 / 12部屋)
  const gatewayRooms = getGatewayShibuyaRealRooms(dateStr);

  // 3. 新宿NODE (1店舗 / 7部屋)
  const nodeRooms = getNodeShinjukuRealRooms(dateStr);

  // 4. ノア店舗群 (渋谷4店・新宿店・秋葉原店・御茶ノ水店: 計101部屋)
  // ※NOAH秋葉原店もこちらから供給される（akihabara-real.jsonには含まれない）
  const noahRooms = getNoahAllTokyoRealRooms(dateStr);

  // 5. ペンタ店舗群 (渋谷シティ 7室, 渋谷ジューク 7室, 渋谷ムーン 6室, 新宿店 19室: 計39部屋)
  const pentaRooms = getPentaRealRooms(dateStr);

  // 6. 音楽館 新宿西口店 (1店舗 / 7部屋)
  const ongakukanShinjukuRooms = getOngakukanShinjukuRealRooms(dateStr);

  // 7. 高田馬場エリア (4店舗 / ゲートウェイ15室・音楽館6室・BOT11室・BAZOOKA6室 ※ノアは上記noahRoomsに含む)
  const gatewayBabaRooms = getGatewayTakadanobabaRealRooms(dateStr);
  const ongakukanBabaRooms = getOngakukanTakadanobabaRealRooms(dateStr);
  const botBabaRooms = getBotTakadanobabaRealRooms(dateStr);
  const bazookaRooms = getBazookaRooms();

  return [
    ...akibaRooms, ...gatewayRooms, ...nodeRooms, ...noahRooms, ...pentaRooms, ...ongakukanShinjukuRooms,
    ...gatewayBabaRooms, ...ongakukanBabaRooms, ...botBabaRooms, ...bazookaRooms,
  ];
}
