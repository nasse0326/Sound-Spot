/**
 * BAZOOKA STUDIO 高田馬場 (reserve1.jp/ReserveMart系だが会員登録者のみ空き状況閲覧可能なため、
 * 自動クローリング非対応。部屋情報・機材は公式サイトの実データを掲載し、予約はWeb予約ページへの
 * リンク経由に誘導する静的リスティングとする。)
 */
import { Studio, RoomWithSlots, RoomEquipment } from '@/types/studio';

export const BAZOOKA_STUDIO: Studio = {
  id: 'bazooka-takadanobaba',
  name: 'BAZOOKA STUDIO',
  chainName: 'BAZOOKA STUDIO',
  area: '高田馬場',
  prefecture: '東京都',
  nearestStation: '高田馬場駅 徒歩2分',
  address: '東京都新宿区高田馬場3-3-3 三優ビルB1F',
  tel: '03-3360-3377',
  bookingUrl: 'https://bazookastudio.com/rehearsal/onlinereservation',
  websiteUrl: 'https://bazookastudio.com/',
  businessHoursSummary: '要問い合わせ（深夜リハーサルは電話予約）',
  is24Hours: false,
  groupBookingRule: '4ヶ月先まで予約可能（Web予約は事前会員登録制）',
  groupBookingLeadMonths: 4,
  soloBookingRule: '前日10:00よりWeb/電話にて受付開始',
  soloBookingLeadHours: 24,
};

interface BazookaRoomDef {
  id: string;
  name: string;
  drumSet: string;
  bassAmpCab: string;
  hourlyDaytime: number;
  hourlyNight: number;
}

const BAZOOKA_ROOM_DEFS: BazookaRoomDef[] = [
  { id: 'bazooka-1st', name: '1st', drumSet: 'NATAL Maple', bassAmpCab: 'SVT810E', hourlyDaytime: 2200, hourlyNight: 3300 },
  { id: 'bazooka-2st', name: '2st', drumSet: 'NATAL Birch', bassAmpCab: 'SVT810E', hourlyDaytime: 2200, hourlyNight: 3300 },
  { id: 'bazooka-3st', name: '3st', drumSet: 'NATAL Ash', bassAmpCab: 'SVT810AV', hourlyDaytime: 2200, hourlyNight: 3300 },
  { id: 'bazooka-4st', name: '4st', drumSet: 'NATAL Birch', bassAmpCab: 'SVT810AV', hourlyDaytime: 2200, hourlyNight: 3300 },
  { id: 'bazooka-6st', name: '6st', drumSet: 'CANOPUS Birch', bassAmpCab: 'SVT810E', hourlyDaytime: 1980, hourlyNight: 3080 },
  { id: 'bazooka-7st', name: '7st', drumSet: 'NATAL Maple', bassAmpCab: 'SVT810E', hourlyDaytime: 1980, hourlyNight: 3080 },
];

/**
 * BAZOOKA STUDIOはWeb予約に事前会員登録が必須（ゲスト閲覧不可）のため、
 * 他店舗のようなリアルタイム空き状況クロールは行わず、部屋情報のみを
 * 静的に掲載する（slotsは常に空配列）。予約はbookingUrl経由で案内する。
 */
export function getBazookaRooms(): RoomWithSlots[] {
  let order = 900;
  return BAZOOKA_ROOM_DEFS.map((def) => {
    const equipment: RoomEquipment = {
      id: `eq-${def.id}`,
      roomId: def.id,
      guitarAmps: ['Marshall JVM410H+1960A', 'Roland JC-120'],
      bassAmp: `Ampeg SVT-3pro + ${def.bassAmpCab}`,
      drumSet: def.drumSet,
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA DM3 + YAMAHA C-112V/PX8',
      additionalNotes: `${def.drumSet}ドラムセット常設。シンバルはPAISTE PST7 Heavy各種。Web予約は要事前会員登録（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから予約状況をご確認ください）。`,
    };

    return {
      id: def.id,
      studioId: BAZOOKA_STUDIO.id,
      name: def.name,
      sizeTatami: 10,
      capacity: 5,
      pricePerHourRegular: def.hourlyNight,
      pricePerHourDaytime: def.hourlyDaytime,
      pricePerHourSolo: 660,
      hasMirror: true,
      hasRecording: false,
      startTimeOffset: 0,
      orderIndex: order++,
      studio: BAZOOKA_STUDIO,
      equipment,
      slots: [],
    };
  });
}
