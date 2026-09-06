import { Studio, Room, RoomEquipment, AvailabilitySlot, RoomWithSlots } from '@/types/studio';
import { format, addDays } from 'date-fns';
import { getNoahShibuya2RealRooms } from './noah-converter';
import { getAkihabaraRealRooms, AKIBA_STUDIOS } from './akiba-converter';
import { GATEWAY_SHIBUYA_STUDIO, getGatewayShibuyaRealRooms } from './gateway-converter';

export const MOCK_STUDIOS: Studio[] = [
  ...AKIBA_STUDIOS,
  GATEWAY_SHIBUYA_STUDIO,
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'SOUND STUDIO NOAH 渋谷2号店',
    chainName: 'SOUND STUDIO NOAH',
    area: '渋谷',
    prefecture: '東京都',
    nearestStation: '渋谷駅 ハチ公口 徒歩5分',
    address: '東京都渋谷区宇田川町39-2 B1F',
    tel: '03-3780-5766',
    bookingUrl: 'https://www.studionoah.jp/shibuya2/',
    websiteUrl: 'https://www.studionoah.jp/shibuya2/',
    businessHoursSummary: '24時間営業 (朝6時〜モーニング枠あり)',
    is24Hours: true,
    groupBookingRule: '3ヶ月前の1日よりWEB予約可能',
    groupBookingLeadMonths: 3,
    soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
    soloBookingLeadHours: 27,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    name: 'STUDIO PENTA 新宿店',
    chainName: 'STUDIO PENTA',
    area: '新宿',
    prefecture: '東京都',
    nearestStation: '新宿駅 東口 徒歩3分 / 新宿三丁目駅 徒歩2分',
    address: '東京都新宿区新宿3-11-6 エビスビルB1F',
    tel: '03-3351-3140',
    bookingUrl: 'https://studiopenta.jp/rehearsal/shinjuku/',
    websiteUrl: 'https://studiopenta.jp/rehearsal/shinjuku/',
    businessHoursSummary: '10:00〜24:00 (電話受付のみ)',
    is24Hours: false,
    groupBookingRule: '2ヶ月前より電話にて受付（オンライン予約非対応）',
    groupBookingLeadMonths: 2,
    soloBookingRule: '前日営業開始（10:00）より電話にて受付開始',
    soloBookingLeadHours: 38,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    name: 'SOUND STUDIO NOAH 吉祥寺店',
    chainName: 'SOUND STUDIO NOAH',
    area: '吉祥寺',
    prefecture: '東京都',
    nearestStation: '吉祥寺駅 北口 徒歩4分',
    address: '東京都武蔵野市吉祥寺本町2-5-10 B1F',
    tel: '0422-23-1774',
    bookingUrl: 'https://www.studionoah.jp/kichijoji/',
    websiteUrl: 'https://www.studionoah.jp/kichijoji/',
    businessHoursSummary: '24時間営業 (朝6時〜モーニング枠あり)',
    is24Hours: true,
    groupBookingRule: '3ヶ月前の1日よりWEB予約可能',
    groupBookingLeadMonths: 3,
    soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
    soloBookingLeadHours: 27,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    name: 'STUDIO PENTA 千葉駅前店',
    chainName: 'STUDIO PENTA',
    area: '千葉',
    prefecture: '千葉県',
    nearestStation: 'JR千葉駅 東口 徒歩4分 / 京成千葉駅 徒歩3分',
    address: '千葉県千葉市中央区富士見2-8-14 エスカイヤ登戸ビル3F',
    tel: '043-224-6014',
    bookingUrl: 'https://studiopenta.jp/rehearsal/chibaekimae/',
    websiteUrl: 'https://studiopenta.jp/rehearsal/chibaekimae/',
    businessHoursSummary: '10:00〜24:00 (電話受付のみ)',
    is24Hours: false,
    groupBookingRule: '2ヶ月前より電話にて受付（オンライン予約非対応）',
    groupBookingLeadMonths: 2,
    soloBookingRule: '前日営業開始より電話にて受付開始',
    soloBookingLeadHours: 38,
  },
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    name: 'スタジオ音楽館 柏店',
    chainName: 'スタジオ音楽館',
    area: '柏',
    prefecture: '千葉県',
    nearestStation: 'JR柏駅 東口 徒歩4分',
    address: '千葉県柏市柏2-5-9 岡田屋ビル2F',
    tel: '04-7164-3200',
    bookingUrl: 'https://www.studiocan.co.jp/kashiwa/',
    websiteUrl: 'https://www.studiocan.co.jp/kashiwa/',
    businessHoursSummary: '10:00〜24:00',
    is24Hours: false,
    groupBookingRule: '2ヶ月前の同日より予約受付',
    groupBookingLeadMonths: 2,
    soloBookingRule: '前日および当日電話受付のみ',
    soloBookingLeadHours: 24,
  },
];

