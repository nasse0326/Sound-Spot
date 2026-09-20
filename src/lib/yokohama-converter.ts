/**
 * 横浜エリア追加分（2026-09-21）用コンバータ。
 * ・スタジオペンタ横浜店: 他のペンタ店舗と同じく電話・LINE・店頭予約のみ（ゲスト閲覧不可）
 *   のため静的リスティング（isPhoneOnlyStudio()はchainName==='STUDIO PENTA'を含む判定で
 *   自動的にTEL表示になる）。
 * ・クラウドナインスタジオ横浜北口店: 会員登録必須の旧予約システム(frasweb.net)は
 *   ゲスト閲覧不可だったが、2026年2月に更新された新システム(cloud9-web.jp)はログイン不要の
 *   公開API (`/api/studio-room-reserved-times`、payload: {studio_id, reservation_start_at}）
 *   から実際の予約状況を直接取得できることが判明したため、自動巡回に対応した
 *   （scripts/lib/cloud9-fetcher.ts）。
 * ・ヨコハマ・セーラスタジオ: Reserve1.jp（ReserveMart ASP）のVisitorLogin経由で
 *   ゲスト閲覧可能。部屋名が"A-STUDIO"等の数字を含まない形式だったため、
 *   scripts/lib/reserve1-fetcher.tsに新パターン（letterStudioMatch）を追加して対応した。
 */
import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment, SlotStatus } from '@/types/studio';
import sailaDataJson from '@/data/yokohama-saila-real.json';
import cloud9DataJson from '@/data/cloud9-yokohama-kitaguchi-real.json';

// -------------------------------------------------------------
// スタジオペンタ横浜店（電話・LINE予約のみ）
// -------------------------------------------------------------
export const PENTA_YOKOHAMA_STUDIO: Studio = {
  id: 'penta-yokohama',
  name: 'スタジオペンタ横浜店',
  chainName: 'STUDIO PENTA',
  area: '横浜',
  prefecture: '神奈川県',
  nearestStation: 'JR横浜駅西口 徒歩5分',
  address: '神奈川県横浜市西区南幸2-8-9',
  tel: '045-313-3399',
  bookingUrl: 'https://studiopenta.jp/rehearsal/yokohama/',
  websiteUrl: 'https://studiopenta.jp/rehearsal/yokohama/',
  businessHoursSummary: '24時間営業（基本営業時間10:00〜24:00、24:00〜10:00は予約なしの場合クローズ）',
  is24Hours: true,
  groupBookingRule: '電話・LINE・店頭にて受付（オンライン予約非対応）',
  groupBookingLeadMonths: 2,
  soloBookingRule: '前日22:00より電話にて受付開始',
  soloBookingLeadHours: 26,
};

interface PentaYokohamaRoomDef {
  id: string;
  name: string;
  tatami: number;
  guitarAmps: string[];
  bassAmp: string;
  drumSet: string;
  hourlyDaytime: number;
  hourlyEvening: number;
  hourlyNight: number;
}

