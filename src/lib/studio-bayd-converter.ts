/**
 * STUDIO BAYD 高円寺店（高円寺エリア追加分、2026-09-20）用コンバータ。
 * WnSpaceMusic（studi-ol.com/Reserve1.jpとは別の独自予約プラットフォーム）のログイン不要な
 * 公開REST APIから直接取得した確定予約データをもとに、scripts/wnspace-fetcher.tsが
 * 24時間分の空き/予約済みスロットを算出済みの状態でJSONに書き出している。
 */
import { RoomWithSlots, AvailabilitySlot, RoomEquipment, SlotStatus, Studio } from '@/types/studio';
import studioBaydKoenjiDataJson from '@/data/studio-bayd-koenji-real.json';

export const STUDIO_BAYD_KOENJI_STUDIO: Studio = {
  id: studioBaydKoenjiDataJson.id,
  name: studioBaydKoenjiDataJson.name,
  chainName: studioBaydKoenjiDataJson.chain_name,
  area: studioBaydKoenjiDataJson.area,
  prefecture: studioBaydKoenjiDataJson.prefecture,
  nearestStation: studioBaydKoenjiDataJson.nearest_station,
  address: studioBaydKoenjiDataJson.address,
  tel: studioBaydKoenjiDataJson.tel,
  bookingUrl: studioBaydKoenjiDataJson.booking_url,
  websiteUrl: studioBaydKoenjiDataJson.url,
  businessHoursSummary: studioBaydKoenjiDataJson.business_hours_summary,
  is24Hours: studioBaydKoenjiDataJson.is_24hours,
  groupBookingRule: studioBaydKoenjiDataJson.group_booking_rule,
  groupBookingLeadMonths: studioBaydKoenjiDataJson.group_booking_lead_months,
  soloBookingRule: studioBaydKoenjiDataJson.solo_booking_rule,
  soloBookingLeadHours: studioBaydKoenjiDataJson.solo_booking_lead_hours,
};

export function getStudioBaydKoenjiRealRooms(targetDate: string): RoomWithSlots[] {
  const result: RoomWithSlots[] = [];

  for (let idx = 0; idx < studioBaydKoenjiDataJson.rooms.length; idx++) {
    const r: any = studioBaydKoenjiDataJson.rooms[idx];

    const equipment: RoomEquipment = {
      id: `eq-${r.id}`,
      roomId: r.id,
      guitarAmps: r.features.filter((f: string) => !f.startsWith('BASS::') && !f.startsWith('DRUM::') && !f.startsWith('PA::') && !f.startsWith('NOTE::')),
      bassAmp: r.features.find((f: string) => f.startsWith('BASS::'))?.replace('BASS::', '') || '',
      drumSet: r.features.find((f: string) => f.startsWith('DRUM::'))?.replace('DRUM::', '') || '',
      isTwinPedalAllowed: true,
      additionalNotes: r.features.filter((f: string) => f.startsWith('NOTE::')).map((f: string) => f.replace('NOTE::', '')).join(' / ') || undefined,
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
      studioId: STUDIO_BAYD_KOENJI_STUDIO.id,
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
      orderIndex: 2020 + idx,
      studio: STUDIO_BAYD_KOENJI_STUDIO,
      equipment,
      slots,
    });
  }

  return result;
}
