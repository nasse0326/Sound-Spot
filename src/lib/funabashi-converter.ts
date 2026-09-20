/**
 * 船橋エリア追加分（2026-09-20）用コンバータ。
 * ・STUDIO SUN西船橋店: webtoru.com ASP（ログイン不要でカレンダー閲覧可能、自動巡回対応）。
 *   features配列はBASS::/DRUM::/NOTE::プレフィックス方式（高円寺エリアの各コンバータと同じ）。
 * ・スタジオパックス船橋店: Web予約は会員ログイン必須（ゲスト閲覧不可）のため自動巡回非対応。
 *   BAZOOKA STUDIO/Vivo Sound Studioと同じく、部屋情報のみを静的に掲載する（slotsは常に空配列）。
 */
import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import studioSunJson from '@/data/studiosun-nishifunabashi-real.json';

export const STUDIOSUN_NISHIFUNABASHI_STUDIO: Studio = {
  id: 'studiosun-nishifunabashi',
  name: 'STUDIO SUN 西船橋店',
  chainName: 'STUDIO SUN',
  area: '船橋',
  prefecture: '千葉県',
  nearestStation: 'JR西船橋駅 南口 徒歩3分',
  address: '千葉県船橋市印内町570-1 鎌倉ビル1F',
  tel: '047-431-9753',
  bookingUrl: 'https://webtoru.com/shop/3/',
  websiteUrl: 'https://studiosun1987.com/',
  businessHoursSummary: '9:00〜24:00（無人時間帯は6:00〜9:00も一部利用可）',
  is24Hours: false,
  groupBookingRule: 'WEBにて随時予約受付可能（ウェブトル会員登録要）',
  groupBookingLeadMonths: 3,
  soloBookingRule: '前日・当日のみWEB/電話にて受付（先取りキャンペーン中は6日前から）',
  soloBookingLeadHours: 24,
};