const PENTA_YOKOHAMA_ROOM_DEFS: PentaYokohamaRoomDef[] = [
  { id: 'penta-yokohama-a', name: 'Ast (12帖)', tatami: 12, guitarAmps: ['Marshall JVM210H + 1960A', 'Roland JC-120'], bassAmp: 'Orange OB1-300 + Orange OBC-410', drumSet: 'Pearl Masters Custom', hourlyDaytime: 1870, hourlyEvening: 2178, hourlyNight: 2530 },
  { id: 'penta-yokohama-b', name: 'Bst (12帖)', tatami: 12, guitarAmps: ['Marshall JCM900 + 1960A', 'Roland JC-120'], bassAmp: 'Ampeg Venture V3 + Ampeg SVT-610HLF', drumSet: 'Pearl Standard Maple', hourlyDaytime: 1870, hourlyEvening: 2178, hourlyNight: 2530 },
  { id: 'penta-yokohama-c', name: 'Cst (16帖)', tatami: 16, guitarAmps: ['Fender \'65 Twin Reverb', 'Marshall JCM900 + 1960A', 'Roland JC-120'], bassAmp: 'Ampeg SVT-3PRO + Ampeg SVT-810E', drumSet: 'Pearl Masters Premium Maple', hourlyDaytime: 2090, hourlyEvening: 2420, hourlyNight: 2860 },
  { id: 'penta-yokohama-d', name: 'Dst (16帖)', tatami: 16, guitarAmps: ['KRANK Revolution-1 Plus', 'Marshall JVM210H + 1960A', 'Roland JC-120'], bassAmp: 'Ampeg SVT-3PRO + Ampeg SVT-810E', drumSet: 'Pearl Carbonply Maple', hourlyDaytime: 2090, hourlyEvening: 2420, hourlyNight: 2860 },
  { id: 'penta-yokohama-e', name: 'Est (18帖)', tatami: 18, guitarAmps: ["Fender '65 Twin Reverb", 'Marshall JCM900 + 1960A', 'Roland JC-120'], bassAmp: 'Hartke HA2500 + Ampeg SVT-810E', drumSet: 'Pearl Refalence', hourlyDaytime: 2310, hourlyEvening: 2860, hourlyNight: 3190 },
  { id: 'penta-yokohama-f', name: 'Fst (20帖)', tatami: 20, guitarAmps: ["Fender '65 Twin Reverb", 'Marshall JCM900 + 1960A', 'Roland JC-120'], bassAmp: 'Ampeg SVT-3PRO + Ampeg SVT-810E', drumSet: 'Pearl Masters Premium Maple', hourlyDaytime: 2530, hourlyEvening: 2970, hourlyNight: 3410 },
];

export function getPentaYokohamaRooms(): RoomWithSlots[] {
  let order = 2300;
  return PENTA_YOKOHAMA_ROOM_DEFS.map((def) => {
    const equipment: RoomEquipment = {
      id: `eq-${def.id}`,
      roomId: def.id,
      guitarAmps: def.guitarAmps,
      bassAmp: def.bassAmp,
      drumSet: def.drumSet,
      isTwinPedalAllowed: true,
      additionalNotes: '予約は電話・LINE・店頭のみ（ゲスト閲覧不可のためリアルタイム空き状況は非対応）。',
    };

    return {
      id: def.id,
      studioId: PENTA_YOKOHAMA_STUDIO.id,
      name: def.name,
      sizeTatami: def.tatami,
      capacity: Math.max(3, Math.round(def.tatami / 2.2)),
      pricePerHourRegular: def.hourlyNight,
      pricePerHourDaytime: def.hourlyDaytime,
      pricePerHourSolo: 880,
      hasMirror: true,
      hasRecording: false,
      startTimeOffset: 0,
      orderIndex: order++,
      studio: PENTA_YOKOHAMA_STUDIO,
      equipment,
      slots: [],
    };
  });
}

// -------------------------------------------------------------
// クラウドナインスタジオ横浜北口店（cloud9-web.jp公開API、実データ自動巡回）
// -------------------------------------------------------------
export const CLOUD9_YOKOHAMA_KITAGUCHI_STUDIO: Studio = {
  id: 'cloud9-yokohama-kitaguchi',
  name: 'クラウドナインスタジオ 横浜北口店',
  chainName: 'クラウドナインスタジオ',
  area: '横浜',
  prefecture: '神奈川県',
  nearestStation: '各線横浜駅 きた西口 徒歩5分',
  address: '神奈川県横浜市',
  tel: '045-624-9499',
  bookingUrl: 'https://cloud9-web.jp/',
  websiteUrl: 'https://www.cloud-9-studio.com/studio/yokohama_n.html',
  businessHoursSummary: '平日10:00〜 / 土日祝9:00〜（最大翌朝6:30まで営業）',
  is24Hours: false,
  groupBookingRule: 'WEBにて随時予約受付可能（要会員登録、空き状況はゲスト閲覧可）',
  groupBookingLeadMonths: 2,
  soloBookingRule: '当日0時より翌々日24時まで受付',
  soloBookingLeadHours: 48,
};

