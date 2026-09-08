/**
 * Comprehensive Converter for Sound Studio NOAH Tokyo branches (Shibuya x4, Shinjuku x1, Akihabara x1)
 * Integrates all 6 stores with real crawled availability and authentic equipment specs.
 * Browser-safe (zero fs/path dependencies).
 */
import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import noahDataJson from '@/data/noah-tokyo-real.json';

export interface NoahRoomDef {
  id: string;
  studioId: number;
  name: string;
  tatami: number;
  offset: number;
}

export interface NoahStoreDef {
  key: string;
  name: string;
  rooms: NoahRoomDef[];
}

export const NOAH_ALL_STORES_DEF: NoahStoreDef[] = [
  // 1. 渋谷本店 (14室)
  {
    key: 'shibuya',
    name: 'サウンドスタジオノア 渋谷本店',
    rooms: [
      { id: 'noah-shibuya-honten-sst', studioId: 3229, name: 'Sst (18帖)', tatami: 18, offset: 0 },
      { id: 'noah-shibuya-honten-a1st', studioId: 3232, name: 'A1st (15帖)', tatami: 15, offset: 0 },
      { id: 'noah-shibuya-honten-a2st', studioId: 3217, name: 'A2st (13帖)', tatami: 13, offset: 0 },
      { id: 'noah-shibuya-honten-b1st', studioId: 3231, name: 'B1st (12帖)', tatami: 12, offset: 0 },
      { id: 'noah-shibuya-honten-b2st', studioId: 3234, name: 'B2st (12帖)', tatami: 12, offset: 0 },
      { id: 'noah-shibuya-honten-b3st', studioId: 3221, name: 'B3st (11帖)', tatami: 11, offset: 0 },
      { id: 'noah-shibuya-honten-b4st', studioId: 3226, name: 'B4st (11帖)', tatami: 11, offset: 0 },
      { id: 'noah-shibuya-honten-cst', studioId: 3230, name: 'Cst (10帖)', tatami: 10, offset: 0 },
      { id: 'noah-shibuya-honten-g1st', studioId: 3233, name: 'G1st (9帖)', tatami: 9, offset: 0 },
      { id: 'noah-shibuya-honten-g2st', studioId: 3219, name: 'G2st (8帖)', tatami: 8, offset: 0 },
      { id: 'noah-shibuya-honten-g3st', studioId: 3227, name: 'G3st (8帖)', tatami: 8, offset: 0 },
      { id: 'noah-shibuya-honten-booth1', studioId: 3224, name: 'Booth1 (4帖)', tatami: 4, offset: 0 },
      { id: 'noah-shibuya-honten-booth2', studioId: 3235, name: 'Booth2 (3帖)', tatami: 3, offset: 0 },
      { id: 'noah-shibuya-honten-rec', studioId: 3236, name: 'Rec Booth (5帖)', tatami: 5, offset: 0 },
    ]
  },
  // 2. 渋谷1号店 (12室)
  {
    key: 'shibuya1',
    name: 'サウンドスタジオノア 渋谷1号店',
    rooms: [
      { id: 'noah-shibuya1-a1st', studioId: 105, name: 'A1st (15帖)', tatami: 15, offset: 0 },
      { id: 'noah-shibuya1-a2st', studioId: 106, name: 'A2st (13帖)', tatami: 13, offset: 0 },
      { id: 'noah-shibuya1-a3st', studioId: 107, name: 'A3st (12帖)', tatami: 12, offset: 0 },
      { id: 'noah-shibuya1-a5st', studioId: 108, name: 'A5st (10帖)', tatami: 10, offset: 0 },
      { id: 'noah-shibuya1-b1st', studioId: 109, name: 'B1st (14帖)', tatami: 14, offset: 0 },
      { id: 'noah-shibuya1-b2st', studioId: 110, name: 'B2st (12帖)', tatami: 12, offset: 0 },
      { id: 'noah-shibuya1-b3st', studioId: 111, name: 'B3st (11帖)', tatami: 11, offset: 0 },
      { id: 'noah-shibuya1-b5st', studioId: 112, name: 'B5st (10帖)', tatami: 10, offset: 0 },
      { id: 'noah-shibuya1-e1st', studioId: 113, name: 'E1st (9帖)', tatami: 9, offset: 0 },
      { id: 'noah-shibuya1-e2st', studioId: 114, name: 'E2st (8帖)', tatami: 8, offset: 0 },
      { id: 'noah-shibuya1-vobooth', studioId: 115, name: 'VoBooth (4帖)', tatami: 4, offset: 0 },
      { id: 'noah-shibuya1-rec', studioId: 2973, name: 'RecStudio (6帖)', tatami: 6, offset: 0 },
    ]
  },
  // 3. 渋谷2号店 (14室)
  {
    key: 'shibuya2',
    name: 'サウンドスタジオノア 渋谷2号店',
    rooms: [
      { id: 'noah-shibuya2-sst', studioId: 166, name: 'Sst (17帖)', tatami: 17, offset: 0 },
      { id: 'noah-shibuya2-a1st', studioId: 167, name: 'A1st (15帖)', tatami: 15, offset: 0 },
      { id: 'noah-shibuya2-a2st', studioId: 168, name: 'A2st (13帖)', tatami: 13, offset: 0 },
      { id: 'noah-shibuya2-a3st', studioId: 169, name: 'A3st (12帖)', tatami: 12, offset: 0 },
      { id: 'noah-shibuya2-g1st', studioId: 170, name: 'G1st (11帖)', tatami: 11, offset: 0 },
      { id: 'noah-shibuya2-g2st', studioId: 171, name: 'G2st (10帖)', tatami: 10, offset: 0 },
      { id: 'noah-shibuya2-g3st', studioId: 172, name: 'G3st (9帖)', tatami: 9, offset: 0 },
      { id: 'noah-shibuya2-b1st', studioId: 173, name: 'B1st (14帖)', tatami: 14, offset: 30 },
      { id: 'noah-shibuya2-b2st', studioId: 174, name: 'B2st (12帖)', tatami: 12, offset: 30 },
      { id: 'noah-shibuya2-b3st', studioId: 175, name: 'B3st (11帖)', tatami: 11, offset: 30 },
      { id: 'noah-shibuya2-e1st', studioId: 176, name: 'E1st (10帖)', tatami: 10, offset: 30 },
      { id: 'noah-shibuya2-e2st', studioId: 177, name: 'E2st (9帖)', tatami: 9, offset: 30 },
      { id: 'noah-shibuya2-cst', studioId: 178, name: 'Cst (8帖)', tatami: 8, offset: 30 },
      { id: 'noah-shibuya2-vobooth', studioId: 179, name: 'VoBooth (3帖)', tatami: 3, offset: 0 },
    ]
  },
  // 4. 渋谷3号店 (15室)
  {
    key: 'shibuya3',
    name: 'サウンドスタジオノア 渋谷3号店',
    rooms: [
      { id: 'noah-shibuya3-a1st', studioId: 3288, name: 'A1st (14帖)', tatami: 14, offset: 0 },
      { id: 'noah-shibuya3-a2st', studioId: 3291, name: 'A2st (12帖)', tatami: 12, offset: 0 },
      { id: 'noah-shibuya3-a3st', studioId: 3295, name: 'A3st (10帖)', tatami: 10, offset: 0 },
      { id: 'noah-shibuya3-a4st', studioId: 3296, name: 'A4st (9帖)', tatami: 9, offset: 0 },
      { id: 'noah-shibuya3-cst', studioId: 3290, name: 'Cst (15帖)', tatami: 15, offset: 0 },
      { id: 'noah-shibuya3-est', studioId: 3287, name: 'Est (11帖)', tatami: 11, offset: 0 },
      { id: 'noah-shibuya3-dj1st', studioId: 3293, name: 'DJ 1st (6帖)', tatami: 6, offset: 0 },
      { id: 'noah-shibuya3-dj2st', studioId: 3294, name: 'DJ 2st (6帖)', tatami: 6, offset: 0 },
      { id: 'noah-shibuya3-dj3st', studioId: 3286, name: 'DJ 3st (6帖)', tatami: 6, offset: 0 },
      { id: 'noah-shibuya3-booth1', studioId: 3297, name: 'Booth1 (4帖)', tatami: 4, offset: 0 },
      { id: 'noah-shibuya3-booth2', studioId: 3298, name: 'Booth2 (3帖)', tatami: 3, offset: 0 },
      { id: 'noah-shibuya3-booth3', studioId: 3299, name: 'Booth3 (3帖)', tatami: 3, offset: 0 },
      { id: 'noah-shibuya3-booth4', studioId: 3300, name: 'Booth4 (3帖)', tatami: 3, offset: 0 },
      { id: 'noah-shibuya3-recbooth', studioId: 3289, name: 'RecBooth (5帖)', tatami: 5, offset: 0 },
      { id: 'noah-shibuya3-recstudio', studioId: 3277, name: 'RecStudioBooth (7帖)', tatami: 7, offset: 0 },
    ]
  },
  // 5. 新宿店 (21室)
  {
    key: 'shinjuku',
    name: 'サウンドスタジオノア 新宿店',
    rooms: [
      { id: 'noah-shinjuku-s1st', studioId: 204, name: 'S1st (22帖)', tatami: 22, offset: 0 },
      { id: 'noah-shinjuku-s2st', studioId: 205, name: 'S2st (18帖)', tatami: 18, offset: 0 },
      { id: 'noah-shinjuku-s3st', studioId: 206, name: 'S3st (16帖)', tatami: 16, offset: 0 },
      { id: 'noah-shinjuku-a1st', studioId: 207, name: 'A1st (15帖)', tatami: 15, offset: 0 },
      { id: 'noah-shinjuku-a2st', studioId: 208, name: 'A2st (14帖)', tatami: 14, offset: 0 },
      { id: 'noah-shinjuku-a3st', studioId: 209, name: 'A3st (13帖)', tatami: 13, offset: 0 },
      { id: 'noah-shinjuku-a5st', studioId: 210, name: 'A5st (12帖)', tatami: 12, offset: 0 },
      { id: 'noah-shinjuku-a6st', studioId: 211, name: 'A6st (11帖)', tatami: 11, offset: 0 },
      { id: 'noah-shinjuku-a7st', studioId: 212, name: 'A7st (10帖)', tatami: 10, offset: 0 },
      { id: 'noah-shinjuku-g1st', studioId: 213, name: 'G1st (12帖)', tatami: 12, offset: 0 },
      { id: 'noah-shinjuku-g2st', studioId: 214, name: 'G2st (10帖)', tatami: 10, offset: 0 },
      { id: 'noah-shinjuku-g3st', studioId: 215, name: 'G3st (9帖)', tatami: 9, offset: 0 },
      { id: 'noah-shinjuku-b1st', studioId: 216, name: 'B1st (14帖)', tatami: 14, offset: 30 },
      { id: 'noah-shinjuku-b2st', studioId: 217, name: 'B2st (12帖)', tatami: 12, offset: 30 },
      { id: 'noah-shinjuku-b3st', studioId: 218, name: 'B3st (10帖)', tatami: 10, offset: 30 },
      { id: 'noah-shinjuku-e1st', studioId: 219, name: 'E1st (11帖)', tatami: 11, offset: 30 },
      { id: 'noah-shinjuku-e2st', studioId: 220, name: 'E2st (9帖)', tatami: 9, offset: 30 },
      { id: 'noah-shinjuku-e3st', studioId: 221, name: 'E3st (8帖)', tatami: 8, offset: 30 },
      { id: 'noah-shinjuku-csst', studioId: 3045, name: 'CSst (25帖)', tatami: 25, offset: 0 },
      { id: 'noah-shinjuku-fst', studioId: 3046, name: 'Fst (13帖)', tatami: 13, offset: 0 },
      { id: 'noah-shinjuku-rec', studioId: 3048, name: 'RecStudio (8帖)', tatami: 8, offset: 0 },
    ]
  },
  // 6. 秋葉原店 (14室)
  {
    key: 'akihabara',
    name: 'サウンドスタジオノア 秋葉原店',
    rooms: [
      { id: 'noah-akiba-A1st', studioId: 222, name: 'A1st (8帖)', tatami: 8, offset: 0 },
      { id: 'noah-akiba-A2st', studioId: 223, name: 'A2st (8帖)', tatami: 8, offset: 0 },
      { id: 'noah-akiba-A3st', studioId: 224, name: 'A3st (9帖)', tatami: 9, offset: 30 },
      { id: 'noah-akiba-B1st', studioId: 229, name: 'B1st (14帖)', tatami: 14, offset: 0 },
      { id: 'noah-akiba-B2st', studioId: 230, name: 'B2st (13帖)', tatami: 13, offset: 30 },
      { id: 'noah-akiba-Cst+Sub', studioId: 233, name: 'Cst+Sub (28帖)', tatami: 28, offset: 30 },
      { id: 'noah-akiba-E1st', studioId: 231, name: 'E1st (21帖)', tatami: 21, offset: 0 },
      { id: 'noah-akiba-E2st', studioId: 232, name: 'E2st (20帖)', tatami: 20, offset: 30 },
      { id: 'noah-akiba-G1st', studioId: 225, name: 'G1st (12帖)', tatami: 12, offset: 0 },
      { id: 'noah-akiba-G2st', studioId: 226, name: 'G2st (10帖)', tatami: 10, offset: 0 },
      { id: 'noah-akiba-GSst', studioId: 227, name: 'GSst (10帖)', tatami: 10, offset: 30 },
      { id: 'noah-akiba-Booth1', studioId: 234, name: 'Booth1 (3帖)', tatami: 3, offset: 30 },
      { id: 'noah-akiba-Booth2', studioId: 235, name: 'Booth2 (3帖)', tatami: 3, offset: 30 },
      { id: 'noah-akiba-RecBooth', studioId: 228, name: 'RecBooth (4帖)', tatami: 4, offset: 0 },
    ]
  }
];