function buildStudioSunRooms(json: any, studio: Studio, orderStart: number): RoomWithSlots[] {
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

export function getStudioSunNishiFunabashiRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildStudioSunRooms(studioSunJson, STUDIOSUN_NISHIFUNABASHI_STUDIO, 2100).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

// -------------------------------------------------------------
// スタジオパックス船橋店（会員ログイン必須のため静的リスティング）
// -------------------------------------------------------------
export const PACKS_FUNABASHI_STUDIO: Studio = {
  id: 'packs-funabashi',
  name: 'スタジオパックス船橋店',
  chainName: 'sound studio PACKS',
  area: '船橋',
  prefecture: '千葉県',
  nearestStation: 'JR総武線 船橋駅 徒歩5分 / 京成本線 京成船橋駅 徒歩3分',
  address: '千葉県船橋市本町3-2-2 丸善ビル2F',
  tel: '047-425-5833',
  bookingUrl: '',
  websiteUrl: 'https://www.studio-packs.jp/funabashi',
  businessHoursSummary: '24時間営業・年中無休（年末年始を除く）',
  is24Hours: true,
  groupBookingRule: '初回のご予約はお電話のみ。以降はWeb（要事前会員登録・マイページ）にて受付',
  groupBookingLeadMonths: 3,
  soloBookingRule: '電話またはWeb（要会員登録）にて随時受付',
  soloBookingLeadHours: 24,
};

interface PacksRoomDef {
  id: string;
  name: string;
  tatami: number;
  capacity: number;
  guitarAmps: string[];
  bassAmp: string;
  drumSet: string;
  speaker: string;
  hourlyWeekday: number;
  hourlyDaytime: number;
  hourlyWeekend: number;
  notes?: string;
}

const PACKS_ROOM_DEFS: PacksRoomDef[] = [
  { id: 'packs-s1', name: 'S1st (約16.7帖)', tatami: 17, capacity: 6, guitarAmps: ['Marshall JCM900+1960A', 'Roland JC-120 & Fender Tonemaster TwinReverb'], bassAmp: 'Hartke LH500 + Ampeg 810E', drumSet: 'Pearl Reference Series', speaker: 'YAMAHA CBR15', hourlyWeekday: 3300, hourlyDaytime: 2900, hourlyWeekend: 3400 },
  { id: 'packs-s2', name: 'S2st (約13.3帖)', tatami: 13, capacity: 5, guitarAmps: ['Marshall JCM900+1960A', 'Roland JC-120 & Fender Tonemaster TwinReverb'], bassAmp: 'Hartke LH500 + Ampeg 810E', drumSet: 'Pearl Reference Series', speaker: 'YAMAHA CBR15', hourlyWeekday: 3300, hourlyDaytime: 2900, hourlyWeekend: 3400 },
  { id: 'packs-s3', name: 'S3st (約14.5帖)', tatami: 15, capacity: 5, guitarAmps: ['Marshall JCM2000+1960A', 'Roland JC-120 & Fender Tonemaster TwinReverb'], bassAmp: 'Hartke LH500 + Ampeg 810E', drumSet: 'Pearl Reference Series', speaker: 'E/V ZX3', hourlyWeekday: 3300, hourlyDaytime: 2900, hourlyWeekend: 3400 },
  { id: 'packs-r1', name: 'R1st (約10.6帖)', tatami: 11, capacity: 4, guitarAmps: ['Marshall JCM900+1960A', 'Roland JC-120 & Fender Tonemaster TwinReverb'], bassAmp: 'Hartke LH500 + Ampeg 810E', drumSet: 'Pearl Masters Series', speaker: 'YAMAHA CBR15', hourlyWeekday: 2500, hourlyDaytime: 2100, hourlyWeekend: 2600 },
  { id: 'packs-r2', name: 'R2st (約10.6帖)', tatami: 11, capacity: 4, guitarAmps: ['Marshall JCM900+1960A', 'Roland JC-120 & Fender Tonemaster TwinReverb'], bassAmp: 'Hartke LH500 + Ampeg 810E', drumSet: 'Pearl Masters Series', speaker: 'YAMAHA CBR15', hourlyWeekday: 2500, hourlyDaytime: 2100, hourlyWeekend: 2600 },
  { id: 'packs-r3', name: 'R3st (約10.6帖)', tatami: 11, capacity: 4, guitarAmps: ['Marshall JCM900+1960A', 'Roland JC-120 & Fender Tonemaster TwinReverb'], bassAmp: 'Hartke LH500 + Ampeg 810E', drumSet: 'Pearl Masters Series', speaker: 'YAMAHA CBR15', hourlyWeekday: 2500, hourlyDaytime: 2100, hourlyWeekend: 2600 },
  { id: 'packs-r4', name: 'R4st (約10.6帖)', tatami: 11, capacity: 4, guitarAmps: ['Marshall JCM2000+1960A', 'Roland JC-120 & Fender Tonemaster TwinReverb'], bassAmp: 'Hartke LH500 + Ampeg 810E', drumSet: 'Pearl Masters Series', speaker: 'E/V ZX3', hourlyWeekday: 2500, hourlyDaytime: 2100, hourlyWeekend: 2600 },
  { id: 'packs-r5', name: 'R5st (約10.6帖)', tatami: 11, capacity: 4, guitarAmps: ['Marshall JCM2000+1960A', 'Roland JC-120 & Fender Tonemaster TwinReverb'], bassAmp: 'Hartke LH500 + Ampeg 810E', drumSet: 'Pearl Masters Series', speaker: 'E/V ZX3', hourlyWeekday: 2500, hourlyDaytime: 2100, hourlyWeekend: 2600 },
  { id: 'packs-r6', name: 'R6st (約10.6帖)', tatami: 11, capacity: 4, guitarAmps: ['Marshall JCM2000+1960A', 'Roland JC-120 & Fender Tonemaster TwinReverb'], bassAmp: 'Hartke LH500 + Ampeg 810E', drumSet: 'Pearl Masters Series', speaker: 'E/V ZX3', hourlyWeekday: 2500, hourlyDaytime: 2100, hourlyWeekend: 2600 },
  { id: 'packs-s4', name: 'S4st (約22帖・ダンス兼用)', tatami: 22, capacity: 10, guitarAmps: [], bassAmp: '', drumSet: '', speaker: 'YAMAHA CBR12', hourlyWeekday: 3300, hourlyDaytime: 2900, hourlyWeekend: 3400, notes: 'ダンススタジオ兼用室のためギター/ベースアンプ・ドラムセットの常設なし。有線LANなし。' },
];

/**
 * スタジオパックス船橋店はWeb予約に事前会員登録が必須（ゲスト閲覧不可）のため、
 * 他店舗のようなリアルタイム空き状況クロールは行わず、部屋情報のみを静的に掲載する
 * （slotsは常に空配列）。bookingUrlをあえて設定せず、isPhoneOnlyStudio()の
 * 「bookingUrlなし・telあり」判定により自動的に「TEL」表示になるようにする。
 */
export function getPacksFunabashiRooms(): RoomWithSlots[] {
  let order = 2200;
  return PACKS_ROOM_DEFS.map((def) => {
    const equipment: RoomEquipment = {
      id: `eq-${def.id}`,
      roomId: def.id,
      guitarAmps: def.guitarAmps,
      bassAmp: def.bassAmp,
      drumSet: def.drumSet,
      isTwinPedalAllowed: true,
      paSystem: `YAMAHA EMX5016CF + ${def.speaker}`,
      additionalNotes: `${def.notes ? def.notes + ' ' : ''}Web予約は要事前会員登録（ゲスト閲覧不可のためリアルタイム空き状況は非対応、初回予約はお電話でご確認ください）。`,
    };

    return {
      id: def.id,
      studioId: PACKS_FUNABASHI_STUDIO.id,
      name: def.name,
      sizeTatami: def.tatami,
      capacity: def.capacity,
      pricePerHourRegular: def.hourlyWeekday,
      pricePerHourDaytime: def.hourlyDaytime,
      pricePerHourSolo: 800,
      hasMirror: true,
      hasRecording: false,
      startTimeOffset: 0,
      orderIndex: order++,
      studio: PACKS_FUNABASHI_STUDIO,
      equipment,
      slots: [],
    };
  });
}
