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

    // スロットの取得（指定日付に合わせる）
    // gatewayDataJson に targetDate のスロットがあるか確認
    const matchingSlots = r.slots.filter((s: any) => s.start_time.startsWith(targetDate));

    let slots: AvailabilitySlot[] = [];
    if (matchingSlots.length > 0) {
      slots = matchingSlots.map((slot: any) => ({
        id: slot.id,
        roomId: r.id,
        startTime: slot.start_time,
        endTime: slot.end_time,
        status: slot.status.toLowerCase() as SlotStatus,
      }));
    } else {
      // 日付がスクレイピング範囲外の場合は、本日(2026-09-06)のスロットパターンを対象日付に投影
      const fallbackSlots = r.slots.filter((s: any) => s.start_time.startsWith('2026-09-06'));
      slots = fallbackSlots.map((slot: any) => {
        const timePartStart = slot.start_time.split('T')[1];
        const timePartEnd = slot.end_time.split('T')[1];
        return {
          id: `slot-${r.id}-${targetDate}-${slot.id.split('-').pop()}`,
          roomId: r.id,
          startTime: `${targetDate}T${timePartStart}`,
          endTime: `${targetDate}T${timePartEnd}`,
          status: slot.status.toLowerCase() as SlotStatus,
        };
      });
    }

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
