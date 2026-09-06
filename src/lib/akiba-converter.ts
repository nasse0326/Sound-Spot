import { RoomWithSlots, AvailabilitySlot, RoomEquipment, SlotStatus, Studio } from '@/types/studio';
import akibaDataJson from '@/data/akihabara-real.json';

export const AKIBA_STUDIOS: Studio[] = akibaDataJson.map((s) => ({
  id: s.id,
  name: s.name,
  chainName: s.name.includes('ノア')
    ? 'SOUND STUDIO NOAH'
    : s.name.includes('ベースオントップ')
    ? 'BASS ON TOP'
    : s.name.toUpperCase().includes('GOODMAN') || s.name.includes('グッドマン')
    ? 'STUDIO GOODMAN'
    : 'スタジオ音楽館',
  area: '秋葉原',
  prefecture: '東京都',
  nearestStation: s.name.includes('ベースオントップ')
    ? '秋葉原駅 昭和通り口 徒歩2分'
    : s.name.includes('音楽館')
    ? '秋葉原駅 電気街口 徒歩2分'
    : s.name.toUpperCase().includes('GOODMAN') || s.name.includes('グッドマン')
    ? '秋葉原駅 昭和通り口 徒歩5分'
    : '末広町駅 徒歩1分 / 秋葉原駅 徒歩6分',
  address: s.address,
  tel: s.tel,
  bookingUrl: s.affiliate_url || s.url,
  websiteUrl: s.url,
  businessHoursSummary: s.name.includes('ノア')
    ? '24時間営業 (朝6時〜モーニング枠あり)'
    : s.name.includes('ベースオントップ')
    ? '土日祝 9:00〜翌5:00 / 平日 10:00〜翌5:00'
    : s.name.includes('音楽館')
    ? '通常 10:00〜23:30 (予約により24時間営業対応)'
    : '土日祝 11:00〜23:00 / 平日 15:00〜23:00',
  is24Hours: s.name.includes('ノア') || s.name.includes('ベースオントップ') || s.name.includes('音楽館'),
  groupBookingRule: 'WEBにて予約受付可能',
  groupBookingLeadMonths: 3,
  soloBookingRule: s.name.includes('音楽館')
    ? '前日21:00よりWEB/電話にて受付開始'
    : s.name.includes('ベースオントップ')
    ? '前日12:00よりWEBにて受付開始'
    : s.name.toUpperCase().includes('GOODMAN') || s.name.includes('グッドマン')
    ? '当日10:00（平日3日前）よりWEB受付開始'
    : '前日21:00よりWEB受付開始',
  soloBookingLeadHours: 24,
}));

export function getAkihabaraRealRooms(targetDate: string): RoomWithSlots[] {
  const result: RoomWithSlots[] = [];

  for (let idx = 0; idx < akibaDataJson.length; idx++) {
    const s = akibaDataJson[idx];
    const studio = AKIBA_STUDIOS[idx];

    for (const r of s.rooms) {
      // 帖数の抽出
      const tatamiMatch = r.name.match(/(\d+(?:\.\d+)?)帖/);
      const sizeTatami = tatamiMatch ? parseFloat(tatamiMatch[1]) : Math.round(r.size_sqm / 1.65);

      // 機材情報の整形
      const equipment: RoomEquipment = {
        id: `eq-${r.id}`,
        roomId: r.id,
        guitarAmps: r.features.filter((f: string) => f.includes('Marshall') || f.includes('JC-120') || f.includes('アンプ') || f.includes('Fender')),
        bassAmp: r.features.find((f: string) => f.includes('Ampeg') || f.includes('Mark bass')) || 'Ampeg / Bass Amp',
        drumSet: r.features.find((f: string) => f.includes('Drums') || f.includes('Pearl') || f.includes('Canopus')) || 'Standard Drum Set',
        isTwinPedalAllowed: true,
        keyboards: r.features.filter((f: string) => f.includes('ピアノ') || f.includes('キーボード')),
        additionalNotes: r.features.join('、'),
      };

      // スロット変換（targetDate と一致する実データのみ取得。日付投影フォールバックは完全撤廃）
      const matchingSlots = (r.slots || []).filter((slot: any) =>
        slot.start_time.startsWith(targetDate)
      );

      const slots: AvailabilitySlot[] = matchingSlots.map((slot: any) => ({
        id: `slot-${r.id}-${slot.id}`,
        roomId: r.id,
        startTime: slot.start_time.includes('+') ? slot.start_time : `${slot.start_time}+09:00`,
        endTime: slot.end_time.includes('+') ? slot.end_time : `${slot.end_time}+09:00`,
        status: slot.status.toLowerCase() as SlotStatus,
      }));

      result.push({
        id: r.id,
        studioId: studio.id,
        name: r.name,
        sizeTatami,
        capacity: r.capacity,
        pricePerHourRegular: r.hourly_rate || 2000,
        pricePerHourDaytime: (r as any).day_rate || r.hourly_rate || 2000,
        pricePerHourSolo: r.individual_rate || 800,
        hasMirror: true,
        hasRecording: r.features.some((f: string) => f.includes('レコーディング') || f.includes('録音')),
        startTimeOffset: (r.start_time_offset === 30 ? 30 : 0) as 0 | 30,
        orderIndex: result.length,
        imageUrl: s.name.includes('ノア')
          ? 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80'
          : s.name.includes('ベースオントップ')
          ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80'
          : s.name.includes('グッドマン')
          ? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
        studio,
        equipment,
        slots,
      });
    }
  }

  return result;
}
