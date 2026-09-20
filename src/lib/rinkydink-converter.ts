/**
 * リンキィディンク 吉祥寺スタジオORES (旧RDS吉祥寺2nd)。
 * 予約はReserve1.jp（Gateway/GOODMAN AKIBAと同じASP基盤）を使用しているが、
 * 他店舗と異なりゲスト（会員登録なし）では空き状況カレンダーを閲覧できず、
 * 会員番号/パスワードでのログインが必須（
 * https://www.reserve1.jp/studio/visitor/VisitorLogin.php?lc=olcatdves&mn=1&gr=12&stt=MLRRX
 * にアクセスすると<form name="form1">の会員ログインフォームが返る＝Gateway/GOODMANの
 * ゲスト直通<form name="form0">とは異なる構成）。会員アカウントを新規作成してまで
 * クローリングすることはしない方針のため、Vivo Sound Studio・BAZOOKA STUDIOと同じ
 * 静的リスティング（部屋情報・機材は公式サイト実データ、予約はリンク経由に誘導）とする。
 */
import { Studio, RoomWithSlots, RoomEquipment } from '@/types/studio';

export const RINKYDINK_KICHIJOJI_STUDIO: Studio = {
  id: 'rinkydink-kichijoji-ores',
  name: 'リンキィディンク 吉祥寺スタジオORES',
  chainName: 'Rinky Dink Studio',
  area: '吉祥寺',
  prefecture: '東京都',
  nearestStation: 'JR中央線・京王井の頭線 吉祥寺駅 北口 徒歩2分',
  address: '東京都武蔵野市吉祥寺本町1-7-8 第一マーブルビル3F',
  tel: '0422-20-2355',
  bookingUrl: 'https://www.reserve1.jp/studio/visitor/VisitorLogin.php?lc=olcatdves&mn=1&gr=12&stt=MLRRX',
  websiteUrl: 'https://rinky.info/studio/ores/',
  businessHoursSummary: '通常営業 平日10:00〜23:00・土日祝9:00〜23:00（深夜早朝はセルフサービス型で実質24時間対応）',
  is24Hours: false,
  groupBookingRule: 'オンライン予約（要事前会員登録）または電話にて受付',
  groupBookingLeadMonths: 2,
  soloBookingRule: '前日より電話/オンラインにて受付開始（2名まで・部屋指定不可）',
  soloBookingLeadHours: 24,
};

interface RinkyDinkRoomDef {
  id: string;
  name: string;
  tatami: number;
  priceRegular: number;
  priceDaytime: number;
  guitarAmps: string[];
  bassAmp: string;
  drumSet: string;
  keyboards: string[];
  paSystem: string;
  note?: string;
}

