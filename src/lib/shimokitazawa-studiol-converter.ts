/**
 * 下北沢エリアの非NOAHチェーン（ANDY'S STUDIO / STANDBY MUSIC STUDIO / ガードアイランドスタジオ
 * 下北沢ウエスト店・南口店）用コンバータ。いずれもBASS ON TOPと同じstudi-ol.com ASPを使うが
 * 別ブランドのため、features配列は他店舗の"Ampeg/Hartke/Drums"キーワード一致方式ではなく
 * "BASS::"/"DRUM::"プレフィックス方式にしている（ALBIT/GALLIEN-KRUEGER/Trace Elliot等、
 * キーワード一致では拾えないブランドを正確にbassAmp/drumSetへ振り分けるため）。
 */
import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import andysJson from '@/data/andys-real.json';
import standbyJson from '@/data/standby-real.json';
import gourdislandWestJson from '@/data/gourdisland-west-real.json';
import gourdislandSouthJson from '@/data/gourdisland-south-real.json';

export const ANDYS_STUDIO: Studio = {
  id: 'andys-studio',
  name: "ANDY'S STUDIO",
  chainName: "ANDY'S STUDIO",
  area: '下北沢',
  prefecture: '東京都',
  nearestStation: '下北沢駅 徒歩5分',
  address: '東京都世田谷区代沢5-29-15 SYビル2F',
  tel: '03-5432-3805',
  bookingUrl: 'https://studi-ol.com/shop/587',
  websiteUrl: 'http://www.andys.jp/',
  businessHoursSummary: '11:00〜24:00',
  is24Hours: false,
  groupBookingRule: 'WEBにて随時予約受付可能',
  groupBookingLeadMonths: 3,
  soloBookingRule: '個人練習はWEB予約不可・当日お電話のみ',
  soloBookingLeadHours: 0,
};

export const STANDBY_STUDIO: Studio = {
  id: 'standby-studio',
  name: 'STANDBY MUSIC STUDIO',
  chainName: 'STANDBY MUSIC STUDIO',
  area: '下北沢',
  prefecture: '東京都',
  nearestStation: '下北沢駅 徒歩1分',
  address: '東京都世田谷区北沢2丁目12-10 SSビル1階',
  tel: '03-5481-7433',
  bookingUrl: 'https://studi-ol.com/shop/767',
  websiteUrl: 'https://standby-studio.com/',
  businessHoursSummary: '10:00〜23:00',
  is24Hours: false,
  groupBookingRule: 'WEBにて随時予約受付可能',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日21:00よりWEB/電話にて受付開始',
  soloBookingLeadHours: 27,
};

export const GOURDISLAND_WEST_STUDIO: Studio = {
  id: 'gourdisland-west-studio',
  name: 'ガードアイランドスタジオ 下北沢ウエスト店',
  chainName: 'Gourdisland Studio',
  area: '下北沢',
  prefecture: '東京都',
  nearestStation: '下北沢駅 西口 徒歩0分',
  address: '東京都世田谷区北沢2-23-10',
  tel: '03-5430-3334',
  bookingUrl: 'https://studi-ol.com/shop/539',
  websiteUrl: 'http://gourdisland-music.jp/shimokitawest/',
  businessHoursSummary: '24時間営業（予約なしの場合23:00閉店）',
  is24Hours: true,
  groupBookingRule: 'WEBにて随時予約受付可能',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日10:00よりWEB/電話にて受付開始',
  soloBookingLeadHours: 14,
};

export const GOURDISLAND_SOUTH_STUDIO: Studio = {
  id: 'gourdisland-south-studio',
  name: 'ガードアイランドスタジオ 下北沢南口店',
  chainName: 'Gourdisland Studio',
  area: '下北沢',
  prefecture: '東京都',
  nearestStation: '下北沢駅 徒歩2分',
  address: '東京都世田谷区北沢2-13-6 3F',
  tel: '03-3414-9833',
  bookingUrl: 'https://studi-ol.com/shop/591',
  websiteUrl: 'http://gourdisland-music.jp/shimokitazawa/',
  businessHoursSummary: '平日10:00〜23:00 / 土日祝9:00〜22:00',
  is24Hours: false,
  groupBookingRule: 'WEBにて随時予約受付可能',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日10:00よりWEB/電話にて受付開始',
  soloBookingLeadHours: 14,
};

const STUDIO_FLOOR: Record<string, string> = {
  'andys-studio': '2F',
  'standby-studio': '1F',
  'gourdisland-west-studio': 'B1F',
  'gourdisland-south-studio': '3F',
};

function buildRoomsFromJson(json: any, studio: Studio, orderStart: number): RoomWithSlots[] {
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
      floor: STUDIO_FLOOR[studio.id] || '',
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

/**
 * 全て未来日程を含むslotsをそのまま返す（他コンバータのdateStrフィルタと違い、
 * targetDateStrで絞り込むのは呼び出し側のfilterAvailableRooms等が担う既存設計に合わせる）
 */
export function getAndysRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(andysJson, ANDYS_STUDIO, 1600).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getStandbyRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(standbyJson, STANDBY_STUDIO, 1620).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getGourdislandWestRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(gourdislandWestJson, GOURDISLAND_WEST_STUDIO, 1640).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getGourdislandSouthRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(gourdislandSouthJson, GOURDISLAND_SOUTH_STUDIO, 1660).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}
