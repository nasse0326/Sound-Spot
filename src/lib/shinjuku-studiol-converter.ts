/**
 * 新宿エリア追加分（2026-09-20）のうち、studi-ol.com ASPを使う3店舗
 * （スタジオミュージアム新宿店・ヒルバレースタジオ・Sound Studio Vantage）用コンバータ。
 * 下北沢エリアのANDY'S/STANDBY/ガードアイランド系（shimokitazawa-studiol-converter.ts）と
 * 同じASP・同じfeatures配列の"BASS::"/"DRUM::"プレフィックス方式を踏襲する。
 */
import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import museumShinjukuJson from '@/data/museum-shinjuku-real.json';
import hillvalleyJson from '@/data/hillvalley-real.json';
import vantageJson from '@/data/vantage-real.json';

export const MUSEUM_SHINJUKU_STUDIO: Studio = {
  id: 'museum-shinjuku',
  name: 'スタジオミュージアム新宿店',
  chainName: 'スタジオミュージアム',
  area: '新宿',
  prefecture: '東京都',
  nearestStation: 'JR新宿駅 南口 徒歩5分',
  address: '東京都渋谷区代々木2-19-5',
  tel: '03-3373-8200',
  bookingUrl: 'https://studi-ol.com/shop/637',
  websiteUrl: 'https://studio-museum.com/',
  businessHoursSummary: '9:00〜24:00',
  is24Hours: false,
  groupBookingRule: 'WEBにて前日から受付可能（電話予約は営業開始30分前から）',
  groupBookingLeadMonths: 1,
  soloBookingRule: '前日からWEB/電話にて受付開始（1人600円/h、土日祝660円/h）',
  soloBookingLeadHours: 24,
};

export const HILLVALLEY_STUDIO: Studio = {
  id: 'hillvalley-studio',
  name: 'ヒルバレースタジオ',
  chainName: 'HILL VALLEY STUDIO',
  area: '新宿',
  prefecture: '東京都',
  nearestStation: '新宿三丁目駅 E1出口 徒歩1分',
  address: '東京都新宿区新宿5-18-20 ルックハイツB1',
  tel: '03-6302-1718',
  bookingUrl: 'https://studi-ol.com/shop/515',
  websiteUrl: 'https://hillvalleystudio.net/',
  businessHoursSummary: '平日12:00〜23:30 / 土日祝10:00〜23:30',
  is24Hours: false,
  groupBookingRule: 'WEB予約は前日24:00まで受付可能（お電話・店頭でも受付）',
  groupBookingLeadMonths: 1,
  soloBookingRule: '前日12:00よりWEB/電話にて受付開始',
  soloBookingLeadHours: 24,
};

export const VANTAGE_STUDIO: Studio = {
  id: 'vantage-studio',
  name: 'Sound Studio Vantage',
  chainName: 'Sound Studio Vantage',
  area: '新宿',
  prefecture: '東京都',
  nearestStation: 'JR大久保駅 南口 徒歩3分',
  address: '東京都新宿区百人町1-23-4 D-SQUARE Shinjuku 8F',
  tel: '03-5989-1877',
  bookingUrl: 'https://studi-ol.com/shop/817',
  websiteUrl: 'http://www.studiovantage.jp/',
  businessHoursSummary: '平日10:00〜23:00 / 土日祝9:00〜24:00',
  is24Hours: false,
  groupBookingRule: '通常予約は2ヶ月先まで可能（WEB/電話/店頭）',
  groupBookingLeadMonths: 2,
  soloBookingRule: '前々日22:00よりWEB/電話にて受付開始',
  soloBookingLeadHours: 48,
};

function buildRoomsFromJson(json: any, studio: Studio, floor: string, orderStart: number): RoomWithSlots[] {
  const results: RoomWithSlots[] = [];
  let order = orderStart;
  const rooms: any[] = json?.rooms || [];

  for (const r of rooms) {
    const slots: AvailabilitySlot[] = (r.slots || []).map((s: any) => ({
      id: s.id,
      roomId: r.id,
      startTime: s.start_time,
      endTime: s.end_time,
      status: s.status === 'AVAILABLE' ? 'available' : 'booked',
    }));

    const features: string[] = r.features || [];
    const guitarAmps = features.filter((f) => !f.startsWith('BASS::') && !f.startsWith('DRUM::'));
    const bassAmp = features.find((f) => f.startsWith('BASS::'))?.replace('BASS::', '') || '';
    const drumSet = features.find((f) => f.startsWith('DRUM::'))?.replace('DRUM::', '') || '';

    const equipment: RoomEquipment = {
      id: `eq-${r.id}`,
      roomId: r.id,
      guitarAmps,
      bassAmp,
      drumSet,
      isTwinPedalAllowed: true,
    };

    results.push({
      id: r.id,
      studioId: studio.id,
      name: r.name,
      floor,
      sizeTatami: Math.round((r.size_sqm || 15) / 1.65),
      capacity: r.capacity,
      pricePerHourRegular: r.hourly_rate,
      pricePerHourDaytime: r.day_rate || r.hourly_rate,
      pricePerHourSolo: r.individual_rate,
      hasMirror: true,
      hasRecording: false,
      startTimeOffset: r.start_time_offset ?? 0,
      orderIndex: order++,
      studio,
      equipment,
      slots,
    });
  }

  return results;
}

export function getMuseumShinjukuRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(museumShinjukuJson, MUSEUM_SHINJUKU_STUDIO, '', 1700).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getHillvalleyRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(hillvalleyJson, HILLVALLEY_STUDIO, 'B1F', 1720).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getVantageRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(vantageJson, VANTAGE_STUDIO, '8F', 1740).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}
