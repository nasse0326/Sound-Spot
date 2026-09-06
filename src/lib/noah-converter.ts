import { RoomWithSlots, AvailabilitySlot, RoomEquipment, SlotStatus } from '@/types/studio';
import { MOCK_STUDIOS } from './mock-data';
import realDataJson from '@/data/noah-shibuya2-real.json';

// ノア渋谷2号店の各部屋の機材プリセット（ノア公式機材スペック準拠）
const NOAH_EQUIPMENT_PRESETS: Record<string, Omit<RoomEquipment, 'id' | 'roomId'>> = {
  // A1st, A2st, A3st (8帖)
  '8帖': {
    guitarAmps: ['Roland JC-120', 'Marshall JCM2000 DSL100'],
    bassAmp: 'Ampeg SVT-3PRO + SVT-410HLF',
    drumSet: 'Pearl Masters Custom (22", 12", 13", 16")',
    isTwinPedalAllowed: true,
    paSystem: 'YAMAHA EMX5014C + Electro-Voice SX300',
    keyboards: ['Roland RD-700NX'],
    cymbalsDetail: 'PAISTE 2002 (14" HH, 16" Crash, 18" Crash, 20" Ride)',
    additionalNotes: 'コンパクトながら音抜けの良い定番スタジオ。壁面ミラー完備。',
  },
  // Sst (7帖)
  '7帖': {
    guitarAmps: ['Roland JC-120', 'Marshall DSL40CR'],
    bassAmp: 'Hartke 3500 + 410XL',
    drumSet: 'Pearl Export (20", 10", 12", 14")',
    isTwinPedalAllowed: true,
    paSystem: 'YAMAHA EMX312SC',
    keyboards: ['Roland Juno-DS'],
    cymbalsDetail: 'Zildjian A Custom',
    additionalNotes: '少人数バンドや個人練習に最適なコスパ良好ルーム。',
  },
  // G1st, G2st, G3st (10〜11帖)
  '10帖': {
    guitarAmps: ['Roland JC-120', 'Marshall JCM900 4100'],
    bassAmp: 'Ampeg SVT-4PRO + SVT-810E',
    drumSet: 'Canopus Yaiba II (22", 10", 12", 16")',
    isTwinPedalAllowed: true,
    paSystem: 'Midas DDA DM16 + EV TX1152',
    keyboards: ['YAMAHA CP4 STAGE', 'Roland Juno-DS'],
    cymbalsDetail: 'SABIAN HHX Complex',
    additionalNotes: '4〜5人バンドの標準リハーサルに最も選ばれるスタジオ。天井高あり。',
  },
  '11帖': {
    guitarAmps: ['Roland JC-120', 'Marshall JVM210H'],
    bassAmp: 'Ampeg SVT-4PRO + SVT-810E',
    drumSet: 'Canopus Yaiba II (22", 10", 12", 16")',
    isTwinPedalAllowed: true,
    paSystem: 'Midas DDA DM16 + EV TX1152',
    keyboards: ['YAMAHA CP4 STAGE'],
    cymbalsDetail: 'SABIAN HHX Complex',
    additionalNotes: '30分スタート枠。ゆったりとした広さで機材持ち込みにも最適。',
  },
  // B1st, B2st, B3st (13〜14帖)
  '13帖': {
    guitarAmps: ['Roland JC-120', 'Marshall JCM2000 DSL100', 'Fender Twin Reverb'],
    bassAmp: 'Ampeg SVT-VR + SVT-810AV',
    drumSet: 'DW Collector\'s Series (22", 10", 12", 16")',
    isTwinPedalAllowed: true,
    paSystem: 'Soundcraft Signature 22 + JBL PRX415M',
    keyboards: ['Nord Stage 3', 'Roland RD-88'],
    cymbalsDetail: 'Zildjian K Constantinople',
    additionalNotes: '3アンプ常設！音圧と分離感を両立した本格派リハーサル室。',
  },
  '14帖': {
    guitarAmps: ['Roland JC-120', 'Marshall JCM2000 DSL100', 'Mesa/Boogie Dual Rectifier'],
    bassAmp: 'Ampeg SVT-VR + SVT-810AV',
    drumSet: 'DW Collector\'s Series (22", 10", 12", 16")',
    isTwinPedalAllowed: true,
    paSystem: 'Soundcraft Signature 22 + JBL PRX415M',
    keyboards: ['Nord Stage 3', 'Roland RD-88'],
    cymbalsDetail: 'Zildjian K Custom Dark',
    additionalNotes: 'ラウド系バンドにも大人気。ハイパワーアンプ群と高解像度モニター。',
  },
  // E1st, E2st (16帖)
  '16帖': {
    guitarAmps: ['Roland JC-120', 'Marshall JVM410H', 'Fender 65 Twin Reverb'],
    bassAmp: 'Ampeg SVT-CL + SVT-810E',
    drumSet: 'YAMAHA Absolute Hybrid Maple (22", 10", 12", 14", 16")',
    isTwinPedalAllowed: true,
    paSystem: 'Allen & Heath Qu-16 (デジタルミキサー常設) + QSC KW153',
    keyboards: ['Nord Stage 3 88', 'KORG KRONOS2-61'],
    cymbalsDetail: 'Zildjian K Zildjian Pack',
    additionalNotes: '大型LED照明・セルフレコーディング対応。ゲネプロや配信ライブにも対応。',
  },
  // Cst (22帖)
  '22帖': {
    guitarAmps: ['Roland JC-120', 'Marshall JVM410H', 'Fender 65 Deluxe Reverb', 'EVH 5150 III'],
    bassAmp: 'Ampeg Heritage SVT-CL + SVT-810E',
    drumSet: 'Pearl Reference Pure (22", 10", 12", 14", 16")',
    isTwinPedalAllowed: true,
    paSystem: 'YAMAHA QL1 デジタルコンソール + NEXO PS15-R2',
    keyboards: ['Grand Piano (YAMAHA C3)', 'Nord Grand', 'Roland Fantom-08'],
    cymbalsDetail: 'Zildjian K Sweet Series',
    additionalNotes: '都内最大級の22帖！大人数ビッグバンドやホーンセクション、本番直前リハーサルに最適。',
  },
  // Vo.Booth (3帖)
  '3帖': {
    guitarAmps: ['Roland JC-22'],
    bassAmp: 'Hartke HD15',
    drumSet: 'なし（ボーカル・管楽器・アコースティック専用ブース）',
    isTwinPedalAllowed: false,
    paSystem: 'YAMAHA STAGEPAS 400BT',
    keyboards: ['Roland GO:KEYS'],
    cymbalsDetail: 'なし',
    additionalNotes: 'ボーカルレコーディング、声優アフレコ、個人練習専用ブース。Neumann U87Aiレンタル可。',
  },
};