export const MOCK_ROOMS: Room[] = [
  // 渋谷ノア
  {
    id: 'b0000000-0000-0000-0000-000000000011',
    studioId: 'a0000000-0000-0000-0000-000000000001',
    name: 'Gst (15帖)',
    floor: 'B1F',
    sizeTatami: 15.0,
    capacity: 6,
    pricePerHourRegular: 3520,
    pricePerHourDaytime: 2420,
    pricePerHourSolo: 990,
    hasMirror: true,
    hasRecording: true,
    startTimeOffset: 0,
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000012',
    studioId: 'a0000000-0000-0000-0000-000000000001',
    name: 'Est (12帖)',
    floor: 'B1F',
    sizeTatami: 12.0,
    capacity: 5,
    pricePerHourRegular: 2970,
    pricePerHourDaytime: 1980,
    pricePerHourSolo: 880,
    hasMirror: true,
    hasRecording: false,
    startTimeOffset: 30,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000013',
    studioId: 'a0000000-0000-0000-0000-000000000001',
    name: 'Booth (6帖・個人練習専用)',
    floor: 'B1F',
    sizeTatami: 6.0,
    capacity: 2,
    pricePerHourRegular: 1650,
    pricePerHourDaytime: 1320,
    pricePerHourSolo: 770,
    hasMirror: true,
    hasRecording: true,
    startTimeOffset: 0,
    imageUrl: 'https://images.unsplash.com/photo-1520523839898-507127053e14?w=600&auto=format&fit=crop',
  },

  // 新宿ペンタ（公式HP準拠スペック・電話予約専用）
  {
    id: 'b0000000-0000-0000-0000-000000000021',
    studioId: 'a0000000-0000-0000-0000-000000000002',
    name: 'LARGE (16帖 / 101〜103, 504st)',
    floor: 'B1F',
    sizeTatami: 16.0,
    capacity: 6,
    pricePerHourRegular: 3410,
    pricePerHourDaytime: 2530,
    pricePerHourSolo: 880,
    hasMirror: true,
    hasRecording: true,
    startTimeOffset: 0,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000022',
    studioId: 'a0000000-0000-0000-0000-000000000002',
    name: 'MEDIUM (14帖 / 201〜503st)',
    floor: 'B1F',
    sizeTatami: 14.0,
    capacity: 5,
    pricePerHourRegular: 3190,
    pricePerHourDaytime: 2200,
    pricePerHourSolo: 880,
    hasMirror: true,
    hasRecording: false,
    startTimeOffset: 0,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop',
  },

  // 吉祥寺ノア
  {
    id: 'b0000000-0000-0000-0000-000000000031',
    studioId: 'a0000000-0000-0000-0000-000000000003',
    name: 'CSst (18帖・大型セルフレコ)',
    floor: 'B1F',
    sizeTatami: 18.0,
    capacity: 7,
    pricePerHourRegular: 4180,
    pricePerHourDaytime: 2860,
    pricePerHourSolo: 1100,
    hasMirror: true,
    hasRecording: true,
    startTimeOffset: 0,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000032',
    studioId: 'a0000000-0000-0000-0000-000000000003',
    name: 'Ast (14帖)',
    floor: 'B1F',
    sizeTatami: 14.0,
    capacity: 5,
    pricePerHourRegular: 3300,
    pricePerHourDaytime: 2200,
    pricePerHourSolo: 900,
    hasMirror: true,
    hasRecording: false,
    startTimeOffset: 30,
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop',
  },

  // 千葉ペンタ
  {
    id: 'b0000000-0000-0000-0000-000000000041',
    studioId: 'a0000000-0000-0000-0000-000000000004',
    name: 'Ast (15帖)',
    floor: '3F',
    sizeTatami: 15.0,
    capacity: 6,
    pricePerHourRegular: 3300,
    pricePerHourDaytime: 2000,
    pricePerHourSolo: 800,
    hasMirror: true,
    hasRecording: false,
    startTimeOffset: 0,
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000042',
    studioId: 'a0000000-0000-0000-0000-000000000004',
    name: 'Bst (11帖)',
    floor: '3F',
    sizeTatami: 11.0,
    capacity: 4,
    pricePerHourRegular: 2800,
    pricePerHourDaytime: 1700,
    pricePerHourSolo: 750,
    hasMirror: true,
    hasRecording: false,
    startTimeOffset: 30,
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop',
  },

  // 柏音楽館
  {
    id: 'b0000000-0000-0000-0000-000000000051',
    studioId: 'a0000000-0000-0000-0000-000000000005',
    name: 'Aスタジオ (14帖)',
    floor: '2F',
    sizeTatami: 14.0,
    capacity: 5,
    pricePerHourRegular: 2900,
    pricePerHourDaytime: 1800,
    pricePerHourSolo: 700,
    hasMirror: true,
    hasRecording: false,
    startTimeOffset: 0,
    imageUrl: 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?w=600&auto=format&fit=crop',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000052',
    studioId: 'a0000000-0000-0000-0000-000000000005',
    name: 'Bスタジオ (10帖)',
    floor: '2F',
    sizeTatami: 10.0,
    capacity: 4,
    pricePerHourRegular: 2500,
    pricePerHourDaytime: 1500,
    pricePerHourSolo: 650,
    hasMirror: true,
    hasRecording: false,
    startTimeOffset: 30,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop',
  },
];

