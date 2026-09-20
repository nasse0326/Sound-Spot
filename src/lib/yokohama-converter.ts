/**
 * 横浜エリア追加分（2026-09-21）用コンバータ。
 * ・スタジオペンタ横浜店: 他のペンタ店舗と同じく電話・LINE・店頭予約のみ（ゲスト閲覧不可）
 *   のため静的リスティング（isPhoneOnlyStudio()はchainName==='STUDIO PENTA'を含む判定で
 *   自動的にTEL表示になる）。
 * ・クラウドナインスタジオ横浜北口店: Web予約は会員登録必須（店頭での事前登録が必要、
 *   ゲスト閲覧不可）のため静的リスティング。bookingUrlをあえて設定せず、
 *   isPhoneOnlyStudio()の「bookingUrlなし・telあり」判定でTEL表示にする。
 * ・ヨコハマ・セーラスタジオ: Reserve1.jp（ReserveMart ASP）のVisitorLogin経由で
 *   ゲスト閲覧可能。部屋名が"A-STUDIO"等の数字を含まない形式だったため、
 *   scripts/lib/reserve1-fetcher.tsに新パターン（letterStudioMatch）を追加して対応した。
 */
import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment, SlotStatus } from '@/types/studio';
import sailaDataJson from '@/data/yokohama-saila-real.json';

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
// クラウドナインスタジオ横浜北口店（会員登録必須のため静的リスティング）
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
  bookingUrl: '',
  websiteUrl: 'https://www.cloud-9-studio.com/studio/yokohama_n.html',
  businessHoursSummary: '平日10:00〜 / 土日祝9:00〜（最大翌朝6:30まで営業）',
  is24Hours: false,
  groupBookingRule: 'WEB予約は要事前会員登録（店頭での登録が必須・ゲスト閲覧不可）',
  groupBookingLeadMonths: 2,
  soloBookingRule: '当日0時より翌々日24時まで受付',
  soloBookingLeadHours: 48,
};

interface Cloud9RoomDef {
  id: string;
  name: string;
  tatami: number;
  offset: number;
  guitarAmps: string[];
  bassAmp: string;
  drumSet: string;
  hourlyWeekday: number;
  hourlyWeekend: number;
  keyboard?: string;
}

const CLOUD9_ROOM_DEFS: Cloud9RoomDef[] = [
  { id: 'cloud9-yn-ast', name: 'Ast (18畳)', tatami: 18, offset: 30, guitarAmps: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo'], bassAmp: 'Ampeg SVT-450H + SVT-810E', drumSet: 'Pearl Carbon Ply Maple Series', hourlyWeekday: 2970, hourlyWeekend: 3520, keyboard: 'YAMAHA CP-50' },
  { id: 'cloud9-yn-bst', name: 'Bst (11畳)', tatami: 11, offset: 15, guitarAmps: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo'], bassAmp: 'Ampeg SVT-450H + SVT-810E', drumSet: 'Pearl MMP Series', hourlyWeekday: 2200, hourlyWeekend: 2750 },
  { id: 'cloud9-yn-cst', name: 'Cst (10畳)', tatami: 10, offset: 15, guitarAmps: ['Marshall JVM210H', 'Roland JC-120', 'Fender HotRod Deville III 212'], bassAmp: 'Ampeg SVT-450H + SVT-810E', drumSet: 'Pearl MMP Series', hourlyWeekday: 2090, hourlyWeekend: 2640 },
  { id: 'cloud9-yn-dst', name: 'Dst (10畳)', tatami: 10, offset: 15, guitarAmps: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo'], bassAmp: 'Ampeg SVT-450H + SVT-810E', drumSet: 'Pearl MMP Series', hourlyWeekday: 2090, hourlyWeekend: 2640 },
  { id: 'cloud9-yn-est', name: 'Est (20畳)', tatami: 20, offset: 0, guitarAmps: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo'], bassAmp: 'Ampeg SVT-450H + SVT-810E', drumSet: 'Pearl CarbonCore', hourlyWeekday: 3190, hourlyWeekend: 3740, keyboard: 'YAMAHA CP-50' },
  { id: 'cloud9-yn-fst', name: 'Fst (15畳)', tatami: 15, offset: 0, guitarAmps: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo'], bassAmp: 'Markbass LittleMarkRocker 500 + Standard 108HR', drumSet: 'YAMAHA Recording Custom', hourlyWeekday: 2640, hourlyWeekend: 3190 },
  { id: 'cloud9-yn-gst', name: 'Gst (15畳)', tatami: 15, offset: 30, guitarAmps: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo'], bassAmp: 'Hartke HA3500 + Ampeg SVT-810E', drumSet: 'YAMAHA LIVE CUSTOM Series', hourlyWeekday: 2640, hourlyWeekend: 3190, keyboard: 'YAMAHA CP-40' },
  { id: 'cloud9-yn-hst', name: 'Hst (11畳)', tatami: 11, offset: 30, guitarAmps: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo'], bassAmp: 'Hartke HA3500 + 410XL x2', drumSet: 'YAMAHA LIVE CUSTOM Series', hourlyWeekday: 2200, hourlyWeekend: 2750 },
  { id: 'cloud9-yn-ist', name: 'Ist (10畳)', tatami: 10, offset: 30, guitarAmps: ['Marshall JVM210H', 'Roland JC-120', 'Fender HotRod Deville III 212'], bassAmp: 'Hartke HA3500 + 410XL x2', drumSet: 'YAMAHA Recording Custom', hourlyWeekday: 2090, hourlyWeekend: 2640 },
  { id: 'cloud9-yn-jst', name: 'Jst (13畳)', tatami: 13, offset: 0, guitarAmps: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo'], bassAmp: 'Hartke HA3500 + 410XL x2', drumSet: 'YAMAHA Recording Custom', hourlyWeekday: 2420, hourlyWeekend: 2970 },
  { id: 'cloud9-yn-kst', name: 'Kst (18畳)', tatami: 18, offset: 0, guitarAmps: ['Marshall JVM210H', 'Roland JC-120', 'Fender Super Sonic Twin Combo'], bassAmp: 'Markbass LittleMarkRocker 500 + Standard 108HR', drumSet: 'YAMAHA Absolute Hybrid Maple', hourlyWeekday: 2970, hourlyWeekend: 3520, keyboard: 'YAMAHA CP-40' },
];

export function getCloud9YokohamaKitaguchiRooms(): RoomWithSlots[] {
  let order = 2320;
  return CLOUD9_ROOM_DEFS.map((def) => {
    const equipment: RoomEquipment = {
      id: `eq-${def.id}`,
      roomId: def.id,
      guitarAmps: def.guitarAmps,
      bassAmp: def.bassAmp,
      drumSet: def.drumSet,
      isTwinPedalAllowed: true,
      keyboards: def.keyboard ? [def.keyboard] : [],
      additionalNotes: 'Web予約は要事前会員登録（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから空き状況をご確認ください）。',
    };

    return {
      id: def.id,
      studioId: CLOUD9_YOKOHAMA_KITAGUCHI_STUDIO.id,
      name: def.name,
      sizeTatami: def.tatami,
      capacity: Math.max(3, Math.round(def.tatami / 2.2)),
      pricePerHourRegular: def.hourlyWeekend,
      pricePerHourDaytime: def.hourlyWeekday,
      pricePerHourSolo: 880,
      hasMirror: true,
      hasRecording: false,
      startTimeOffset: def.offset,
      orderIndex: order++,
      studio: CLOUD9_YOKOHAMA_KITAGUCHI_STUDIO,
      equipment,
      slots: [],
    };
  });
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
