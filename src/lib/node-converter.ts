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
  offset: number;
  priceRegular: number;
  priceDaytime: number;
  priceSolo: number;
  equipment: RoomEquipment;
}> = [
  {
    id: 'node-shinjuku-2Ast',
    name: '2Ast (9帖)',
    tatami: 9,
    capacity: 5,
    offset: 30,
    priceRegular: 2500,
    priceDaytime: 1200,
    priceSolo: 600,
    equipment: {
      id: 'eq-node-2Ast',
      roomId: 'node-shinjuku-2Ast',
      guitarAmps: ['Marshall JCM2000 + 1960A', 'Roland JC-120'],
      bassAmp: 'Hartke HA2500 + VX410 x2',
      drumSet: 'YAMAHA Oak Custom (20/10/12/14)',
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA EMX5014C + S112A x2',
      additionalNotes: '手頃な9帖スタジオ。毎時30分スタート。YAMAHA CP-33 / S03完備。',
    },
  },
  {
    id: 'node-shinjuku-2Bst',
    name: '2Bst (11帖)',
    tatami: 11,
    capacity: 5,
    offset: 30,
    priceRegular: 2700,
    priceDaytime: 1300,
    priceSolo: 650,
    equipment: {
      id: 'eq-node-2Bst',
      roomId: 'node-shinjuku-2Bst',
      guitarAmps: ['Marshall JCM2000 + 1960A', 'Roland JC-120'],
      bassAmp: 'Hartke HA2500 + VX410 x2',
      drumSet: 'YAMAHA Oak Custom (20/10/12/14)',
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA EMX5014C + S115V x2',
      additionalNotes: '11帖スタジオ。毎時30分スタート。YAMAHA CP33 / S03完備。',
    },
  },
  {
    id: 'node-shinjuku-3Cst',
    name: '3Cst (10帖)',
    tatami: 10,
    capacity: 5,
    offset: 0,
    priceRegular: 2600,
    priceDaytime: 1200,
    priceSolo: 600,
    equipment: {
      id: 'eq-node-3Cst',
      roomId: 'node-shinjuku-3Cst',
      guitarAmps: ['Marshall JCM2000 + 1960A', 'Roland JC-120'],
      bassAmp: 'Hartke HA2500 + VX410 x2',
      drumSet: 'YAMAHA Oak Custom (20/10/12/14)',
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA EMX5014C + S115V x2',
      additionalNotes: '手頃な料金で人気の10帖スタジオ。毎時00分スタート。YAMAHA CP33 / S03完備。',
    },
  },
  {
    id: 'node-shinjuku-3Dst',
    name: '3Dst (16帖)',
    tatami: 16,
    capacity: 7,
    offset: 0,
    priceRegular: 3500,
    priceDaytime: 1800,
    priceSolo: 700,
    equipment: {
      id: 'eq-node-3Dst',
      roomId: 'node-shinjuku-3Dst',
      guitarAmps: ['Marshall JCM2000 + 1960A', 'Roland JC-120'],
      bassAmp: 'Hartke HA2500 + VX410 x2',
      drumSet: 'YAMAHA Recording Custom (20/8/10/12/13/14)',
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA EMX5014C + S115V x2',
      additionalNotes: '広々16帖。毎時00分スタート。YAMAHA CP33 / S03完備。',
    },
  },
  {
    id: 'node-shinjuku-4Est',
    name: '4Est (12帖)',
    tatami: 12,
    capacity: 6,
    offset: 0,
    priceRegular: 2800,
    priceDaytime: 1300,
    priceSolo: 650,
    equipment: {
      id: 'eq-node-4Est',
      roomId: 'node-shinjuku-4Est',
      guitarAmps: ['Marshall JCM2000 + 1960A', 'Roland JC-120'],
      bassAmp: 'Hartke HA2500 + VX410 x2',
      drumSet: 'YAMAHA Oak Custom (20/10/12/14)',
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA EMX5014C + S115V x2',
      additionalNotes: '標準的な12帖スタジオ。毎時00分スタート。YAMAHA CP33 / S03完備。',
    },
  },
  {
    id: 'node-shinjuku-4Fst',
    name: '4Fst (14帖)',
    tatami: 14,
    capacity: 6,
    offset: 0,
    priceRegular: 3300,
    priceDaytime: 1800,
    priceSolo: 700,
    equipment: {
      id: 'eq-node-4Fst',
      roomId: 'node-shinjuku-4Fst',
      guitarAmps: ['Marshall JCM2000 + 1960A', 'Roland JC-120'],
      bassAmp: 'Hartke HA2500 + VX410 x2',
      drumSet: 'YAMAHA Recording Custom (20/8/10/12/13/14)',
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA EMX5014C + S115V x2',
      additionalNotes: 'ゆったり14帖。毎時00分スタート。YAMAHA CP33 / S03完備。',
    },
  },
  {
    id: 'node-shinjuku-5Gst',
    name: '5Gst (26帖)',
    tatami: 26,
    capacity: 10,
    offset: 30,
    priceRegular: 4200,
    priceDaytime: 3500,
    priceSolo: 850,
    equipment: {
      id: 'eq-node-5Gst',
      roomId: 'node-shinjuku-5Gst',
      guitarAmps: ['Marshall JCM2000 + 1960A', 'Roland JC-120', 'Fender Hot Rod Deville III 212'],
      bassAmp: 'Hartke HA3500 + VX410 x2',
      drumSet: 'YAMAHA Birch Custom (20/8/10/12/13/14)',
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA EMX5016CF + PC2002M / EV Eliminator Double x2 / S115V x4',
      additionalNotes: '当店最大26帖スタジオ。毎時30分スタート。アンプ3台常設・大型ゲネプロ対応。',
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
      startTimeOffset: spec.offset,
      orderIndex: 200 + index,
      studio: NODE_SHINJUKU_STUDIO,
      equipment: spec.equipment,
      slots,
    };
  });
}