export const MOCK_EQUIPMENTS: Record<string, RoomEquipment> = {
  'b0000000-0000-0000-0000-000000000011': {
    id: 'c1',
    roomId: 'b0000000-0000-0000-0000-000000000011',
    guitarAmps: ['Roland JC-120', 'Marshall JCM2000 DSL100', 'Hughes & Kettner GrandMeister 36'],
    bassAmp: 'Ampeg SVT-3PRO + SVT-810E',
    drumSet: 'Pearl Masters Maple Complete (BD22, TT10, TT12, FT16)',
    isTwinPedalAllowed: true,
    paSystem: 'YAMAHA TF1 (デジタルミキサー)',
    keyboards: ['Roland RD-88', 'YAMAHA CP4 STAGE'],
    cymbalsDetail: 'PAISTE 2002 Crash 16/18, Ride 20, HiHat 14',
    additionalNotes: '全面ミラー有、常設3アンプ仕様で3ピース〜ツインギター編成まで快適です。',
  },
  'b0000000-0000-0000-0000-000000000012': {
    id: 'c2',
    roomId: 'b0000000-0000-0000-0000-000000000012',
    guitarAmps: ['Roland JC-120', 'Marshall DSL100H'],
    bassAmp: 'Ampeg SVT-450H + SVT-410HLF',
    drumSet: 'CANOPUS Yaiba II (BD22, TT10, TT12, FT16)',
    isTwinPedalAllowed: true,
    paSystem: 'YAMAHA EMX5016CF',
    keyboards: ['Roland RD-88'],
    cymbalsDetail: 'Zildjian A Custom Crash 16/18, Ride 20',
    additionalNotes: '30分スタート枠。タイトで音の回りが少なくモニタリングしやすい環境。',
  },
  'b0000000-0000-0000-0000-000000000013': {
    id: 'c3',
    roomId: 'b0000000-0000-0000-0000-000000000013',
    guitarAmps: ['Roland JC-120', 'Fender 65 Twin Reverb'],
    bassAmp: 'Hartke HA3500 + 4.5XL',
    drumSet: 'YAMAHA Stage Custom Bop-Kit (BD18, TT12, FT14)',
    isTwinPedalAllowed: true,
    paSystem: 'Mackie 1402-VLZ4',
    keyboards: ['Nord Electro 6D'],
    cymbalsDetail: 'SABIAN AA Regular Hats 14, Crash 16',
    additionalNotes: '個人練習・レコーディング・ボーカルレッスン専用ブース。',
  },
  'b0000000-0000-0000-0000-000000000021': {
    id: 'c4',
    roomId: 'b0000000-0000-0000-0000-000000000021',
    guitarAmps: ['Roland JC-120', 'Marshall JCM900 4100', 'Mesa/Boogie Dual Rectifier'],
    bassAmp: 'Ampeg SVT-3PRO + SVT-810E',
    drumSet: 'TAMA Starclassic Performer (BD22, TT12, TT13, FT16)',
    isTwinPedalAllowed: true,
    paSystem: 'YAMAHA EMX5016CF',
    keyboards: ['KORG KROSS2-88'],
    cymbalsDetail: 'SABIAN AA Series Rock Crash 16/18, Ride 20',
    additionalNotes: 'ペンタ新宿店の大型フラッグシップ室。※予約・空き状況はお電話（03-3351-3140）にて直接お問い合わせください。',
  },
  'b0000000-0000-0000-0000-000000000022': {
    id: 'c5',
    roomId: 'b0000000-0000-0000-0000-000000000022',
    guitarAmps: ['Roland JC-120', 'Marshall JCM900 4100'],
    bassAmp: 'Hartke HA3500 + 410XL',
    drumSet: 'Pearl Session Studio Classic',
    isTwinPedalAllowed: true,
    paSystem: 'YAMAHA EMX512SC',
    keyboards: ['Roland Juno-DS61'],
    cymbalsDetail: 'Zildjian New Beat Hats 14, Medium Thin Crash 16/18',
    additionalNotes: '使い勝手の良い14帖標準スタジオ。※予約・空き状況はお電話（03-3351-3140）にて直接お問い合わせください。',
  },
  'b0000000-0000-0000-0000-000000000031': {
    id: 'c6',
    roomId: 'b0000000-0000-0000-0000-000000000031',
    guitarAmps: ['Roland JC-120', 'Marshall JVM410H', 'Fender Bassman 100'],
    bassAmp: 'Ampeg SVT-VR + SVT-810AV',
    drumSet: 'YAMAHA Absolute Hybrid Maple',
    isTwinPedalAllowed: true,
    paSystem: 'PreSonus StudioLive 32SC (マルチトラック録音対応)',
    keyboards: ['Roland RD-2000', 'YAMAHA MONTAGE8'],
    cymbalsDetail: 'Zildjian K Custom Special Dry',
    additionalNotes: '大型18帖スタジオ。配信・セルフレコーディング用マルチマイク常設。',
  },
  'b0000000-0000-0000-0000-000000000032': {
    id: 'c7',
    roomId: 'b0000000-0000-0000-0000-000000000032',
    guitarAmps: ['Roland JC-120', 'Marshall DSL100H'],
    bassAmp: 'Markbass Little Mark III + Standard 104HR',
    drumSet: 'Pearl Masters Studio',
    isTwinPedalAllowed: true,
    paSystem: 'YAMAHA EMX5016CF',
    keyboards: ['Roland RD-88'],
    cymbalsDetail: 'PAISTE Signature Full Crash',
    additionalNotes: '30分スタート枠。温かみのあるアンビエンスで長時間の練習でも疲れません。',
  },
  'b0000000-0000-0000-0000-000000000041': {
    id: 'c8',
    roomId: 'b0000000-0000-0000-0000-000000000041',
    guitarAmps: ['Roland JC-120', 'Marshall JCM2000 DSL100'],
    bassAmp: 'Ampeg SVT-450H + SVT-810E',
    drumSet: 'TAMA Imperialstar',
    isTwinPedalAllowed: true,
    paSystem: 'YAMAHA EMX512SC',
    keyboards: ['Roland Juno-DS'],
    cymbalsDetail: 'SABIAN AA Series',
    additionalNotes: '千葉の定番スタジオ。ツインペダル持ち込み可、音抜け良好。',
  },
  'b0000000-0000-0000-0000-000000000042': {
    id: 'c9',
    roomId: 'b0000000-0000-0000-0000-000000000042',
    guitarAmps: ['Roland JC-120', 'Marshall MG100HFX'],
    bassAmp: 'Hartke 3500 + 410XL',
    drumSet: 'Pearl Export',
    isTwinPedalAllowed: false,
    paSystem: 'YAMAHA EMX312SC',
    keyboards: [],
    cymbalsDetail: 'Zildjian ZBT Series',
    additionalNotes: '少人数バンド向けリーズナブル枠。ツインペダルは使用不可。',
  },
  'b0000000-0000-0000-0000-000000000051': {
    id: 'c10',
    roomId: 'b0000000-0000-0000-0000-000000000051',
    guitarAmps: ['Roland JC-120', 'Marshall JCM900 4100'],
    bassAmp: 'Ampeg SVT-3PRO + SVT-410HLF',
    drumSet: 'Pearl Masters Custom',
    isTwinPedalAllowed: true,
    paSystem: 'YAMAHA EMX5014C',
    keyboards: ['Roland RD-700NX'],
    cymbalsDetail: 'PAISTE 2002',
    additionalNotes: '柏駅前すぐ。広いコントロールスペースと鏡張り。',
  },
  'b0000000-0000-0000-0000-000000000052': {
    id: 'c11',
    roomId: 'b0000000-0000-0000-0000-000000000052',
    guitarAmps: ['Roland JC-120', 'Marshall DSL40CR'],
    bassAmp: 'EDEN WT800 + D410XLT',
    drumSet: 'YAMAHA Tour Custom',
    isTwinPedalAllowed: true,
    paSystem: 'YAMAHA EMX212S',
    keyboards: [],
    cymbalsDetail: 'SABIAN B8X',
    additionalNotes: '30分スタート枠。コスパ抜群の練習室。',
  },
};

