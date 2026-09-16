import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import botIkebukuroJson from '@/data/bot-ikebukuro-real.json';

export const BOT_IKEBUKURO_STUDIO: Studio = {
  id: 'bot-ikebukuro',
  name: 'ベースオントップ 池袋西口店',
  chainName: 'BASS ON TOP',
  area: '池袋',
  prefecture: '東京都',
  nearestStation: '池袋駅 西口 徒歩3分',
  address: '東京都豊島区西池袋1-10-1 ISOビルB1F',
  tel: '03-5992-7720',
  bookingUrl: 'https://studi-ol.com/shop/2355',
  websiteUrl: 'https://www.bassontop.co.jp/band/ikebukuro-nishiguchi/',
  businessHoursSummary: '24時間営業（年末年始は除く）',
  is24Hours: true,
  groupBookingRule: 'WEBにて随時予約受付可能',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日よりWEB/電話にて受付開始 (1名700円/h)',
  soloBookingLeadHours: 24,
};

export function getBotIkebukuroRealRooms(targetDateStr: string): RoomWithSlots[] {
  const results: RoomWithSlots[] = [];
  let order = 900;

  const rooms: any[] = (botIkebukuroJson as any)?.rooms || [];

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
      keyboards: (r.features || []).some((f: string) => f.includes('キーボード')) ? ['キーボード2台常設'] : [],
      additionalNotes: (r.features || []).join('、'),
    };

    results.push({
      id: r.id,
      studioId: BOT_IKEBUKURO_STUDIO.id,
      name: r.name,
      floor: 'B1F',
      sizeTatami: Math.round((r.size_sqm || 15) / 1.65),
      capacity: r.capacity,
      pricePerHourRegular: r.hourly_rate,
      pricePerHourDaytime: r.day_rate || r.hourly_rate,
      pricePerHourSolo: r.individual_rate,
      hasMirror: true,
      hasRecording: false,
      startTimeOffset: r.start_time_offset ?? 0,
      orderIndex: order++,
      studio: BOT_IKEBUKURO_STUDIO,
      equipment,
      slots,
    });
  }

  return results;
}
