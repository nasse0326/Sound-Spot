/**
 * スタジオペンタ 吉祥寺店（旧ノースサイド/MUSASHI/サウスサイドが統合された模様の
 * 3F-4F-5F・全14スタジオの単一店舗。公式サイトの「MEDIUM 303-505st (12帖)」
 * 「LARGE 301&302st (15帖)」という表記から、301・302がLARGE、303,304,401-405,
 * 501-505の12室がMEDIUMと推定（2+12=14で全体数と一致）。公式サイト自身が
 * 「機材は各部屋ごとに異なります。ご予約時にお問い合わせください」と明記しており
 * 部屋ごとの厳密な機材内訳は非公開のため、サイズ区分ごとの代表機材として掲載する。
 * 他のペンタ店舗と同様、予約は電話・LINE・店頭のみでリアルタイム空き状況は非対応。
 */
import { Studio, RoomWithSlots, RoomEquipment } from '@/types/studio';

export const PENTA_KICHIJOJI_STUDIO: Studio = {
  id: 'penta-kichijoji',
  name: 'スタジオペンタ 吉祥寺店',
  chainName: 'STUDIO PENTA',
  area: '吉祥寺',
  prefecture: '東京都',
  nearestStation: 'JR中央線・京王井の頭線 吉祥寺駅 公園口 徒歩30秒',
  address: '東京都武蔵野市吉祥寺南町1-1-4',
  tel: '0422-42-0765',
  bookingUrl: 'https://studiopenta.jp/rehearsal/south/',
  websiteUrl: 'https://studiopenta.jp/rehearsal/south/',
  businessHoursSummary: '24時間営業（予約なし時間帯はメンテナンスのためクローズの場合あり）',
  is24Hours: true,
  groupBookingRule: '電話・LINE・店頭にて受付（オンライン予約非対応）',
  groupBookingLeadMonths: 2,
  soloBookingRule: '前日22:00より電話にて受付開始（平日は1週間前から予約可・スタジオ指定不可）',
  soloBookingLeadHours: 26,
};

interface PentaKichijojiRoomDef {
  id: string;
  name: string;
  tatami: number;
  size: 'large' | 'medium';
}

// 301,302=LARGE(15帖)。303,304,401-405,501-505=MEDIUM(12帖)。501-505st以外は00分スタート。
const PENTA_KICHIJOJI_ROOM_DEFS: PentaKichijojiRoomDef[] = [
  { id: 'penta-kichijoji-301', name: '301st (15帖)', tatami: 15, size: 'large' },
  { id: 'penta-kichijoji-302', name: '302st (15帖)', tatami: 15, size: 'large' },
  { id: 'penta-kichijoji-303', name: '303st (12帖)', tatami: 12, size: 'medium' },
  { id: 'penta-kichijoji-304', name: '304st (12帖)', tatami: 12, size: 'medium' },
  { id: 'penta-kichijoji-401', name: '401st (12帖)', tatami: 12, size: 'medium' },
  { id: 'penta-kichijoji-402', name: '402st (12帖)', tatami: 12, size: 'medium' },
  { id: 'penta-kichijoji-403', name: '403st (12帖)', tatami: 12, size: 'medium' },
  { id: 'penta-kichijoji-404', name: '404st (12帖)', tatami: 12, size: 'medium' },
  { id: 'penta-kichijoji-405', name: '405st (12帖)', tatami: 12, size: 'medium' },
  { id: 'penta-kichijoji-501', name: '501st (12帖・30分スタート)', tatami: 12, size: 'medium' },
  { id: 'penta-kichijoji-502', name: '502st (12帖・30分スタート)', tatami: 12, size: 'medium' },
  { id: 'penta-kichijoji-503', name: '503st (12帖・30分スタート)', tatami: 12, size: 'medium' },
  { id: 'penta-kichijoji-504', name: '504st (12帖・30分スタート)', tatami: 12, size: 'medium' },
  { id: 'penta-kichijoji-505', name: '505st (12帖・30分スタート)', tatami: 12, size: 'medium' },
];

const LARGE_EQUIPMENT = {
  guitarAmps: ['Marshall JVM210H + 1960A', 'Roland JC-120', 'Fender Twin Reverb'],
  bassAmp: 'Ampeg SVT-3PRO / Ampeg SVT-450 / Ampeg SVT-810',
  drumSet: 'Pearl REFERENCE / Pearl MRP',
  paSystem: 'YAMAHA EMX 5016 / YAMAHA SM12 / BOSE 802-III',
};

const MEDIUM_EQUIPMENT = {
  guitarAmps: ['Marshall JVM210H + 1960A', 'Roland JC-120'],
  bassAmp: 'Ampeg SVT-3PRO / Ampeg B-2RE / Ampeg SVT-610（一部Aguilar TONE HAMMER 500）',
  drumSet: 'Pearl REFERENCE / Pearl CARBONPLY MAPLE / Pearl MRP / Pearl MX 他',
  paSystem: 'YAMAHA EMX 5016 / YAMAHA YMG8/2FX / YAMAHA MG10XU / YAMAHA DXR10 / BOSE 802-III / DYNACORD MX12 / DYNACORD AX12',
};

/**
 * 電話・LINE・店頭予約のみでゲスト閲覧不可のため、リアルタイム空き状況クロールは
 * 行わず、部屋情報のみを静的に掲載する（slotsは常に空配列）。
 */
export function getPentaKichijojiRooms(): RoomWithSlots[] {
  let order = 990;
  return PENTA_KICHIJOJI_ROOM_DEFS.map((def) => {
    const eqSpec = def.size === 'large' ? LARGE_EQUIPMENT : MEDIUM_EQUIPMENT;
    const equipment: RoomEquipment = {
      id: `eq-${def.id}`,
      roomId: def.id,
      guitarAmps: eqSpec.guitarAmps,
      bassAmp: eqSpec.bassAmp,
      drumSet: eqSpec.drumSet,
      isTwinPedalAllowed: true,
      paSystem: eqSpec.paSystem,
      additionalNotes: '公式サイトによると機材は部屋ごとに異なるため、正確な常設機材はご予約時にお問い合わせください。予約は電話・LINE・店頭のみ（ゲスト閲覧不可のためリアルタイム空き状況は非対応）。',
    };

    return {
      id: def.id,
      studioId: PENTA_KICHIJOJI_STUDIO.id,
      name: def.name,
      sizeTatami: def.tatami,
      capacity: Math.max(3, Math.round(def.tatami / 2.2)),
      pricePerHourRegular: def.size === 'large' ? 3135 : 2695,
      pricePerHourDaytime: def.size === 'large' ? 2178 : 1738,
      pricePerHourSolo: 880,
      hasMirror: true,
      hasRecording: false,
      startTimeOffset: def.id.startsWith('penta-kichijoji-5') ? 30 : 0,
      orderIndex: order++,
      studio: PENTA_KICHIJOJI_STUDIO,
      equipment,
      slots: [],
    };
  });
}