// 擬似乱数ハッシュで日付・時間から安定したスロットステータスを生成
function hashSlot(roomId: string, dateStr: string, hour: number, offsetMin: number): 'available' | 'booked' | 'unopened' {
  const str = `${roomId}-${dateStr}-${hour}:${offsetMin}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const score = Math.abs(hash) % 100;
  
  // 夜（18時以降）は予約率高め
  if (hour >= 18) {
    return score < 60 ? 'booked' : 'available';
  } else {
    return score < 35 ? 'booked' : 'available';
  }
}

// 指定した日付の全部屋のスロットを生成するヘルパー
export function getMockSlotsForDate(dateStr: string): Record<string, AvailabilitySlot[]> {
  const result: Record<string, AvailabilitySlot[]> = {};

  for (const room of MOCK_ROOMS) {
    // スタジオペンタ（新宿店・千葉駅前店）はオンライン予約システムが存在せず電話予約専用のため、ダミースロットは生成しない
    if (room.studioId === 'a0000000-0000-0000-0000-000000000002' || room.studioId === 'a0000000-0000-0000-0000-000000000004') {
      result[room.id] = [];
      continue;
    }

    const slots: AvailabilitySlot[] = [];
    const offset = room.startTimeOffset;

    for (let h = 6; h <= 23; h++) {
      const sHour = String(h).padStart(2, '0');
      const eHour = String(h + 1).padStart(2, '0');
      const sMin = String(offset).padStart(2, '0');
      const eMin = String(offset).padStart(2, '0');

      const startIso = `${dateStr}T${sHour}:${sMin}:00+09:00`;
      const endIso = `${dateStr}T${eHour}:${eMin}:00+09:00`;

      const status = hashSlot(room.id, dateStr, h, offset);

      slots.push({
        id: `slot-${room.id}-${dateStr}-${h}`,
        roomId: room.id,
        startTime: startIso,
        endTime: endIso,
        status,
      });
    }
    result[room.id] = slots;
  }

  return result;
}

// 部屋とスタジオ、機材、スロットを結合したリストを取得
export function getMockRoomsWithSlots(dateStr: string): RoomWithSlots[] {
  const slotsMap = getMockSlotsForDate(dateStr);
  const studioMap = new Map(MOCK_STUDIOS.map(s => [s.id, s]));

  // 秋葉原エリアは4スタジオ（全36部屋）の実データを反映
  const akibaRealRooms = getAkihabaraRealRooms(dateStr);

  // ノア渋谷2号店は実スクレイピングデータから全14部屋＆実スロットを生成
  const noahShibuya2RealRooms = getNoahShibuya2RealRooms(dateStr);

  // ゲートウェイスタジオ渋谷道玄坂店は実スクレイピングデータから全12部屋＆実スロットを生成
  const gatewayShibuyaRealRooms = getGatewayShibuyaRealRooms(dateStr);

  // 他店舗（PENTA新宿、ノア吉祥寺、PENTA千葉、柏音楽館）の部屋
  const otherRooms = MOCK_ROOMS
    .filter(room => room.studioId !== 'a0000000-0000-0000-0000-000000000001')
    .map(room => {
      const studio = studioMap.get(room.studioId) || MOCK_STUDIOS[0];
      const equipment = MOCK_EQUIPMENTS[room.id] || {
        id: 'eq-default',
        roomId: room.id,
        guitarAmps: ['Roland JC-120'],
        bassAmp: 'Ampeg SVT',
        drumSet: 'Standard Set',
        isTwinPedalAllowed: true,
      };

      return {
        ...room,
        studio,
        equipment,
        slots: slotsMap[room.id] || [],
      };
    });

  return [...akibaRealRooms, ...noahShibuya2RealRooms, ...gatewayShibuyaRealRooms, ...otherRooms];
}
