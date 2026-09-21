/**
 * 亀戸〜小岩エリア追加分（2026-09-21）用コンバータ。
 * ・Studio DIVO 亀戸: webtoru.com ASP（ログイン不要でカレンダー閲覧可能、自動巡回対応）。
 * ・Studio 2Times: studi-ol.com ASP（ログイン不要でカレンダー閲覧可能、自動巡回対応）。
 * ・SOUND STUDIO M 小岩店: studi-ol.com（無人営業時間帯のみ）とorpheusrecords.info
 *   （有人営業時間帯を含む全日データ）のハイブリッド構成だったため、全日をカバーできる
 *   orpheusrecords.info側を採用（scripts/lib/orpheus-fetcher.ts）。
 * いずれもfeatures配列はBASS::/DRUM::/NOTE::プレフィックス方式（高円寺エリア以降の
 * 各コンバータと同じ）。
 */
import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import studioDivoJson from '@/data/studio-divo-kameido-real.json';
import studio2TimesJson from '@/data/studio-2times-real.json';
import soundStudioMKoiwaJson from '@/data/soundstudio-m-koiwa-real.json';

export const STUDIO_DIVO_KAMEIDO_STUDIO: Studio = {
  id: 'studio-divo-kameido',
  name: 'Studio DIVO 亀戸',
  chainName: 'Studio DIVO',
  area: '亀戸・小岩',
  prefecture: '東京都',
  nearestStation: 'JR亀戸駅 徒歩4分',
  address: '東京都江東区亀戸1-34-11',
  tel: '03-5858-9197',
  bookingUrl: 'https://webtoru.com/shop/169/calendar',
  websiteUrl: 'https://studio-divo.com/',
  businessHoursSummary: '月火水土日14:00〜22:00 / 木13:00〜22:00 / 金13:00〜23:00',
  is24Hours: false,
  groupBookingRule: 'WEBにて24時間予約受付可能（ウェブトル会員登録要）',
  groupBookingLeadMonths: 2,
  soloBookingRule: '平日1週間前、土日祝3日前よりWEB予約可能（平日1週間前予約は要電話）',
  soloBookingLeadHours: 24,
};

export const STUDIO_2TIMES_STUDIO: Studio = {
  id: 'studio-2times',
  name: 'Studio 2Times',
  chainName: 'Studio 2Times',
  area: '亀戸・小岩',
  prefecture: '東京都',
  nearestStation: 'JR小岩駅 南口 徒歩4分',
  address: '東京都江戸川区南小岩8丁目10-2',
  tel: '03-3672-8607',
  bookingUrl: 'https://studi-ol.com/shop/613',
  websiteUrl: 'https://studio2times.fc2.page/',
  businessHoursSummary: '12:00〜24:00（時間外は電話・店頭のみ）',
  is24Hours: false,
  groupBookingRule: 'WEBにて随時予約受付可能（スタジオル会員登録要）',
  groupBookingLeadMonths: 3,
  soloBookingRule: 'WEB予約可能（時間外は電話にて）',
  soloBookingLeadHours: 24,
};

export const SOUND_STUDIO_M_KOIWA_STUDIO: Studio = {
  id: 'soundstudio-m-koiwa',
  name: 'SOUND STUDIO M 小岩店',
  chainName: 'SOUND STUDIO M',
  area: '亀戸・小岩',
  prefecture: '東京都',
  nearestStation: 'JR小岩駅 北口 徒歩3分',
  address: '東京都江戸川区西小岩1-27-16 オルフェウスビル3〜4F',
  tel: '03-3672-6316',
  bookingUrl: 'http://www.orpheusrecords.info/RoomSituation.php?pno=1',
  websiteUrl: 'https://orpheusrecords.jp/ssm/koiwa/',
  businessHoursSummary: '有人：平日12:00〜23:00・土日祝9:00〜23:00 / 無人：平日深夜0:00〜翌12:00・土日祝前日深夜0:00〜翌6:00',
  is24Hours: true,
  groupBookingRule: 'WEBにて随時予約受付可能（有人・無人時間帯とも対応、無人時間帯は別サイト「スタジオル」）',
  groupBookingLeadMonths: 3,
  soloBookingRule: '利用希望時間の24時間前よりWEB予約可能',
  soloBookingLeadHours: 24,
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
    const guitarAmps = features.filter((f) => !f.startsWith('BASS::') && !f.startsWith('DRUM::') && !f.startsWith('NOTE::'));
    const bassAmp = features.find((f) => f.startsWith('BASS::'))?.replace('BASS::', '') || '';
    const drumSet = features.find((f) => f.startsWith('DRUM::'))?.replace('DRUM::', '') || '';
    const additionalNotes = features.filter((f) => f.startsWith('NOTE::')).map((f) => f.replace('NOTE::', '')).join(' / ');

    const equipment: RoomEquipment = {
      id: `eq-${r.id}`,
      roomId: r.id,
      guitarAmps,
      bassAmp,
      drumSet,
      isTwinPedalAllowed: true,
      additionalNotes: additionalNotes || undefined,
    };

    results.push({
      id: r.id,
      studioId: studio.id,
      name: r.name,
      floor: '',
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

export function getStudioDivoKameidoRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(studioDivoJson, STUDIO_DIVO_KAMEIDO_STUDIO, 2500).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getStudio2TimesRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(studio2TimesJson, STUDIO_2TIMES_STUDIO, 2520).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getSoundStudioMKoiwaRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(soundStudioMKoiwaJson, SOUND_STUDIO_M_KOIWA_STUDIO, 2540).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}
