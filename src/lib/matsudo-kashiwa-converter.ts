/**
 * 松戸・柏エリア追加分（2026-09-21）用コンバータ。
 * ・伊藤楽器 MUSIC BANK 松戸: studi-ol.com ASP（ログイン不要でカレンダー閲覧可能、自動巡回対応）。
 * ・スタジオ ダグアウト2: webtoru.com ASP（ログイン不要でカレンダー閲覧可能、自動巡回対応）。
 * ・ゲートウェイスタジオ柏店: Reserve1.jp/ReserveMart（ゲスト閲覧可能、他のGateway店舗と同じ
 *   VisitorLoginパターン、自動巡回対応）。
 * ・SOUND STUDIO M 柏店: orpheusrecords.info（小岩店と異なり有人営業のみの単一システムで
 *   studi-ol.comとのハイブリッド構成ではない、自動巡回対応）。
 * ・サウンドスタジオパックス新松戸店: Web予約は会員ログイン必須（ゲスト閲覧不可、船橋店と同じ
 *   brovalapp.netシステム）のため自動巡回非対応。BAZOOKA STUDIO/スタジオパックス船橋店と同じく
 *   部屋情報のみを静的に掲載する（slotsは常に空配列）。
 * いずれもfeatures配列はBASS::/DRUM::/NOTE::プレフィックス方式（高円寺エリア以降の各コンバータと同じ）。
 */
import { Studio, RoomWithSlots, AvailabilitySlot, RoomEquipment } from '@/types/studio';
import musicBankMatsudoJson from '@/data/musicbank-matsudo-real.json';
import studioDugout2MatsudoJson from '@/data/studio-dugout2-matsudo-real.json';
import gatewayKashiwaJson from '@/data/gateway-kashiwa-real.json';
import soundStudioMKashiwaJson from '@/data/soundstudio-m-kashiwa-real.json';

export const MUSICBANK_MATSUDO_STUDIO: Studio = {
  id: 'musicbank-matsudo',
  name: '伊藤楽器 MUSIC BANK 松戸',
  chainName: '伊藤楽器 MUSIC BANK',
  area: '松戸・柏',
  prefecture: '千葉県',
  nearestStation: 'JR松戸駅 東口 徒歩1分',
  address: '千葉県松戸市松戸1174-1',
  tel: '047-368-1161',
  bookingUrl: 'https://studi-ol.com/shop/558',
  websiteUrl: 'https://www.ito-ongaku.com/rental/musicbank-matsudo/',
  businessHoursSummary: '平日11:00〜20:00 / 土日祝10:00〜19:00',
  is24Hours: false,
  groupBookingRule: 'WEBにて随時予約受付可能（スタジオル会員登録要、要事前MUSIC BANK会員登録）',
  groupBookingLeadMonths: 2,
  soloBookingRule: '個人練習は前々日よりWEB/電話にて受付',
  soloBookingLeadHours: 48,
};

export const STUDIO_DUGOUT2_MATSUDO_STUDIO: Studio = {
  id: 'studio-dugout2-matsudo',
  name: 'スタジオ ダグアウト2',
  chainName: 'スタジオ ダグアウト',
  area: '松戸・柏',
  prefecture: '千葉県',
  nearestStation: 'JR松戸駅 西口 徒歩5分',
  address: '千葉県松戸市根本6-5 2F',
  tel: '04-7718-2633',
  bookingUrl: 'https://webtoru.com/shop/173/calendar',
  websiteUrl: 'https://www.studiodugout2.com/',
  businessHoursSummary: '平日12:00〜24:00 / 土日祝10:00〜24:00',
  is24Hours: false,
  groupBookingRule: 'WEBにて随時予約受付可能（ウェブトル会員登録要）',
  groupBookingLeadMonths: 2,
  soloBookingRule: 'WEBにて随時予約受付可能（要事前確認）',
  soloBookingLeadHours: 24,
};

