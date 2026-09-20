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
import { getBotIkebukuroRealRooms, BOT_IKEBUKURO_STUDIO } from './bot-ikebukuro-converter';
import { getVivoRooms, VIVO_STUDIO } from './vivo-converter';
import { getGatewayIkebukuroRealRooms, GATEWAY_IKEBUKURO_STUDIO } from './gateway-ikebukuro-converter';
import {
  getAndysRealRooms, ANDYS_STUDIO,
  getStandbyRealRooms, STANDBY_STUDIO,
  getGourdislandWestRealRooms, GOURDISLAND_WEST_STUDIO,
  getGourdislandSouthRealRooms, GOURDISLAND_SOUTH_STUDIO,
} from './shimokitazawa-studiol-converter';
import { getRinkyDinkKichijojiRooms, RINKYDINK_KICHIJOJI_STUDIO } from './rinkydink-converter';
import { getPentaKichijojiRooms, PENTA_KICHIJOJI_STUDIO } from './penta-kichijoji-converter';
import {
  getMuseumShinjukuRealRooms, MUSEUM_SHINJUKU_STUDIO,
  getHillvalleyRealRooms, HILLVALLEY_STUDIO,
  getVantageRealRooms, VANTAGE_STUDIO,
} from './shinjuku-studiol-converter';
import { getMusicManRealRooms, MUSIC_MAN_STUDIO } from './music-man-converter';
import {
  getSoundStudioDomRealRooms, SOUND_STUDIO_DOM_STUDIO,
  getPigStudioRealRooms, PIG_STUDIO_STUDIO,
  getSonicBandStudioRealRooms, SONIC_BAND_STUDIO_STUDIO,
  getKoyamaMainRealRooms, KOYAMA_MAIN_STUDIO,
  getKoyamaRRealRooms, KOYAMA_R_STUDIO,
  getMusiraRealRooms, MUSIRA_STUDIO,
} from './koenji-studiol-converter';
import { getStudioBaydKoenjiRealRooms, STUDIO_BAYD_KOENJI_STUDIO } from './studio-bayd-converter';
import {
  getStudioSunNishiFunabashiRealRooms, STUDIOSUN_NISHIFUNABASHI_STUDIO,
  getPacksFunabashiRooms, PACKS_FUNABASHI_STUDIO,
} from './funabashi-converter';
import {
  getPentaYokohamaRooms, PENTA_YOKOHAMA_STUDIO,
  getCloud9YokohamaKitaguchiRealRooms, CLOUD9_YOKOHAMA_KITAGUCHI_STUDIO,
  getYokohamaSailaRealRooms, YOKOHAMA_SAILA_STUDIO,
} from './yokohama-converter';

