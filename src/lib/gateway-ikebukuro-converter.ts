import { RoomWithSlots, AvailabilitySlot, RoomEquipment, SlotStatus, Studio } from '@/types/studio';
import gatewayIkeJson from '@/data/gateway-ikebukuro-real.json';

export const GATEWAY_IKEBUKURO_STUDIO: Studio = {
  id: gatewayIkeJson.id,
  name: gatewayIkeJson.name,
  chainName: gatewayIkeJson.chain_name,
  area: gatewayIkeJson.area,
  prefecture: gatewayIkeJson.prefecture,
  nearestStation: gatewayIkeJson.nearest_station,
  address: gatewayIkeJson.address,
  tel: gatewayIkeJson.tel,
  bookingUrl: gatewayIkeJson.booking_url,
  websiteUrl: gatewayIkeJson.url,
  businessHoursSummary: gatewayIkeJson.business_hours_summary,
  is24Hours: gatewayIkeJson.is_24hours,
  groupBookingRule: gatewayIkeJson.group_booking_rule,
  groupBookingLeadMonths: gatewayIkeJson.group_booking_lead_months,
  soloBookingRule: gatewayIkeJson.solo_booking_rule,
  soloBookingLeadHours: gatewayIkeJson.solo_booking_lead_hours,
};

export function getGatewayIkebukuroRealRooms(targetDate: string): RoomWithSlots[] {
  const result: RoomWithSlots[] = [];

  for (let idx = 0; idx < gatewayIkeJson.rooms.length; idx++) {
    const r: any = gatewayIkeJson.rooms[idx];

    const equipment: RoomEquipment = {
      id: `eq-${r.id}`,
      roomId: r.id,
      guitarAmps: r.features.filter((f: string) =>
        f.includes('Marshall') || f.includes('JC-120') || f.includes('Fender') || f.includes('Mesa')
      ),
      bassAmp: r.features.find((f: string) => f.includes('Ampeg') || f.includes('Hartke')) || '',
      drumSet: r.features.find((f: string) => f.includes('Pearl') || f.includes('ドラム')) || '',
      keyboards: [],
      isTwinPedalAllowed: true,
      additionalNotes: r.features.join('、'),
    };

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
      studioId: GATEWAY_IKEBUKURO_STUDIO.id,
      name: r.name,
      sizeTatami: r.size_tatami,
      capacity: r.capacity,
      pricePerHourRegular: r.hourly_rate,
      pricePerHourDaytime: r.day_rate,
      pricePerHourSolo: r.individual_rate,
      hasMirror: true,
      hasRecording: r.features.some((f: string) => f.includes('レコ') || f.includes('録音')),
      startTimeOffset: r.start_time_offset,
      orderIndex: idx,
      studio: GATEWAY_IKEBUKURO_STUDIO,
      equipment,
      slots,
    });
  }

  return result;
}