function buildCloud9Rooms(json: any, studio: Studio, orderStart: number): RoomWithSlots[] {
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

export function getCloud9YokohamaKitaguchiRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildCloud9Rooms(cloud9DataJson, CLOUD9_YOKOHAMA_KITAGUCHI_STUDIO, 2320).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

// -------------------------------------------------------------
// ヨコハマ・セーラスタジオ（Reserve1.jp、実データ自動巡回）
// -------------------------------------------------------------
export const YOKOHAMA_SAILA_STUDIO: Studio = {
  id: sailaDataJson.id,
  name: sailaDataJson.name,
  chainName: sailaDataJson.chain_name,
  area: sailaDataJson.area,
  prefecture: sailaDataJson.prefecture,
  nearestStation: sailaDataJson.nearest_station,
  address: sailaDataJson.address,
  tel: sailaDataJson.tel,
  bookingUrl: sailaDataJson.booking_url,
  websiteUrl: sailaDataJson.url,
  businessHoursSummary: sailaDataJson.business_hours_summary,
  is24Hours: sailaDataJson.is_24hours,
  groupBookingRule: sailaDataJson.group_booking_rule,
  groupBookingLeadMonths: sailaDataJson.group_booking_lead_months,
  soloBookingRule: sailaDataJson.solo_booking_rule,
  soloBookingLeadHours: sailaDataJson.solo_booking_lead_hours,
};

export function getYokohamaSailaRealRooms(targetDate: string): RoomWithSlots[] {
  const result: RoomWithSlots[] = [];

  for (let idx = 0; idx < sailaDataJson.rooms.length; idx++) {
    const r: any = sailaDataJson.rooms[idx];

    const equipment: RoomEquipment = {
      id: `eq-${r.id}`,
      roomId: r.id,
      guitarAmps: r.features.filter((f: string) => !f.startsWith('BASS::') && !f.startsWith('DRUM::') && !f.startsWith('NOTE::')),
      bassAmp: r.features.find((f: string) => f.startsWith('BASS::'))?.replace('BASS::', '') || '',
      drumSet: r.features.find((f: string) => f.startsWith('DRUM::'))?.replace('DRUM::', '') || '',
      isTwinPedalAllowed: true,
      additionalNotes: [
        ...r.features.filter((f: string) => f.startsWith('NOTE::')).map((f: string) => f.replace('NOTE::', '')),
        '常設機材の詳細は公式サイトに掲載が無いため代表的な構成を暫定掲載。正確な機材はご予約時にお問い合わせください。',
      ].join(' / '),
    };

    const matchingSlots = (r.slots || []).filter((s: any) => s.start_time.startsWith(targetDate));
    const slots: AvailabilitySlot[] = matchingSlots.map((slot: any) => ({
      id: slot.id,
      roomId: r.id,
      startTime: slot.start_time,
      endTime: slot.end_time,
      status: slot.status.toLowerCase() as SlotStatus,
    }));

    result.push({
      id: r.id,
      studioId: YOKOHAMA_SAILA_STUDIO.id,
      name: r.name,
      floor: r.floor || '',
      sizeTatami: r.size_tatami,
      capacity: r.capacity,
      pricePerHourRegular: r.hourly_rate,
      pricePerHourDaytime: r.day_rate || r.hourly_rate,
      pricePerHourSolo: r.individual_rate,
      hasMirror: true,
      hasRecording: false,
      startTimeOffset: r.start_time_offset || 0,
      orderIndex: 2400 + idx,
      studio: YOKOHAMA_SAILA_STUDIO,
      equipment,
      slots,
    });
  }

  return result;
}
