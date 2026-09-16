/**
 * Vivo Sound Studio 池袋 (電話/LINE予約のみ・ゲスト閲覧不可のため自動クローリング非対応。
 * 部屋情報・機材は公式サイトの実データを掲載し、予約はWeb予約ページへのリンク経由に誘導する
 * 静的リスティングとする。BAZOOKA STUDIOと同じ扱い。)
 */
import { Studio, RoomWithSlots, RoomEquipment } from '@/types/studio';

export const VIVO_STUDIO: Studio = {
  id: 'vivo-ikebukuro',
  name: 'Vivo Sound Studio',
  chainName: 'Vivo Sound Studio',
  area: '池袋',
  prefecture: '東京都',
  nearestStation: '池袋駅 西口 徒歩2分',
  address: '東京都豊島区池袋2-47-3 キウレイコンビルB1',
  tel: '03-5391-3411',
  bookingUrl: 'https://vivo-studio.jp/',
  websiteUrl: 'https://vivo-studio.jp/',
  businessHoursSummary: '平日12:00〜24:00 / 土日祝10:00〜24:00 (電話・LINE予約のみ)',
  is24Hours: false,
  groupBookingRule: '電話・LINE・メールフォームにて受付（オンライン予約は要会員登録・非対応）',
  groupBookingLeadMonths: 2,
  soloBookingRule: '電話・LINEにて随時受付',
  soloBookingLeadHours: 24,
};

interface VivoRoomDef {
  id: string;
  name: string;
  tatami: number;
  priceRegular: number;
  priceDaytime: number;
  drumSet: string;
  hasGrandPiano: boolean;
  hasUprightPiano: boolean;
}

const VIVO_ROOM_DEFS: VivoRoomDef[] = [
  { id: 'vivo-rst', name: 'Rst (15帖)', tatami: 15, priceRegular: 3050, priceDaytime: 2350, drumSet: 'Gretsch Drums (コーテッドヘッド標準装備)', hasGrandPiano: true, hasUprightPiano: false },
  { id: 'vivo-ast', name: 'Ast (10帖)', tatami: 10, priceRegular: 2650, priceDaytime: 1950, drumSet: 'スタンダードドラムセット', hasGrandPiano: false, hasUprightPiano: false },
  { id: 'vivo-bst', name: 'Bst (10帖)', tatami: 10, priceRegular: 2650, priceDaytime: 1950, drumSet: "Drummer's Base New Custom Jazz Set", hasGrandPiano: false, hasUprightPiano: true },
  { id: 'vivo-cst', name: 'Cst (13帖)', tatami: 13, priceRegular: 2850, priceDaytime: 2150, drumSet: 'スタンダードドラムセット', hasGrandPiano: false, hasUprightPiano: false },
];

/**
 * Vivo Sound STUDIOはWeb予約に事前会員登録が必須（ゲスト閲覧不可）のため、
 * 他店舗のようなリアルタイム空き状況クロールは行わず、部屋情報のみを
 * 静的に掲載する（slotsは常に空配列）。予約はbookingUrl経由で案内する。
 */
export function getVivoRooms(): RoomWithSlots[] {
  let order = 950;
  return VIVO_ROOM_DEFS.map((def) => {
    const equipment: RoomEquipment = {
      id: `eq-${def.id}`,
      roomId: def.id,
      guitarAmps: ['YAMAHA THR100HD + THRC212'],
      bassAmp: 'EDEN Bass Amp',
      drumSet: def.drumSet,
      isTwinPedalAllowed: true,
      additionalNotes: `${def.hasGrandPiano ? 'グランドピアノ常設。' : ''}${def.hasUprightPiano ? 'アップライトピアノ常設。' : ''}ウッドベース・コントラバスのレンタルやオーディオインターフェースの用意あり。予約はお電話・LINE・メールフォームにて（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから空き状況をご確認ください）。`,
    };

    return {
      id: def.id,
      studioId: VIVO_STUDIO.id,
      name: def.name,
      sizeTatami: def.tatami,
      capacity: Math.max(3, Math.round(def.tatami / 2.5)),
      pricePerHourRegular: def.priceRegular,
      pricePerHourDaytime: def.priceDaytime,
      pricePerHourSolo: 660,
      hasMirror: true,
      hasRecording: false,
      startTimeOffset: 0,
      orderIndex: order++,
      studio: VIVO_STUDIO,
      equipment,
      slots: [],
    };
  });
}