// 都内3大エリア（渋谷・新宿・秋葉原）計17店舗の正規スタジオマスター
export const MOCK_STUDIOS: Studio[] = [
  // 秋葉原エリア (5店舗)
  ...AKIBA_STUDIOS,
  NOAH_STUDIOS_META['akihabara'],
  NOAH_STUDIOS_META['ochanomizu'],

  // 渋谷エリア (7店舗。スタジオペンタ渋谷ムーンサイド店は2025年4月29日閉店のためデータから除外)
  GATEWAY_SHIBUYA_STUDIO,
  NOAH_STUDIOS_META['shibuya'],
  NOAH_STUDIOS_META['shibuya1'],
  NOAH_STUDIOS_META['shibuya2'],
  NOAH_STUDIOS_META['shibuya3'],
  PENTA_STUDIOS['shibuya-penta-city'],
  PENTA_STUDIOS['shibuya-penta-juke'],

  // 新宿エリア (8店舗)
  NOAH_STUDIOS_META['shinjuku'],
  NODE_SHINJUKU_STUDIO,
  PENTA_STUDIOS['shinjuku-penta-main'],
  ONGAKUKAN_SHINJUKU_STUDIO,
  MUSEUM_SHINJUKU_STUDIO,
  HILLVALLEY_STUDIO,
  VANTAGE_STUDIO,
  MUSIC_MAN_STUDIO,

  // 高田馬場エリア (5店舗)
  NOAH_STUDIOS_META['takadanobaba'],
  GATEWAY_TAKADANOBABA_STUDIO,
  ONGAKUKAN_TAKADANOBABA_STUDIO,
  BOT_TAKADANOBABA_STUDIO,
  BAZOOKA_STUDIO,

  // 池袋エリア (6店舗)
  NOAH_STUDIOS_META['ikebukuro'],
  BOT_IKEBUKURO_STUDIO,
  PENTA_STUDIOS['ikebukuro-penta-main'],
  PENTA_STUDIOS['ikebukuro-penta-hands'],
  VIVO_STUDIO,
  GATEWAY_IKEBUKURO_STUDIO,

  // 下北沢エリア (5店舗)
  NOAH_STUDIOS_META['shimokitazawa'],
  ANDYS_STUDIO,
  STANDBY_STUDIO,
  GOURDISLAND_WEST_STUDIO,
  GOURDISLAND_SOUTH_STUDIO,

  // 吉祥寺エリア (3店舗)
  NOAH_STUDIOS_META['kichijoji'],
  RINKYDINK_KICHIJOJI_STUDIO,
  PENTA_KICHIJOJI_STUDIO,

  // 高円寺エリア (7店舗)
  SOUND_STUDIO_DOM_STUDIO,
  PIG_STUDIO_STUDIO,
  SONIC_BAND_STUDIO_STUDIO,
  KOYAMA_MAIN_STUDIO,
  KOYAMA_R_STUDIO,
  MUSIRA_STUDIO,
  STUDIO_BAYD_KOENJI_STUDIO,

  // 船橋エリア (2店舗)
  STUDIOSUN_NISHIFUNABASHI_STUDIO,
  PACKS_FUNABASHI_STUDIO,

  // 横浜エリア (3店舗)
  PENTA_YOKOHAMA_STUDIO,
  CLOUD9_YOKOHAMA_KITAGUCHI_STUDIO,
  YOKOHAMA_SAILA_STUDIO,
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
  // 1. 秋葉原エリア（NOAH以外）(3店舗 / 23部屋: BOT 8室, GOODMAN 11室, 音楽館 7室)
  const akibaRooms = getAkihabaraRealRooms(dateStr);

  // 2. 渋谷ゲートウェイ (1店舗 / 12部屋)
  const gatewayRooms = getGatewayShibuyaRealRooms(dateStr);

  // 3. 新宿NODE (1店舗 / 7部屋)
  const nodeRooms = getNodeShinjukuRealRooms(dateStr);

  // 4. ノア店舗群 (渋谷4店・新宿店・秋葉原店・御茶ノ水店: 計101部屋)
  // ※NOAH秋葉原店もこちらから供給される（akihabara-real.jsonには含まれない）
  const noahRooms = getNoahAllTokyoRealRooms(dateStr);

  // 5. ペンタ店舗群 (渋谷シティ 7室, 渋谷ジューク 7室, 新宿店 19室: 計33部屋。
  //    渋谷ムーンサイド店は2025年4月29日閉店のため対象外)
  const pentaRooms = getPentaRealRooms(dateStr);

  // 6. 音楽館 新宿西口店 (1店舗 / 7部屋)
  const ongakukanShinjukuRooms = getOngakukanShinjukuRealRooms(dateStr);

  // 6b. 新宿エリア追加分 (4店舗 / スタジオミュージアム9室・ヒルバレー3室・Vantage3室・Music man10室)
  const museumShinjukuRooms = getMuseumShinjukuRealRooms(dateStr);
  const hillvalleyRooms = getHillvalleyRealRooms(dateStr);
  const vantageRooms = getVantageRealRooms(dateStr);
  const musicManRooms = getMusicManRealRooms(dateStr);

  // 7. 高田馬場エリア (4店舗 / ゲートウェイ15室・音楽館6室・BOT11室・BAZOOKA6室 ※ノアは上記noahRoomsに含む)
  const gatewayBabaRooms = getGatewayTakadanobabaRealRooms(dateStr);
  const ongakukanBabaRooms = getOngakukanTakadanobabaRealRooms(dateStr);
  const botBabaRooms = getBotTakadanobabaRealRooms(dateStr);
  const bazookaRooms = getBazookaRooms();

  // 8. 池袋エリア (6店舗 / ノアは上記noahRoomsに、ペンタ2店舗は上記pentaRoomsに含む。
  //    BOT池袋西口店・Vivo Sound Studio・ゲートウェイ池袋北口店のみ個別に追加する)
  const botIkebukuroRooms = getBotIkebukuroRealRooms(dateStr);
  const vivoRooms = getVivoRooms();
  const gatewayIkebukuroRooms = getGatewayIkebukuroRealRooms(dateStr);

  // 9. 下北沢エリア (5店舗 / ノアは上記noahRoomsに含む。ANDY'S・STANDBY・
  //    ガードアイランド下北沢ウエスト/南口の4店舗を個別に追加する)
  const andysRooms = getAndysRealRooms(dateStr);
  const standbyRooms = getStandbyRealRooms(dateStr);
  const gourdislandWestRooms = getGourdislandWestRealRooms(dateStr);
  const gourdislandSouthRooms = getGourdislandSouthRealRooms(dateStr);

  // 10. 吉祥寺エリア (2店舗 / リンキィディンクORES 7室・ペンタ吉祥寺店 14室。
  //     ノアは上記noahRoomsに含む。両店ともゲスト閲覧不可/電話予約のため静的リスティング)
  const rinkyDinkKichijojiRooms = getRinkyDinkKichijojiRooms();
  const pentaKichijojiRooms = getPentaKichijojiRooms();

  // 11. 高円寺エリア (7店舗 / DOM3室・P.I.G.5室・SONIC BAND3室・コヤーマ本店5室・
  //     コヤーマR店6室・MUSIRA3室・STUDIO BAYD5室)
  const soundStudioDomRooms = getSoundStudioDomRealRooms(dateStr);
  const pigStudioRooms = getPigStudioRealRooms(dateStr);
  const sonicBandStudioRooms = getSonicBandStudioRealRooms(dateStr);
  const koyamaMainRooms = getKoyamaMainRealRooms(dateStr);
  const koyamaRRooms = getKoyamaRRealRooms(dateStr);
  const musiraRooms = getMusiraRealRooms(dateStr);
  const studioBaydKoenjiRooms = getStudioBaydKoenjiRealRooms(dateStr);

  // 12. 船橋エリア (2店舗 / STUDIO SUN西船橋店7室・スタジオパックス船橋店10室)
  const studioSunNishiFunabashiRooms = getStudioSunNishiFunabashiRealRooms(dateStr);
  const packsFunabashiRooms = getPacksFunabashiRooms();

  // 13. 横浜エリア (3店舗 / スタジオペンタ横浜店6室・クラウドナイン横浜北口店11室・
  //     ヨコハマ・セーラスタジオ4室)
  const pentaYokohamaRooms = getPentaYokohamaRooms();
  const cloud9YokohamaKitaguchiRooms = getCloud9YokohamaKitaguchiRealRooms(dateStr);
  const yokohamaSailaRooms = getYokohamaSailaRealRooms(dateStr);

  return [
    ...akibaRooms, ...gatewayRooms, ...nodeRooms, ...noahRooms, ...pentaRooms, ...ongakukanShinjukuRooms,
    ...museumShinjukuRooms, ...hillvalleyRooms, ...vantageRooms, ...musicManRooms,
    ...gatewayBabaRooms, ...ongakukanBabaRooms, ...botBabaRooms, ...bazookaRooms,
    ...botIkebukuroRooms, ...vivoRooms, ...gatewayIkebukuroRooms,
    ...andysRooms, ...standbyRooms, ...gourdislandWestRooms, ...gourdislandSouthRooms,
    ...rinkyDinkKichijojiRooms, ...pentaKichijojiRooms,
    ...soundStudioDomRooms, ...pigStudioRooms, ...sonicBandStudioRooms,
    ...koyamaMainRooms, ...koyamaRRooms, ...musiraRooms, ...studioBaydKoenjiRooms,
    ...studioSunNishiFunabashiRooms, ...packsFunabashiRooms,
    ...pentaYokohamaRooms, ...cloud9YokohamaKitaguchiRooms, ...yokohamaSailaRooms,
  ];
}
