/**
 * 高円寺エリア追加分（2026-09-20）のうち、studi-ol.com ASPを使う6店舗
 * （Sound Studio DOM / P.I.G.Studio / SONIC BAND STUDIO / スタジオ・コヤーマ本店・R店 /
 * MUSIRA Studio）用コンバータ。下北沢・新宿エリアの既存studi-ol系コンバータと同じASPだが、
 * features配列は"BASS::"/"DRUM::"に加えて"NOTE::"（常設ピアノ・レコーディング対応等の
 * 補足情報）も使うため、NOTE::を見落としてguitarAmpsに混入させるバグ（Music manの
 * music-man-converter.tsで過去に発生）を避けるため、NOTE::も明示的に除外・振り分けする。
 */
import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import soundStudioDomJson from '@/data/sound-studio-dom-real.json';
import pigStudioJson from '@/data/pig-studio-real.json';
import sonicBandStudioJson from '@/data/sonic-band-studio-real.json';
import koyamaMainJson from '@/data/koyama-main-real.json';
import koyamaRJson from '@/data/koyama-r-real.json';
import musiraJson from '@/data/musira-real.json';

export const SOUND_STUDIO_DOM_STUDIO: Studio = {
  id: 'sound-studio-dom',
  name: 'Sound Studio DOM',
  chainName: 'Sound Studio DOM',
  area: '高円寺',
  prefecture: '東京都',
  nearestStation: '高円寺駅 徒歩1分',
  address: '東京都杉並区高円寺南4-25-7 五明堂駅前ビル3F',
  tel: '03-3318-3569',
  bookingUrl: 'https://studi-ol.com/shop/550',
  websiteUrl: 'https://soundstudiodom.com/',
  businessHoursSummary: '24時間営業（0時〜14時は無人営業）',
  is24Hours: true,
  groupBookingRule: 'バンド・グループ練習はWEB/電話/店頭で3ヶ月先まで予約可能',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日・当日のみWEB/電話にて受付',
  soloBookingLeadHours: 24,
};

export const PIG_STUDIO_STUDIO: Studio = {
  id: 'pig-studio',
  name: 'P.I.G.Studio',
  chainName: 'P.I.G.Studio',
  area: '高円寺',
  prefecture: '東京都',
  nearestStation: '高円寺駅 徒歩3分',
  address: '東京都杉並区高円寺北2-2-1 巳善ビル B1階',
  tel: '03-3310-9311',
  bookingUrl: 'https://studi-ol.com/shop/626',
  websiteUrl: 'https://pig-studio.info/',
  businessHoursSummary: '24時間営業・年中無休（完全無人）',
  is24Hours: true,
  groupBookingRule: 'WEBにて随時予約受付可能（スタジオル会員登録要）',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日10:00よりWEB予約または当日予約のみ',
  soloBookingLeadHours: 24,
};

export const SONIC_BAND_STUDIO_STUDIO: Studio = {
  id: 'sonic-band-studio',
  name: 'SONIC BAND STUDIO',
  chainName: 'SONIC BAND STUDIO',
  area: '高円寺',
  prefecture: '東京都',
  nearestStation: 'JR高円寺駅 北口 徒歩7分',
  address: '東京都杉並区高円寺北',
  tel: '03-3223-1009',
  bookingUrl: 'https://studi-ol.com/shop/623',
  websiteUrl: 'https://sonicbandstudio.com/pc/',
  businessHoursSummary: '10:00〜24:00',
  is24Hours: false,
  groupBookingRule: 'WEBにて随時予約受付可能',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日10:00よりWEB予約可能（3名まで）',
  soloBookingLeadHours: 24,
};

export const KOYAMA_MAIN_STUDIO: Studio = {
  id: 'koyama-main',
  name: 'スタジオ・コヤーマ本店',
  chainName: 'スタジオ・コヤーマ',
  area: '高円寺',
  prefecture: '東京都',
  nearestStation: '高円寺駅 北口',
  address: '東京都杉並区高円寺北2-18-7 千恵ビルB1',
  tel: '03-5373-8248',
  bookingUrl: 'https://studi-ol.com/shop/2245',
  websiteUrl: 'https://s-kym.com/',
  businessHoursSummary: '10:00〜24:00',
  is24Hours: false,
  groupBookingRule: 'WEBにて随時予約受付可能（ネット予約5%割引）',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日0時よりWEB/電話にて受付開始',
  soloBookingLeadHours: 24,
};

export const KOYAMA_R_STUDIO: Studio = {
  id: 'koyama-r',
  name: 'スタジオ・コヤーマR店',
  chainName: 'スタジオ・コヤーマ',
  area: '高円寺',
  prefecture: '東京都',
  nearestStation: '高円寺駅 北口',
  address: '東京都杉並区高円寺北2-21-1 リリーベル高円寺スクエアB1',
  tel: '03-5373-8248',
  bookingUrl: 'https://studi-ol.com/shop/812',
  websiteUrl: 'https://s-kym.com/',
  businessHoursSummary: '10:00〜24:00（無人営業）',
  is24Hours: false,
  groupBookingRule: 'ネット予約のみ（電話・店頭予約不可）',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日0時よりWEB予約のみ',
  soloBookingLeadHours: 24,
};

export const MUSIRA_STUDIO: Studio = {
  id: 'musira',
  name: 'MUSIRA Studio',
  chainName: 'MUSIRA Studio',
  area: '高円寺',
  prefecture: '東京都',
  nearestStation: '新高円寺駅 すぐそば',
  address: '東京都杉並区高円寺南3-1-4 キングスコート2 B1F',
  tel: '03-3316-3061',
  bookingUrl: 'https://studi-ol.com/shop/703',
  websiteUrl: 'https://musira.jp/',
  businessHoursSummary: '平日15:00〜翌15:00 / 土日祝10:00〜翌10:00（一部時間帯は無人）',
  is24Hours: true,
  groupBookingRule: 'WEBにて24時間予約受付可能（スタジオル会員登録要）',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日12:00よりWEB/電話にて受付開始',
  soloBookingLeadHours: 24,
};

const STUDIO_FLOOR: Record<string, string> = {
  'sound-studio-dom': '3F',
  'pig-studio': 'B1F',
  'sonic-band-studio': '',
  'koyama-main': 'B1F',
  'koyama-r': 'B1F',
  'musira': 'B1F',
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
      status: s.status === 'AVAILABLE' ? 'available' : (s.status === 'MAINTENANCE' ? 'maintenance' : 'booked'),
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
      floor: STUDIO_FLOOR[studio.id] || '',
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

export function getSoundStudioDomRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(soundStudioDomJson, SOUND_STUDIO_DOM_STUDIO, 1900).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getPigStudioRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(pigStudioJson, PIG_STUDIO_STUDIO, 1920).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getSonicBandStudioRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(sonicBandStudioJson, SONIC_BAND_STUDIO_STUDIO, 1940).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getKoyamaMainRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(koyamaMainJson, KOYAMA_MAIN_STUDIO, 1960).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getKoyamaRRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(koyamaRJson, KOYAMA_R_STUDIO, 1980).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getMusiraRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(musiraJson, MUSIRA_STUDIO, 2000).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}
