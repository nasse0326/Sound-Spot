/**
 * Converter for STUDIO NODE Shinjuku crawled slots
 */
import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import nodeDataJson from '@/data/node-shinjuku-real.json';

export const NODE_SHINJUKU_STUDIO: Studio = {
  id: 'shinjuku-node',
  name: 'STUDIO NODE 新宿店',
  chainName: 'STUDIO NODE',
  area: '新宿',
  prefecture: '東京都',
  nearestStation: '新宿駅 西口 徒歩6分 / 西武新宿駅 徒歩3分',
  address: '東京都新宿区西新宿7-16-12 YSビルB1F',
  tel: '03-5386-3371',
  bookingUrl: 'https://www.studio-node.jp/studio/member/VisitorLogin.php?lc=llcvcamtc&mn=1&gr=3',
  websiteUrl: 'https://www.studio-node.com/HomeSH.html',
  businessHoursSummary: '10:00〜24:00',
  is24Hours: false,
  groupBookingRule: 'WEBにて予約受付可能',
  groupBookingLeadMonths: 2,
  soloBookingRule: '前日よりWEB/電話にて受付開始',
  soloBookingLeadHours: 24,
};

const NODE_ROOMS_SPEC: Array<{
  id: string;
  name: string;
  tatami: number;
  capacity: number;
  priceRegular: number;
  priceDaytime: number;
  priceSolo: number;
  equipment: RoomEquipment;
}> = [
  {
    id: 'node-shinjuku-3Cst',
    name: '3Cst (10帖)',
    tatami: 10,
    capacity: 5,
    priceRegular: 2640,
    priceDaytime: 1760,
    priceSolo: 770,
    equipment: {
      id: 'eq-node-3Cst',
      roomId: 'node-shinjuku-3Cst',
      guitarAmps: ['Roland JC-120', 'Marshall JCM2000 DSL100'],
      bassAmp: 'Hartke HA3500 + 4.5XL',
      drumSet: 'Pearl Masters Custom',
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA EMX5016CF',
      additionalNotes: '手頃な料金で人気の10帖スタジオ。00分スタート。',
    },
  },
  {
    id: 'node-shinjuku-3Dst',
    name: '3Dst (16帖)',
    tatami: 16,
    capacity: 7,
    priceRegular: 3300,
    priceDaytime: 2200,
    priceSolo: 770,
    equipment: {
      id: 'eq-node-3Dst',
      roomId: 'node-shinjuku-3Dst',
      guitarAmps: ['Roland JC-120', 'Marshall JVM210H', 'Fender Twin Reverb'],
      bassAmp: 'Ampeg SVT-450H + 810E',
      drumSet: 'Canopus Yaiba II',
      isTwinPedalAllowed: true,
      paSystem: 'Soundcraft EFX12',
      additionalNotes: '広々16帖。大人数バンド・ゲネプロにも対応。',
    },
  },
  {
    id: 'node-shinjuku-4Est',
    name: '4Est (12帖)',
    tatami: 12,
    capacity: 6,
    priceRegular: 2860,
    priceDaytime: 1980,
    priceSolo: 770,
    equipment: {
      id: 'eq-node-4Est',
      roomId: 'node-shinjuku-4Est',
      guitarAmps: ['Roland JC-120', 'Marshall JCM900 4100'],
      bassAmp: 'Ampeg SVT-350',
      drumSet: 'Pearl Reference Pure',
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA EMX512SC',
      additionalNotes: '標準的な12帖スタジオ。タイトな鳴りでリハーサルに最適。',
    },
  },
  {
    id: 'node-shinjuku-4Fst',
    name: '4Fst (14帖)',
    tatami: 14,
    capacity: 6,
    priceRegular: 3080,
    priceDaytime: 2090,
    priceSolo: 770,
    equipment: {
      id: 'eq-node-4Fst',
      roomId: 'node-shinjuku-4Fst',
      guitarAmps: ['Roland JC-120', 'Marshall DSL100H', 'VOX AC30C2'],
      bassAmp: 'Hartke HA3500',
      drumSet: 'TAMA Starclassic',
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA EMX5014C',
      additionalNotes: 'ゆったり14帖。アンプ3台常設でキーボード・管楽器にも対応。',
    },
  },
];

export function getNodeShinjukuRealRooms(targetDateStr: string): RoomWithSlots[] {
  const roomsMap = new Map<string, any>();

  if (nodeDataJson?.rooms && Array.isArray(nodeDataJson.rooms)) {
    for (const r of nodeDataJson.rooms) {
      roomsMap.set(r.id, r);
    }
  }

  return NODE_ROOMS_SPEC.map((spec, index) => {
    const crawledRoom = roomsMap.get(spec.id);
    let slots: AvailabilitySlot[] = [];

    if (crawledRoom?.slots) {
      slots = crawledRoom.slots
        .filter((s: any) => s.start_time.startsWith(targetDateStr))
        .map((s: any) => ({
          id: s.id,
          roomId: spec.id,
          startTime: s.start_time,
          endTime: s.end_time,
          status: s.status === 'AVAILABLE' ? 'available' : 'booked',
        }));
    }

    return {
      id: spec.id,
      studioId: NODE_SHINJUKU_STUDIO.id,
      name: spec.name,
      floor: 'B1F',
      sizeTatami: spec.tatami,
      capacity: spec.capacity,
      pricePerHourRegular: spec.priceRegular,
      pricePerHourDaytime: spec.priceDaytime,
      pricePerHourSolo: spec.priceSolo,
      hasMirror: true,
      hasRecording: false,
      startTimeOffset: 0,
      orderIndex: 200 + index,
      studio: NODE_SHINJUKU_STUDIO,
      equipment: spec.equipment,
      slots,
    };
  });
}