export const GATEWAY_KASHIWA_STUDIO: Studio = {
  id: 'gateway-kashiwa',
  name: 'ゲートウェイスタジオ 柏店',
  chainName: 'GATEWAY STUDIO',
  area: '松戸・柏',
  prefecture: '千葉県',
  nearestStation: '柏駅 西口 徒歩2分',
  address: '千葉県柏市旭町1-2-1 第11関口ビルB1',
  tel: '04-7144-9993',
  bookingUrl: 'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=tlsccmeco&mn=3&gr=14',
  websiteUrl: 'http://www.gw-studio.com/studios/studio_kashi/index',
  businessHoursSummary: '平日10:00〜23:00 / 土日祝9:00〜23:00',
  is24Hours: false,
  groupBookingRule: '2ヶ月前よりWEB/電話にて予約可能',
  groupBookingLeadMonths: 2,
  soloBookingRule: '前日10:00よりWEB/電話受付開始 (1名770円/h、2名1,320円/h)',
  soloBookingLeadHours: 24,
};

export const SOUND_STUDIO_M_KASHIWA_STUDIO: Studio = {
  id: 'soundstudio-m-kashiwa',
  name: 'SOUND STUDIO M 柏店',
  chainName: 'SOUND STUDIO M',
  area: '松戸・柏',
  prefecture: '千葉県',
  nearestStation: 'JR柏駅 東口 徒歩10分',
  address: '千葉県柏市泉町16-30 大東ビル3F',
  tel: '04-7164-9413',
  bookingUrl: 'http://www.orpheusrecords.info/RoomSituation.php?pno=5',
  websiteUrl: 'https://orpheusrecords.jp/ssm/kashiwa/',
  businessHoursSummary: '平日12:00〜23:00 / 土日祝10:00〜23:00',
  is24Hours: false,
  groupBookingRule: 'WEBにて随時予約受付可能（有人営業時間帯のみ、小岩店・一之江店と異なりハイブリッド無人営業なし）',
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

export function getMusicBankMatsudoRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(musicBankMatsudoJson, MUSICBANK_MATSUDO_STUDIO, 2560).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getStudioDugout2MatsudoRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(studioDugout2MatsudoJson, STUDIO_DUGOUT2_MATSUDO_STUDIO, 2580).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getGatewayKashiwaRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(gatewayKashiwaJson, GATEWAY_KASHIWA_STUDIO, 2600).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

export function getSoundStudioMKashiwaRealRooms(targetDateStr: string): RoomWithSlots[] {
  return buildRoomsFromJson(soundStudioMKashiwaJson, SOUND_STUDIO_M_KASHIWA_STUDIO, 2620).map((r) => ({
    ...r,
    slots: r.slots.filter((s) => s.startTime.startsWith(targetDateStr)),
  }));
}

// -------------------------------------------------------------
// サウンドスタジオパックス新松戸店（会員ログイン必須のため静的リスティング）
// -------------------------------------------------------------
export const PACKS_SHINMATSUDO_STUDIO: Studio = {
  id: 'packs-shinmatsudo',
  name: 'サウンドスタジオパックス 新松戸店',
  chainName: 'sound studio PACKS',
  area: '松戸・柏',
  prefecture: '千葉県',
  nearestStation: 'JR新松戸駅 徒歩3分',
  address: '千葉県松戸市新松戸4-14-2 KARAFUビル2F',
  tel: '047-711-5002',
  bookingUrl: '',
  websiteUrl: 'https://www.studio-packs.jp/shinmatsudo',
  businessHoursSummary: '24時間営業・年中無休（年末年始を除く）',
  is24Hours: true,
  groupBookingRule: '初回のご予約はお電話のみ。以降はWeb（要事前会員登録・マイページ）にて受付',
  groupBookingLeadMonths: 3,
  soloBookingRule: '電話またはWeb（要会員登録）にて随時受付',
  soloBookingLeadHours: 24,
};

interface PacksShinmatsudoRoomDef {
  id: string;
  name: string;
  tatami: number;
  capacity: number;
  guitarAmps: string[];
  bassAmp: string;
  drumSet: string;
  hourlyWeekday: number;
  hourlyDaytime: number;
  hourlyWeekend: number;
  notes?: string;
}

const PACKS_SHINMATSUDO_ROOM_DEFS: PacksShinmatsudoRoomDef[] = [
  { id: 'packs-shinmatsudo-s1', name: 'S1st (18帖)', tatami: 18, capacity: 6, guitarAmps: ['Marshall JCM900(+1960A)', 'Roland JC-120', 'Fender TwinReverb'], bassAmp: 'Ampeg PF-800 + 810E', drumSet: 'Pearl Masters + SABIAN AA ROCK', hourlyWeekday: 3200, hourlyDaytime: 2600, hourlyWeekend: 3200 },
  { id: 'packs-shinmatsudo-r2', name: 'R2st (12帖)', tatami: 12, capacity: 4, guitarAmps: ['Marshall JCM900(+1960A)', 'Roland JC-120'], bassAmp: 'Ampeg PF-800 + 810E', drumSet: 'Pearl Masters + SABIAN AA ROCK', hourlyWeekday: 2500, hourlyDaytime: 1900, hourlyWeekend: 2500 },
  { id: 'packs-shinmatsudo-r3', name: 'R3st (12帖・グランドピアノ)', tatami: 12, capacity: 4, guitarAmps: ['Marshall JCM900(+1960A)', 'Roland JC-120'], bassAmp: 'Ampeg PF-800 + 810E', drumSet: 'Pearl Masters + SABIAN AA ROCK', hourlyWeekday: 2500, hourlyDaytime: 1900, hourlyWeekend: 2500, notes: 'KAWAIグランドピアノ常設（グループ利用時は使用料無料）。' },
  { id: 'packs-shinmatsudo-r4', name: 'R4st (12帖)', tatami: 12, capacity: 4, guitarAmps: ['Marshall JCM900(+1960A)', 'Roland JC-120'], bassAmp: 'Ampeg PF-800 + 810E', drumSet: 'Pearl Masters + SABIAN AA ROCK', hourlyWeekday: 2500, hourlyDaytime: 1900, hourlyWeekend: 2500 },
  { id: 'packs-shinmatsudo-s5', name: 'S5st (18帖)', tatami: 18, capacity: 6, guitarAmps: ['Marshall JCM900(+1960A)', 'Roland JC-120', 'Fender TwinReverb'], bassAmp: 'Ampeg PF-800 + 810E', drumSet: 'Pearl Masters + SABIAN AA ROCK', hourlyWeekday: 3200, hourlyDaytime: 2600, hourlyWeekend: 3200 },
];

/**
 * サウンドスタジオパックス新松戸店はWeb予約に事前会員登録が必須（ゲスト閲覧不可、船橋店と
 * 同じbrovalapp.netシステム）のため、リアルタイム空き状況クロールは行わず、部屋情報のみを
 * 静的に掲載する（slotsは常に空配列）。K6/R7（ダンススタジオ専用室）はバンド練習向けでは
 * ないため対象外とする。bookingUrlをあえて設定せず、isPhoneOnlyStudio()の
 * 「bookingUrlなし・telあり」判定により自動的に「TEL」表示になるようにする。
 */
export function getPacksShinmatsudoRooms(): RoomWithSlots[] {
  let order = 2640;
  return PACKS_SHINMATSUDO_ROOM_DEFS.map((def) => {
    const equipment: RoomEquipment = {
      id: `eq-${def.id}`,
      roomId: def.id,
      guitarAmps: def.guitarAmps,
      bassAmp: def.bassAmp,
      drumSet: def.drumSet,
      isTwinPedalAllowed: true,
      paSystem: 'YAMAHA EMX5016CF + YAMAHA CBR15',
      additionalNotes: `${def.notes ? def.notes + ' ' : ''}Web予約は要事前会員登録（ゲスト閲覧不可のためリアルタイム空き状況は非対応、初回予約はお電話でご確認ください）。`,
    };

    return {
      id: def.id,
      studioId: PACKS_SHINMATSUDO_STUDIO.id,
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
      studio: PACKS_SHINMATSUDO_STUDIO,
      equipment,
      slots: [],
    };
  });
}
