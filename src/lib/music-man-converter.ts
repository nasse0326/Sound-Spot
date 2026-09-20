/**
 * Music man サウンドスタジオ（新宿エリア追加分、2026-09-20）用コンバータ。
 * Reserve1.jp（ReserveMart ASP）のVisitorLogin経由でゲスト閲覧可能なカレンダーを持つ
 * （ゲートウェイ・GOODMAN AKIBAと同じ種類のインスタンス）。5タイプ×2フロア=10部屋、
 * フロア違いの同名部屋（例: Lst / 3-Lst）はreserve1-fetcher.ts側の「フロア番号-」を
 * 含めたroomKey抽出により正しく別部屋として区別・取得している。
 */
import { RoomWithSlots, AvailabilitySlot, RoomEquipment, SlotStatus, Studio } from '@/types/studio';
import musicManDataJson from '@/data/music-man-real.json';

export const MUSIC_MAN_STUDIO: Studio = {
  id: musicManDataJson.id,
  name: musicManDataJson.name,
  chainName: musicManDataJson.chain_name,
  area: musicManDataJson.area,
  prefecture: musicManDataJson.prefecture,
  nearestStation: musicManDataJson.nearest_station,
  address: musicManDataJson.address,
  tel: musicManDataJson.tel,
  bookingUrl: musicManDataJson.booking_url,
  websiteUrl: musicManDataJson.url,
  businessHoursSummary: musicManDataJson.business_hours_summary,
  is24Hours: musicManDataJson.is_24hours,
  groupBookingRule: musicManDataJson.group_booking_rule,
  groupBookingLeadMonths: musicManDataJson.group_booking_lead_months,
  soloBookingRule: musicManDataJson.solo_booking_rule,
  soloBookingLeadHours: musicManDataJson.solo_booking_lead_hours,
};

export function getMusicManRealRooms(targetDate: string): RoomWithSlots[] {
  const result: RoomWithSlots[] = [];

  for (let idx = 0; idx < musicManDataJson.rooms.length; idx++) {
    const r: any = musicManDataJson.rooms[idx];

    const equipment: RoomEquipment = {
      id: `eq-${r.id}`,
      roomId: r.id,
      guitarAmps: r.features.filter((f: string) => !f.startsWith('BASS::') && !f.startsWith('DRUM::') && !f.startsWith('PA::') && !f.startsWith('NOTE::')),
      bassAmp: r.features.find((f: string) => f.startsWith('BASS::'))?.replace('BASS::', '') || '',
      drumSet: r.features.find((f: string) => f.startsWith('DRUM::'))?.replace('DRUM::', '') || '',
      isTwinPedalAllowed: true,
      additionalNotes: r.features.find((f: string) => f.startsWith('NOTE::'))?.replace('NOTE::', '') || '',
    };

    const matchingSlots = (r.slots || []).filter((s: any) => s.start_time.startsWith(targetDate));
    const slots: AvailabilitySlot[] = matchingSlots.map((slot: any) => ({
      id: slot.id,
      roomId: r.id,
      startTime: slot.start_time,
      endTime: slot.end_time,
      status: slot.status.toLowerCase() as SlotStatus,
    }));

    result.push({
      id: r.id,
      studioId: MUSIC_MAN_STUDIO.id,
      name: r.name,
      floor: r.floor || '',
      sizeTatami: r.size_tatami,
      capacity: r.capacity,
      pricePerHourRegular: r.hourly_rate,
      pricePerHourDaytime: r.day_rate || r.hourly_rate,
      pricePerHourSolo: r.individual_rate,
      hasMirror: true,
      hasRecording: false,
      startTimeOffset: r.start_time_offset || 0,
      orderIndex: idx,
      studio: MUSIC_MAN_STUDIO,
      equipment,
      slots,
    });
  }

  return result;
}