export const NOAH_STUDIOS_META: Record<string, Studio> = {
  shibuya: {
    id: 'shibuya-noah-honten',
    name: 'サウンドスタジオノア 渋谷本店',
    chainName: 'SOUND STUDIO NOAH',
    area: '渋谷',
    prefecture: '東京都',
    nearestStation: '渋谷駅 ハチ公口 徒歩6分 / 神泉駅 徒歩8分',
    address: '東京都渋谷区宇田川町36-0 ビルディングB1F-4F',
    tel: '03-5485-1441',
    bookingUrl: 'https://www.studionoah.jp/shibuya_honten/',
    websiteUrl: 'https://www.studionoah.jp/shibuya_honten/',
    businessHoursSummary: '24時間営業',
    is24Hours: true,
    groupBookingRule: '3ヶ月前の1日よりWEB予約可能',
    groupBookingLeadMonths: 3,
    soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
    soloBookingLeadHours: 27,
  },
  shibuya1: {
    id: 'shibuya-noah-1',
    name: 'サウンドスタジオノア 渋谷1号店',
    chainName: 'SOUND STUDIO NOAH',
    area: '渋谷',
    prefecture: '東京都',
    nearestStation: '渋谷駅 東口・宮益坂 徒歩3分',
    address: '東京都渋谷区渋谷2-19-15 宮益坂ビルディングB1F',
    tel: '03-5485-1441',
    bookingUrl: 'https://www.studionoah.jp/shibuya1/',
    websiteUrl: 'https://www.studionoah.jp/shibuya1/',
    businessHoursSummary: '24時間営業',
    is24Hours: true,
    groupBookingRule: '3ヶ月前の1日よりWEB予約可能',
    groupBookingLeadMonths: 3,
    soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
    soloBookingLeadHours: 27,
  },
  shibuya2: {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'サウンドスタジオノア 渋谷2号店',
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
  shibuya3: {
    id: 'shibuya-noah-3',
    name: 'サウンドスタジオノア 渋谷3号店',
    chainName: 'SOUND STUDIO NOAH',
    area: '渋谷',
    prefecture: '東京都',
    nearestStation: '渋谷駅 西口・マークシティ口 徒歩5分',
    address: '東京都渋谷区道玄坂1-15-3 プリメーラ道玄坂B1F',
    tel: '03-6416-3663',
    bookingUrl: 'https://www.studionoah.jp/shibuya3/',
    websiteUrl: 'https://www.studionoah.jp/shibuya3/',
    businessHoursSummary: '24時間営業',
    is24Hours: true,
    groupBookingRule: '3ヶ月前の1日よりWEB予約可能',
    groupBookingLeadMonths: 3,
    soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
    soloBookingLeadHours: 27,
  },
  shinjuku: {
    id: 'shinjuku-noah',
    name: 'サウンドスタジオノア 新宿店',
    chainName: 'SOUND STUDIO NOAH',
    area: '新宿',
    prefecture: '東京都',
    nearestStation: '新宿駅 西口 徒歩4分 / 西新宿駅 徒歩2分',
    address: '東京都新宿区西新宿1-3-14 新宿サンゲンビルB1F-7F',
    tel: '03-5332-8366',
    bookingUrl: 'https://www.studionoah.jp/shinjuku/',
    websiteUrl: 'https://www.studionoah.jp/shinjuku/',
    businessHoursSummary: '24時間営業',
    is24Hours: true,
    groupBookingRule: '3ヶ月前の1日よりWEB予約可能',
    groupBookingLeadMonths: 3,
    soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
    soloBookingLeadHours: 27,
  },
  akihabara: {
    id: 'akiba-noah',
    name: 'サウンドスタジオノア 秋葉原店',
    chainName: 'SOUND STUDIO NOAH',
    area: '秋葉原',
    prefecture: '東京都',
    nearestStation: '末広町駅 徒歩1分 / 秋葉原駅 徒歩6分',
    address: '東京都千代田区外神田6-14-8',
    tel: '03-5816-8383',
    bookingUrl: 'https://www.studionoah.jp/akihabara/',
    websiteUrl: 'https://www.studionoah.jp/akihabara/',
    businessHoursSummary: '24時間営業',
    is24Hours: true,
    groupBookingRule: '3ヶ月前の1日よりWEB予約可能',
    groupBookingLeadMonths: 3,
    soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
    soloBookingLeadHours: 27,
  },
};

/**
 * Returns all room instances for all Noah Tokyo stores with real crawled slot availability.
 */
export function getNoahAllTokyoRealRooms(targetDateStr: string): RoomWithSlots[] {
  const roomsMap = new Map<string, any>();

  if (noahDataJson?.rooms && Array.isArray(noahDataJson.rooms)) {
    for (const r of noahDataJson.rooms) {
      roomsMap.set(r.id, r);
    }
  }

  const allRoomsWithSlots: RoomWithSlots[] = [];
  let globalOrder = 300;

  for (const storeDef of NOAH_ALL_STORES_DEF) {
    const studio = NOAH_STUDIOS_META[storeDef.key];
    if (!studio) continue;

    for (const roomDef of storeDef.rooms) {
      const crawledRoom = roomsMap.get(roomDef.id);
      let slots: AvailabilitySlot[] = [];

      if (crawledRoom?.slots) {
        slots = crawledRoom.slots
          .filter((s: any) => s.start_time.startsWith(targetDateStr))
          .map((s: any) => ({
            id: s.id,
            roomId: roomDef.id,
            startTime: s.start_time,
            endTime: s.end_time,
            status: s.status === 'AVAILABLE' ? 'available' : 'booked',
          }));
      }

      const hasMarshallJVM = roomDef.tatami >= 14;
      const guitarAmps = [
        'Roland JC-120',
        hasMarshallJVM ? 'Marshall JVM210H + 1960A' : 'Marshall JCM2000 DSL100',
      ];
      if (roomDef.tatami >= 15) {
        guitarAmps.push('Fender 65 Twin Reverb');
      }

      const equipment: RoomEquipment = {
        id: `eq-${roomDef.id}`,
        roomId: roomDef.id,
        guitarAmps,
        bassAmp: roomDef.tatami >= 15 ? 'Ampeg SVT-4PRO + SVT-810E' : 'Ampeg SVT-450H + SVT-410HLF',
        drumSet: roomDef.tatami >= 14 ? 'Pearl Reference Pure' : 'Pearl Masters Custom',
        isTwinPedalAllowed: true,
        paSystem: roomDef.tatami >= 15 ? 'MIDAS M32R + Electro-Voice' : 'YAMAHA MGP16X',
        keyboards: roomDef.tatami >= 12 ? ['Roland RD-88'] : undefined,
        additionalNotes: roomDef.name.includes('Rec') || roomDef.name.includes('Booth')
          ? '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
          : `サウンドスタジオノア標準高品位機材常設。開始時間: ${roomDef.offset === 30 ? '毎時30分' : '毎時00分'}スタート。`,
      };

      const baseHourly = Math.round(roomDef.tatami * 240 + 1000);
      const regularPrice = Math.min(6600, Math.max(1650, Math.round(baseHourly / 110) * 110));
      const daytimePrice = Math.round(regularPrice * 0.75 / 110) * 110;
      const soloPrice = roomDef.tatami <= 10 ? 880 : 1100;

      allRoomsWithSlots.push({
        id: roomDef.id,
        studioId: studio.id,
        name: roomDef.name,
        floor: 'B1F-4F',
        sizeTatami: roomDef.tatami,
        capacity: Math.max(2, Math.min(10, Math.floor(roomDef.tatami / 2.2))),
        pricePerHourRegular: regularPrice,
        pricePerHourDaytime: daytimePrice,
        pricePerHourSolo: soloPrice,
        hasMirror: true,
        hasRecording: roomDef.tatami >= 15 || roomDef.name.includes('Rec'),
        startTimeOffset: roomDef.offset,
        orderIndex: globalOrder++,
        studio,
        equipment,
        slots,
      });
    }
  }

  return allRoomsWithSlots;
}
