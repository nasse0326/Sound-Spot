import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import ongakukanShinjukuJson from '@/data/ongakukan-shinjuku-real.json';

export const ONGAKUKAN_SHINJUKU_STUDIO: Studio = {
  id: 'ongakukan-shinjuku-west',
  name: 'スタジオ音楽館 新宿西口店',
  chainName: 'スタジオ音楽館',
  area: '新宿',
  prefecture: '東京都',
  nearestStation: '新宿駅 西口 徒歩2分 / 新宿西口駅 徒歩3分',
  address: '東京都新宿区西新宿7-15-4 YSビルB2F',
  tel: '03-3368-0131',
  bookingUrl: 'https://www.ajg.jp/shop/ReservationTop.php?id=Fuoxajj8krt105m',
  websiteUrl: 'http://www.st-ongakukan.com/sinjukunishi/sinjukunishi.html',
  businessHoursSummary: '10:00〜24:00 (予約に応じ24時間営業対応)',
  is24Hours: false,
  groupBookingRule: 'WEBにて予約受付可能',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
  soloBookingLeadHours: 27,
};

export interface OngakukanShinjukuRoomDef {
  id: string;
  name: string;
  tatami: number;
  capacity: number;
  hourlyRegular: number;
  hourlyDaytime: number;
  soloPrice: number;
  guitarAmps: string[];
  bassAmp: string;
  drumSet: string;
  keyboards?: string[];
}

export const ONGAKUKAN_SHINJUKU_ROOM_DEFS: OngakukanShinjukuRoomDef[] = [
  {
    id: 'og-shinjuku-rhythm',
    name: 'Rhythm (9帖)',
    tatami: 9,
    capacity: 4,
    hourlyRegular: 3140,
    hourlyDaytime: 1980,
    soloPrice: 790,
    guitarAmps: ['Roland JC-120', 'Marshall DSL100'],
    bassAmp: 'Ampeg SVT-350H + SVT-410HLF',
    drumSet: 'Pearl Standard Drum Set',
  },
  {
    id: 'og-shinjuku-harmony',
    name: 'Harmony (10帖)',
    tatami: 10,
    capacity: 4,
    hourlyRegular: 3440,
    hourlyDaytime: 2250,
    soloPrice: 790,
    guitarAmps: ['Roland JC-120', 'Marshall JCM2000 DSL100'],
    bassAmp: 'Ampeg SVT-350H + SVT-410HLF',
    drumSet: 'Pearl Standard Drum Set',
  },
  {
    id: 'og-shinjuku-tone',
    name: 'Tone (11帖)',
    tatami: 11,
    capacity: 5,
    hourlyRegular: 3560,
    hourlyDaytime: 2360,
    soloPrice: 790,
    guitarAmps: ['Roland JC-120', 'Marshall JCM2000 DSL100', 'Fender Twin Reverb'],
    bassAmp: 'Ampeg SVT-450H + SVT-410HLF',
    drumSet: 'Pearl Masters Custom',
  },
  {
    id: 'og-shinjuku-kick',
    name: 'Kick (13帖)',
    tatami: 13,
    capacity: 6,
    hourlyRegular: 3930,
    hourlyDaytime: 2640,
    soloPrice: 790,
    guitarAmps: ['Roland JC-120', 'Marshall JVM210H', 'Fender Twin Reverb'],
    bassAmp: 'Ampeg SVT-4PRO + SVT-810E',
    drumSet: 'Pearl Masters Custom',
    keyboards: ['Roland RD-88'],
  },
  {
    id: 'og-shinjuku-opus',
    name: 'Opus (17帖)',
    tatami: 17,
    capacity: 8,
    hourlyRegular: 4710,
    hourlyDaytime: 3520,
    soloPrice: 790,
    guitarAmps: ['Roland JC-120', 'Marshall JVM410H', 'Fender 65 Twin Reverb'],
    bassAmp: 'Ampeg SVT-4PRO + SVT-810E',
    drumSet: 'Pearl Reference Pure',
    keyboards: ['Roland RD-88'],
  },
  {
    id: 'og-shinjuku-beat',
    name: 'Beat (20帖)',
    tatami: 20,
    capacity: 15,
    hourlyRegular: 5140,
    hourlyDaytime: 3960,
    soloPrice: 790,
    guitarAmps: ['Roland JC-120', 'Marshall JVM410H', 'Fender Twin Reverb'],
    bassAmp: 'Ampeg SVT-4PRO + SVT-810E',
    drumSet: 'Pearl Reference Pure',
    keyboards: ['Roland RD-88'],
  },
  {
    id: 'og-shinjuku-multiplex',
    name: 'Multiplex (22帖)',
    tatami: 22,
    capacity: 15,
    hourlyRegular: 5380,
    hourlyDaytime: 4180,
    soloPrice: 790,
    guitarAmps: ['Roland JC-120', 'Marshall JVM410H', 'Hughes & Kettner'],
    bassAmp: 'Ampeg SVT-4PRO + SVT-810E',
    drumSet: 'Pearl Reference Pure',
    keyboards: ['Roland RD-88'],
  },
];

export function getOngakukanShinjukuRealRooms(targetDateStr: string): RoomWithSlots[] {
  const roomsMap = new Map<string, any>();
  if (ongakukanShinjukuJson?.rooms && Array.isArray(ongakukanShinjukuJson.rooms)) {
    for (const r of ongakukanShinjukuJson.rooms) {
      roomsMap.set(r.id, r);
    }
  }

  const results: RoomWithSlots[] = [];
  let order = 500;

  for (const def of ONGAKUKAN_SHINJUKU_ROOM_DEFS) {
    const crawledRoom = roomsMap.get(def.id);
    let slots: AvailabilitySlot[] = [];

    if (crawledRoom?.slots) {
      slots = crawledRoom.slots
        .filter((s: any) => s.start_time.startsWith(targetDateStr))
        .map((s: any) => ({
          id: s.id,
          roomId: def.id,
          startTime: s.start_time,
          endTime: s.end_time,
          status: s.status === 'AVAILABLE' ? 'available' : 'booked',
        }));
    }

    const equipment: RoomEquipment = {
      id: `eq-${def.id}`,
      roomId: def.id,
      guitarAmps: def.guitarAmps,
      bassAmp: def.bassAmp,
      drumSet: def.drumSet,
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA MGP16X / EV PA',
      keyboards: def.keyboards,
      additionalNotes: 'スタジオ音楽館 新宿西口店 標準高品位機材常設。全室00分スタート。個人練習は前日夜21時よりWeb受付。',
    };

    results.push({
      id: def.id,
      studioId: ONGAKUKAN_SHINJUKU_STUDIO.id,
      name: def.name,
      floor: 'B2F',
      sizeTatami: def.tatami,
      capacity: def.capacity,
      pricePerHourRegular: def.hourlyRegular,
      pricePerHourDaytime: def.hourlyDaytime,
      pricePerHourSolo: def.soloPrice,
      hasMirror: true,
      hasRecording: def.tatami >= 17,
      startTimeOffset: 0,
      orderIndex: order++,
      studio: ONGAKUKAN_SHINJUKU_STUDIO,
      equipment,
      slots,
    });
  }

  return results;
}