// リアルJSONから渋谷2号店の全14部屋とそのスロットを生成
export function getNoahShibuya2RealRooms(targetDateStr: string): RoomWithSlots[] {
  const shibuya2Studio = MOCK_STUDIOS.find(s => s.id === 'a0000000-0000-0000-0000-000000000001') || MOCK_STUDIOS[0];
  const formattedSlashDate = targetDateStr.replace(/-/g, '/'); // "2026/09/05"

  return realDataJson.studios.map((item: any) => {
    const st = item.studio;
    const roomId = `noah-shibuya2-st-${st.studio_id}`;
    const sizeStr = st.view_size || `${st.size}帖`;
    const offset = st.start_time === 1 ? 30 : 0; // start_time: 1 => 30分スタート, 0 => 00分スタート

    // 平日昼料金の抽出（prices配列から）
    const dayPriceObj = st.prices?.find((p: any) => p.price_name?.includes('DAY TIME'));
    const regularPrice = st.regular_price || 2000;
    const daytimePrice = dayPriceObj ? Math.round(dayPriceObj.price * 1.1) : regularPrice;
    const soloPrice = st.person_price || 770;

    // 機材情報の割り当て
    const presetKey = Object.keys(NOAH_EQUIPMENT_PRESETS).find(k => sizeStr.includes(k)) || '8帖';
    const equipmentBase = NOAH_EQUIPMENT_PRESETS[presetKey] || NOAH_EQUIPMENT_PRESETS['8帖'];
    const equipment: RoomEquipment = {
      id: `eq-${roomId}`,
      roomId,
      ...equipmentBase,
    };

    // 該当日のリアルスロットを探索
    const targetDateData = item.dates?.find((d: any) => d.date === formattedSlashDate);

    const slots: AvailabilitySlot[] = [];

    if (targetDateData && targetDateData.time && targetDateData.time.length > 0) {
      // リアルデータからスロットを生成
      for (const t of targetDateData.time) {
        const [h, m] = t.start_time.split(':').map(Number);
        // 06:00 〜 24:00 のリハーサル時間帯（早朝・通常・深夜枠）を対象にする
        if (h >= 6 && h <= 23) {
          const sHour = String(h).padStart(2, '0');
          const sMin = String(m).padStart(2, '0');
          const endHourNum = m === 30 ? h + 1 : h + 1;
          const eHour = String(endHourNum).padStart(2, '0');
          const eMin = sMin;

          const startIso = `${targetDateStr}T${sHour}:${sMin}:00+09:00`;
          const endIso = `${targetDateStr}T${eHour}:${eMin}:00+09:00`;

          let status: SlotStatus = 'available';
          if (t.is_booked) {
            status = 'booked';
          } else if (t.is_not_in_service || !t.web_reserve_flg) {
            status = 'unopened';
          }

          slots.push({
            id: `slot-${roomId}-${targetDateStr}-${t.start_time}`,
            roomId,
            startTime: startIso,
            endTime: endIso,
            status,
          });
        }
      }
    }

    return {
      id: roomId,
      studioId: shibuya2Studio.id,
      name: `${st.studio_name} (${sizeStr})`,
      floor: `${st.floor}F`,
      sizeTatami: st.size || 8,
      capacity: Math.max(3, Math.round((st.size || 8) / 2.2)),
      pricePerHourRegular: regularPrice,
      pricePerHourDaytime: daytimePrice,
      pricePerHourSolo: soloPrice,
      hasMirror: true,
      hasRecording: st.recorder_flg === 1,
      startTimeOffset: offset,
      imageUrl: st.image_path ? `https://www.studionoah.jp${st.image_path}` : undefined,
      equipment,
      studio: shibuya2Studio,
      slots,
    };
  });
}
