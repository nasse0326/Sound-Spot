import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import botBabaJson from '@/data/bot-takadanobaba-real.json';

export const BOT_TAKADANOBABA_STUDIO: Studio = {
  id: 'bot-takadanobaba',
  name: 'ベースオントップ 高田馬場店',
  chainName: 'BASS ON TOP',
  area: '高田馬場',
  prefecture: '東京都',
  nearestStation: '高田馬場駅 戸山口 徒歩1分',
  address: '東京都新宿区高田馬場1-33-14 サンフラワービル4F',
  tel: '03-3203-9502',
  bookingUrl: 'https://studi-ol.com/shop/681',
  websiteUrl: 'https://www.bassontop.co.jp/band/takadanobaba/',
  businessHoursSummary: '24時間営業（年末年始は除く）',
  is24Hours: true,
  groupBookingRule: 'WEBにて随時予約受付可能',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日よりWEB/電話にて受付開始 (1〜2名700円/h)',
  soloBookingLeadHours: 24,
};

export function getBotTakadanobabaRealRooms(targetDateStr: string): RoomWithSlots[] {
  const results: RoomWithSlots[] = [];
  let order = 800;

  const rooms: any[] = (botBabaJson as any)?.rooms || [];

  for (const r of rooms) {
    const slots: AvailabilitySlot[] = (r.slots || [])
      .filter((s: any) => s.start_time.startsWith(targetDateStr))
      .map((s: any) => ({
        id: s.id,
        roomId: r.id,
        startTime: s.start_time,
        endTime: s.end_time,
        status: s.status === 'AVAILABLE' ? 'available' : 'booked',
      }));

    const equipment: RoomEquipment = {
      id: `eq-${r.id}`,
      roomId: r.id,
      guitarAmps: (r.features || []).filter((f: string) => f.includes('Marshall') || f.includes('JC-120') || f.includes('Fender')),
      bassAmp: (r.features || []).find((f: string) => f.includes('Ampeg') || f.includes('Hartke')) || 'Ampeg / Hartke Bass Amp',
      drumSet: (r.features || []).find((f: string) => f.includes('Drums') || f.includes('dw')) || 'Pearl Drums',
      isTwinPedalAllowed: true,
      additionalNotes: (r.features || []).join('、'),
    };

    results.push({
      id: r.id,
      studioId: BOT_TAKADANOBABA_STUDIO.id,
      name: r.name,
      floor: '4F',
      sizeTatami: Math.round((r.size_sqm || 15) / 1.65),
      capacity: r.capacity,
      pricePerHourRegular: r.hourly_rate,
      pricePerHourDaytime: r.day_rate || r.hourly_rate,
      pricePerHourSolo: r.individual_rate,
      hasMirror: true,
      hasRecording: r.name?.includes('505') || r.name?.includes('506'),
      startTimeOffset: r.start_time_offset ?? 0,
      orderIndex: order++,
      studio: BOT_TAKADANOBABA_STUDIO,
      equipment,
      slots,
    });
  }

  return results;
}
