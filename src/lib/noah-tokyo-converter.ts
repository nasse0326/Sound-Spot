/**
 * Comprehensive Converter for Sound Studio NOAH Tokyo branches
 * (Shibuya x4, Shinjuku x1, Akihabara x1, Ochanomizu x1).
 * Integrates the shared room master (src/config/noah-master.ts, real official
 * pricing/equipment) with real crawled availability. Browser-safe (zero fs/path deps).
 */
import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import { NOAH_ALL_STORES } from '@/config/noah-master';
import noahDataJson from '@/data/noah-tokyo-real.json';

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
    bookingUrl: 'https://www.studionoah.jp/shibuya/',
    websiteUrl: 'https://www.studionoah.jp/shibuya/',
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
    id: 'shibuya-noah-2',
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
  ochanomizu: {
    id: 'noah-ochanomizu',
    name: 'サウンドスタジオノア 御茶ノ水店',
    chainName: 'SOUND STUDIO NOAH',
    area: '秋葉原',
    prefecture: '東京都',
    nearestStation: '御茶ノ水駅 御茶ノ水橋口 徒歩3分 / 神保町駅 A5出口 徒歩5分',
    address: '東京都千代田区神田駿河台2丁目1-17',
    tel: '03-6427-3361',
    bookingUrl: 'https://www.studionoah.jp/ochanomizu/',
    websiteUrl: 'https://www.studionoah.jp/ochanomizu/',
    businessHoursSummary: '24時間営業',
    is24Hours: true,
    groupBookingRule: '3ヶ月前の1日よりWEB予約可能',
    groupBookingLeadMonths: 3,
    soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
    soloBookingLeadHours: 27,
  },
  takadanobaba: {
    id: 'noah-takadanobaba',
    name: 'サウンドスタジオノア 高田馬場店',
    chainName: 'SOUND STUDIO NOAH',
    area: '高田馬場',
    prefecture: '東京都',
    nearestStation: '高田馬場駅 徒歩3分',
    address: '東京都豊島区高田3-15-7',
    tel: '03-3985-6761',
    bookingUrl: 'https://www.studionoah.jp/baba/',
    websiteUrl: 'https://www.studionoah.jp/baba/',
    businessHoursSummary: '24時間営業',
    is24Hours: true,
    groupBookingRule: '3ヶ月前の1日よりWEB予約可能',
    groupBookingLeadMonths: 3,
    soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
    soloBookingLeadHours: 27,
  },
  ikebukuro: {
    id: 'noah-ikebukuro',
    name: 'サウンドスタジオノア 池袋店',
    chainName: 'SOUND STUDIO NOAH',
    area: '池袋',
    prefecture: '東京都',
    nearestStation: '池袋駅 徒歩5分',
    address: '東京都豊島区東池袋2-63-1',
    tel: '03-5951-8400',
    bookingUrl: 'https://www.studionoah.jp/ikebukuro/',
    websiteUrl: 'https://www.studionoah.jp/ikebukuro/',
    businessHoursSummary: '24時間営業',
    is24Hours: true,
    groupBookingRule: '3ヶ月前の1日よりWEB予約可能',
    groupBookingLeadMonths: 3,
    soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
    soloBookingLeadHours: 27,
  },
  shimokitazawa: {
    id: 'noah-shimokitazawa',
    name: 'サウンドスタジオノア 下北沢店',
    chainName: 'SOUND STUDIO NOAH',
    area: '下北沢',
    prefecture: '東京都',
    nearestStation: '下北沢駅 徒歩5分',
    address: '東京都世田谷区北沢3-20-17',
    tel: '03-3466-0058',
    bookingUrl: 'https://www.studionoah.jp/shimokita/',
    websiteUrl: 'https://www.studionoah.jp/shimokita/',
    businessHoursSummary: '24時間営業',
    is24Hours: true,
    groupBookingRule: '3ヶ月前の1日よりWEB予約可能',
    groupBookingLeadMonths: 3,
    soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
    soloBookingLeadHours: 27,
  },
  kichijoji: {
    id: 'noah-kichijoji',
    name: 'サウンドスタジオノア 吉祥寺店',
    chainName: 'SOUND STUDIO NOAH',
    area: '吉祥寺',
    prefecture: '東京都',
    nearestStation: 'JR中央線・京王井の頭線 吉祥寺駅 徒歩5分',
    address: '東京都武蔵野市吉祥寺東町1-4-27-B1F',
    tel: '0422-23-1741',
    bookingUrl: 'https://www.studionoah.jp/kichijoji/',
    websiteUrl: 'https://www.studionoah.jp/kichijoji/',
    businessHoursSummary: '24時間営業',
    is24Hours: true,
    groupBookingRule: '4ヶ月前よりWEB予約可能',
    groupBookingLeadMonths: 4,
    soloBookingRule: '前日21:30よりWEB/電話にて受付開始（バンドスタジオは2名様まで）',
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

  for (const storeDef of NOAH_ALL_STORES) {
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

      const isBoothOnly = roomDef.guitarAmps.length === 0 && !roomDef.bassAmp && !roomDef.drumSet;

      const equipment: RoomEquipment = {
        id: `eq-${roomDef.id}`,
        roomId: roomDef.id,
        guitarAmps: roomDef.guitarAmps,
        bassAmp: roomDef.bassAmp || (isBoothOnly ? '(バンド用アンプ設備なし)' : ''),
        drumSet: roomDef.drumSet || (isBoothOnly ? '(ドラムセットなし)' : ''),
        isTwinPedalAllowed: true,
        additionalNotes: isBoothOnly
          ? '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
          : `サウンドスタジオノア標準高品位機材常設。開始時間: ${roomDef.offset === 30 ? '毎時30分' : '毎時00分'}スタート。`,
      };

      allRoomsWithSlots.push({
        id: roomDef.id,
        studioId: studio.id,
        name: roomDef.name,
        floor: 'B1F-4F',
        sizeTatami: roomDef.tatami,
        capacity: Math.max(2, Math.min(10, Math.floor(roomDef.tatami / 2.2))),
        pricePerHourRegular: roomDef.priceRegular,
        pricePerHourDaytime: roomDef.priceDaytime,
        pricePerHourSolo: roomDef.priceSolo,
        hasMirror: true,
        hasRecording: roomDef.tatami >= 15 || roomDef.name.includes('Rec') || roomDef.name.includes('REC'),
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