const RINKYDINK_ROOM_DEFS: RinkyDinkRoomDef[] = [
  {
    id: 'rinkydink-ores-1st',
    name: '1st (14帖)',
    tatami: 14,
    priceRegular: 2800,
    priceDaytime: 2000,
    guitarAmps: ['Marshall JCM2000', 'Roland JC-120', 'Fender Twin Reverb'],
    bassAmp: 'Ampeg SVT450H / BULLITT B412',
    drumSet: 'TAMA Starclassic Birch (22"16"13"12") Snare: TAMA NSS1455 (14"x5.5")',
    keyboards: ['YAMAHA P-85 88鍵エレピ'],
    paSystem: 'MACKIE ProFX16v3 / QSC GX5 / YAMAHA CZR12 / Dynacord AM12',
  },
  {
    id: 'rinkydink-ores-sst',
    name: 'Sst (20帖)',
    tatami: 20,
    priceRegular: 3300,
    priceDaytime: 2700,
    guitarAmps: ['Marshall JCM2000', 'Marshall JCM900', 'Roland JC-120', 'Fender Twin Reverb'],
    bassAmp: 'Ampeg PF500 / Aguilar GS412',
    drumSet: 'TAMA Star Classic Birch (22"16"13"12") Snare: PEARL CS1450 (14"x5")',
    keyboards: ['Roland RD88EX'],
    paSystem: 'MACKIE ProFX16v3 / YAMAHA PX8 / YAMAHA CZR12 / YAMAHA CHR12×2',
    note: 'ビッグバンド対応スタジオ。',
  },
  {
    id: 'rinkydink-ores-3st',
    name: '3st (13帖)',
    tatami: 13,
    priceRegular: 2700,
    priceDaytime: 1800,
    guitarAmps: ['Marshall JCM2000', 'Roland JC-120', 'Fender Twin Amp'],
    bassAmp: 'MARKBASS LITTLE MARK IV / BULLITT B412',
    drumSet: 'TAMA Starclassic Birch (22"16"13"12") Snare: TAMA RockStar (14"x6.5")',
    keyboards: ['YAMAHA P-45 88鍵エレピ'],
    paSystem: 'MACKIE ProFX16v3 / QSC GX5 / Dynacord MX12 / Dynacord AM12',
  },
  {
    id: 'rinkydink-ores-4st',
    name: '4st (16帖)',
    tatami: 16,
    priceRegular: 3000,
    priceDaytime: 2400,
    guitarAmps: ['Marshall JCM2000', 'Roland JC-120', 'Fender Twin Reverb'],
    bassAmp: 'AMPEG PF500 / Aguilar GS412',
    drumSet: 'TAMA Starclassic Birch (22"16"13"12") Snare: TAMA NSS1455 (14"x5.5")',
    keyboards: ['YAMAHA P145 88鍵エレピ'],
    paSystem: 'MACKIE ProFX16v3 / YAMAHA PX8 / YAMAHA CZR12 / Dynacord AM12×2',
  },
  {
    id: 'rinkydink-ores-5st',
    name: '5st (13帖)',
    tatami: 13,
    priceRegular: 2700,
    priceDaytime: 1800,
    guitarAmps: ['Marshall JCM2000', 'Roland JC-120', 'Fender Twin Amp'],
    bassAmp: 'Ampeg PF500 / Aguilar GS412',
    drumSet: 'TAMA Starclassic Birch (22"16"13"12") Snare: TAMA NSS1455 (14"x5.5")',
    keyboards: ['YAMAHA P-45 88鍵エレピ'],
    paSystem: 'MACKIE ProFX16v2 / QSC GX5 / Dynacord MX12 / Dynacord AM12',
  },
  {
    id: 'rinkydink-ores-6st',
    name: '6st (20帖)',
    tatami: 20,
    priceRegular: 3300,
    priceDaytime: 2700,
    guitarAmps: ['Marshall JCM2000', 'Marshall JCM900', 'Roland JC-120', 'Fender Twin Reverb'],
    bassAmp: 'AMPEG PF-500 / BULLITT B412',
    drumSet: 'TAMA Starclassic Bubinga (22"16"13"12") Snare: TAMA Starclassic Bubinga (14"x5.5")',
    keyboards: ['Roland RD2000'],
    paSystem: 'MACKIE ProFX16v3 / YAMAHA PX8 / YAMAHA CZR12 / YAMAHA CHR12×2',
    note: 'ビッグバンド対応スタジオ。',
  },
  {
    id: 'rinkydink-ores-7st',
    name: '7st (14帖)',
    tatami: 14,
    priceRegular: 2800,
    priceDaytime: 2000,
    guitarAmps: ['Marshall JCM2000', 'Roland JC-120', 'Fender Twin Reverb'],
    bassAmp: 'AMPEG SVT450H / Aguilar GS412',
    drumSet: 'TAMA Starclassic Birch (22"16"13"12") Snare: TAMA NSS1455 (14"x5.5")',
    keyboards: ['YAMAHA P-95 88鍵エレピ'],
    paSystem: 'MACKIE ProFX16v3 / QSC GX5 / YAMAHA CZR12 / Dynacord AM12',
  },
];

/**
 * 会員ログインが必須でゲスト閲覧不可のため、他店舗のようなリアルタイム空き状況
 * クロールは行わず、部屋情報のみを静的に掲載する（slotsは常に空配列）。
 * 予約はbookingUrl（Reserve1.jpログイン画面）経由で案内する。
 */
export function getRinkyDinkKichijojiRooms(): RoomWithSlots[] {
  let order = 970;
  return RINKYDINK_ROOM_DEFS.map((def) => {
    const equipment: RoomEquipment = {
      id: `eq-${def.id}`,
      roomId: def.id,
      guitarAmps: def.guitarAmps,
      bassAmp: def.bassAmp,
      drumSet: def.drumSet,
      isTwinPedalAllowed: true,
      paSystem: def.paSystem,
      keyboards: def.keyboards,
      additionalNotes: `${def.note || ''}予約はオンライン（要事前会員登録）または電話にて。ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトからご確認ください。`,
    };

    return {
      id: def.id,
      studioId: RINKYDINK_KICHIJOJI_STUDIO.id,
      name: def.name,
      sizeTatami: def.tatami,
      capacity: Math.max(3, Math.round(def.tatami / 2.2)),
      pricePerHourRegular: def.priceRegular,
      pricePerHourDaytime: def.priceDaytime,
      pricePerHourSolo: 740,
      hasMirror: true,
      hasRecording: false,
      startTimeOffset: 0,
      orderIndex: order++,
      studio: RINKYDINK_KICHIJOJI_STUDIO,
      equipment,
      slots: [],
    };
  });
}
