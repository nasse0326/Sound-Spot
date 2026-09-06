import { RoomWithSlots, AvailabilitySlot, RoomEquipment, SlotStatus, Studio } from '@/types/studio';
import gatewayDataJson from '@/data/gateway-shibuya-real.json';

export const GATEWAY_SHIBUYA_STUDIO: Studio = {
  id: gatewayDataJson.id,
  name: gatewayDataJson.name,
  chainName: gatewayDataJson.chain_name,
  area: gatewayDataJson.area,
  prefecture: gatewayDataJson.prefecture,
  nearestStation: gatewayDataJson.nearest_station,
  address: gatewayDataJson.address,
  tel: gatewayDataJson.tel,
  bookingUrl: gatewayDataJson.booking_url,
  websiteUrl: gatewayDataJson.url,
  businessHoursSummary: gatewayDataJson.business_hours_summary,
  is24Hours: gatewayDataJson.is_24hours,
  groupBookingRule: gatewayDataJson.group_booking_rule,
  groupBookingLeadMonths: gatewayDataJson.group_booking_lead_months,
  soloBookingRule: gatewayDataJson.solo_booking_rule,
  soloBookingLeadHours: gatewayDataJson.solo_booking_lead_hours,
};

export function getGatewayShibuyaRealRooms(targetDate: string): RoomWithSlots[] {
  const result: RoomWithSlots[] = [];

  for (let idx = 0; idx < gatewayDataJson.rooms.length; idx++) {
    const r = gatewayDataJson.rooms[idx];

    // 機材情報の整形
    const equipment: RoomEquipment = {
      id: `eq-${r.id}`,
      roomId: r.id,
      guitarAmps: r.features.filter((f: string) =>
        f.includes('Marshall') || f.includes('JC-120') || f.includes('アンプ') || f.includes('Fender') || f.includes('Mesa')
      ),
      bassAmp: r.features.find((f: string) => f.includes('Ampeg') || f.includes('Hartke')) || 'Ampeg / Hartke Bass Amp',
      drumSet: r.features.find((f: string) => f.includes('Drums') || f.includes('Pearl') || f.includes('Canopus')) || (r.name.includes('ドラム無し') ? 'ドラムなし' : 'Standard Drum Set'),
      isTwinPedalAllowed: !r.name.includes('ドラム無し'),
      keyboards: r.features.filter((f: string) => f.includes('ピアノ') || f.includes('キーボード') || f.includes('STAGE')),
      additionalNotes: r.features.join('、'),
    };

    // スロットの取得（targetDate と一致する実データのみ取得。日付投影フォールバックは完全撤廃）
    const matchingSlots = r.slots.filter((s: any) => s.start_time.startsWith(targetDate));

    const slots: AvailabilitySlot[] = matchingSlots.map((slot: any) => ({
      id: slot.id,
      roomId: r.id,
      startTime: slot.start_time,
      endTime: slot.end_time,
      status: slot.status.toLowerCase() as SlotStatus,
    }));

    result.push({
      id: r.id,
      studioId: GATEWAY_SHIBUYA_STUDIO.id,
      name: r.name,
      sizeTatami: r.size_tatami,
      capacity: r.capacity,
      pricePerHourRegular: r.hourly_rate || 2420,
      pricePerHourDaytime: r.day_rate || 1870,
      pricePerHourSolo: r.individual_rate || 770,
      hasMirror: true,
      hasRecording: r.features.some((f: string) => f.includes('レコ') || f.includes('録音')),
      startTimeOffset: (r.start_time_offset === 30 ? 30 : 0) as 0 | 30,
      orderIndex: idx,
      studio: GATEWAY_SHIBUYA_STUDIO,
      equipment,
      slots,
    });
  }

  return result;
}
