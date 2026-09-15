import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import ongakukanBabaJson from '@/data/ongakukan-takadanobaba-real.json';

export const ONGAKUKAN_TAKADANOBABA_STUDIO: Studio = {
  id: 'ongakukan-takadanobaba',
  name: 'スタジオ音楽館 馬場駅前店',
  chainName: 'スタジオ音楽館',
  area: '高田馬場',
  prefecture: '東京都',
  nearestStation: '高田馬場駅 徒歩1分',
  address: '東京都新宿区高田馬場1丁目34-8大輝ビル地下1階',
  tel: '03-6278-9288',
  bookingUrl: 'https://www.ajg.jp/shop/ReservationTop.php?id=Pnpa4ff1gt9m22p',
  websiteUrl: 'http://www.st-ongakukan.com/takadanobabaekimae/takadanobabaekimae.html',
  businessHoursSummary: '13:00〜22:00 (予約に応じ24時間対応可)',
  is24Hours: false,
  groupBookingRule: 'WEBにて予約受付可能',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
  soloBookingLeadHours: 27,
};

export interface OngakukanTakadanobabaRoomDef {
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
}

export const ONGAKUKAN_TAKADANOBABA_ROOM_DEFS: OngakukanTakadanobabaRoomDef[] = [
  { id: 'og-baba-break', name: 'Break (7帖)', tatami: 7, capacity: 3, hourlyRegular: 2860, hourlyDaytime: 1760, soloPrice: 790, guitarAmps: ['Roland JC-120', 'Marshall JCM900'], bassAmp: 'Ampeg SVT-350H', drumSet: 'Pearl Standard Drum Set' },
  { id: 'og-baba-conect', name: 'Conect (7帖・30分スタート)', tatami: 7, capacity: 3, hourlyRegular: 2860, hourlyDaytime: 1760, soloPrice: 790, guitarAmps: ['Roland JC-120', 'Marshall JCM900'], bassAmp: 'Ampeg SVT-350H', drumSet: 'Pearl Standard Drum Set' },
  { id: 'og-baba-digi', name: 'Digi (11帖)', tatami: 11, capacity: 5, hourlyRegular: 3560, hourlyDaytime: 2360, soloPrice: 790, guitarAmps: ['Roland JC-120', 'Marshall JCM2000 DSL100'], bassAmp: 'Ampeg SVT-450H + SVT-410HLF', drumSet: 'Pearl Masters Custom' },
  { id: 'og-baba-elegy', name: 'Elegy (13帖)', tatami: 13, capacity: 6, hourlyRegular: 3930, hourlyDaytime: 2640, soloPrice: 790, guitarAmps: ['Roland JC-120', 'Marshall JVM210H', 'Fender Twin Reverb'], bassAmp: 'Ampeg SVT-4PRO + SVT-810E', drumSet: 'Pearl Masters Custom' },
  { id: 'og-baba-flash', name: 'Flash (14帖)', tatami: 14, capacity: 7, hourlyRegular: 4180, hourlyDaytime: 2860, soloPrice: 790, guitarAmps: ['Roland JC-120', 'Marshall JVM410H', 'Fender Twin Reverb'], bassAmp: 'Ampeg SVT-4PRO + SVT-810E', drumSet: 'Pearl Reference Pure' },
  { id: 'og-baba-grosso', name: 'Grosso (15帖)', tatami: 15, capacity: 8, hourlyRegular: 4400, hourlyDaytime: 3080, soloPrice: 790, guitarAmps: ['Roland JC-120', 'Marshall JVM410H', 'Hughes & Kettner'], bassAmp: 'Ampeg SVT-4PRO + SVT-810E', drumSet: 'Pearl Reference Pure' },
];

export function getOngakukanTakadanobabaRealRooms(targetDateStr: string): RoomWithSlots[] {
  const roomsMap = new Map<string, any>();
  if (ongakukanBabaJson?.rooms && Array.isArray(ongakukanBabaJson.rooms)) {
    for (const r of ongakukanBabaJson.rooms) {
      roomsMap.set(r.id, r);
    }
  }

  const results: RoomWithSlots[] = [];
  let order = 700;

  for (const def of ONGAKUKAN_TAKADANOBABA_ROOM_DEFS) {
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
      additionalNotes: 'スタジオ音楽館 馬場駅前店 標準機材常設。高田馬場駅から徒歩1分。',
    };

    results.push({
      id: def.id,
      studioId: ONGAKUKAN_TAKADANOBABA_STUDIO.id,
      name: def.name,
      floor: 'B1F',
      sizeTatami: def.tatami,
      capacity: def.capacity,
      pricePerHourRegular: def.hourlyRegular,
      pricePerHourDaytime: def.hourlyDaytime,
      pricePerHourSolo: def.soloPrice,
      hasMirror: true,
      hasRecording: def.tatami >= 14,
      startTimeOffset: def.name.includes('30分スタート') ? 30 : 0,
      orderIndex: order++,
      studio: ONGAKUKAN_TAKADANOBABA_STUDIO,
      equipment,
      slots,
    });
  }

  return results;
}
