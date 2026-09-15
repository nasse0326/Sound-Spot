import { RoomWithSlots, AvailabilitySlot, RoomEquipment, SlotStatus, Studio } from '@/types/studio';
import gatewayBabaJson from '@/data/gateway-takadanobaba-real.json';

export const GATEWAY_TAKADANOBABA_STUDIO: Studio = {
  id: gatewayBabaJson.id,
  name: gatewayBabaJson.name,
  chainName: gatewayBabaJson.chain_name,
  area: gatewayBabaJson.area,
  prefecture: gatewayBabaJson.prefecture,
  nearestStation: gatewayBabaJson.nearest_station,
  address: gatewayBabaJson.address,
  tel: gatewayBabaJson.tel,
  bookingUrl: gatewayBabaJson.booking_url,
  websiteUrl: gatewayBabaJson.url,
  businessHoursSummary: gatewayBabaJson.business_hours_summary,
  is24Hours: gatewayBabaJson.is_24hours,
  groupBookingRule: gatewayBabaJson.group_booking_rule,
  groupBookingLeadMonths: gatewayBabaJson.group_booking_lead_months,
  soloBookingRule: gatewayBabaJson.solo_booking_rule,
  soloBookingLeadHours: gatewayBabaJson.solo_booking_lead_hours,
};

export function getGatewayTakadanobabaRealRooms(targetDate: string): RoomWithSlots[] {
  const result: RoomWithSlots[] = [];

  for (let idx = 0; idx < gatewayBabaJson.rooms.length; idx++) {
    const r: any = gatewayBabaJson.rooms[idx];

    const equipment: RoomEquipment = {
      id: `eq-${r.id}`,
      roomId: r.id,
      guitarAmps: r.features.filter((f: string) =>
        f.includes('Marshall') || f.includes('JC-120') || f.includes('Fender') || f.includes('Mesa') || f.includes('HUGHES')
      ),
      bassAmp: r.features.find((f: string) => f.includes('Ampeg') || f.includes('Hartke')) || 'Ampeg / Hartke Bass Amp',
      drumSet: r.features.find((f: string) => f.includes('Drums') || f.includes('ドラム')) || 'Pearl Drums',
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
      studioId: GATEWAY_TAKADANOBABA_STUDIO.id,
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
      studio: GATEWAY_TAKADANOBABA_STUDIO,
      equipment,
      slots,
    });
  }

  return result;
}
