/**
 * SOUND STUDIO NOAH 全7店舗・部屋マスター（単一の真実源）
 *
 * scripts/lib/noah-fetcher.ts（クロール: studioId/tatami/offset/loginRequiredを使用）と
 * src/lib/noah-tokyo-converter.ts（表示: 上記に加え実料金・実機材を使用）の両方から
 * このファイルを読み込む。以前は同じ内容を2ファイルに手動で複製しており、
 * IDがズレると該当部屋のスロットが静かに空になるリスクがあったため一本化した。
 *
 * tatami / offset / loginRequired / 料金は、公式予約API
 * （https://www.studionoah.jp/noahweb/Chart/studios?b[]=<branch_id>）を
 * scripts/scan-noah-branch.ts 相当のロジックで直接スキャンして取得した実データ
 * （2026-09-14時点）。機材（アンプ・ドラム）は各店舗公式サイトの
 * https://www.studionoah.jp/<branch>/gear/ ページに掲載されている実機材。
 *
 * priceRegular: 土日祝の1時間料金（税込）
 * priceDaytime: 平日6:00-17:00の1時間料金（税込）
 * priceSolo: 個人練習1名までの1時間料金（税込）
 * バンド予約非対応の小型ブース（DJブース・ボーカルブース等）は
 * priceRegular/priceDaytimeが存在しないため、priceSoloと同額を仮に設定する。
 */

export interface NoahRoomMaster {
  id: string;
  studioId: number;
  name: string;
  tatami: number;
  offset: 0 | 30;
  loginRequired: boolean;
  priceRegular: number;
  priceDaytime: number;
  priceSolo: number;
  guitarAmps: string[];
  bassAmp: string;
  drumSet: string;
}

export interface NoahStoreMaster {
  key: string;
  name: string;
  rooms: NoahRoomMaster[];
}

const JCM900 = 'Marshall JCM900 4100+1960A';
const JC120 = 'Roland JC-120';

export const NOAH_ALL_STORES: NoahStoreMaster[] = [
  // 1. 渋谷本店 (14室)
  {
    key: 'shibuya',
    name: 'サウンドスタジオノア 渋谷本店',
    rooms: [
      { id: 'noah-shibuya-a1', studioId: 3232, name: 'A1st (7帖)', tatami: 7, offset: 30, loginRequired: false, priceRegular: 2970, priceDaytime: 1760, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Markbass Little Mark IV + ST104HF', drumSet: 'SONOR SQ1 Series' },
      { id: 'noah-shibuya-a2', studioId: 3217, name: 'A2st (7帖)', tatami: 7, offset: 0, loginRequired: false, priceRegular: 2970, priceDaytime: 1760, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg V7+ Venture VB-410', drumSet: 'Pearl MASTERS MAPLE' },
      { id: 'noah-shibuya-b1', studioId: 3231, name: 'B1st (16帖)', tatami: 16, offset: 30, loginRequired: true, priceRegular: 4290, priceDaytime: 2970, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3PRO + SVT-810E', drumSet: 'SAKAE Evolved' },
      { id: 'noah-shibuya-b2', studioId: 3234, name: 'B2st (15帖)', tatami: 15, offset: 30, loginRequired: true, priceRegular: 4070, priceDaytime: 2750, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'Markbass Little Mark Vintage + ST108HR', drumSet: 'YAMAHA Recording Custom' },
      { id: 'noah-shibuya-b3', studioId: 3221, name: 'B3st (15帖)', tatami: 15, offset: 0, loginRequired: true, priceRegular: 4070, priceDaytime: 2750, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'AGUILAR TONE HAMMER 500 V2 + DB810', drumSet: 'SONOR SQ1 Series' },
      { id: 'noah-shibuya-b4', studioId: 3226, name: 'B4st (14帖)', tatami: 14, offset: 0, loginRequired: true, priceRegular: 3960, priceDaytime: 2640, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3PRO + SVT-810E', drumSet: 'SAKAE Evolved' },
      { id: 'noah-shibuya-c', studioId: 3230, name: 'Cst (27帖)', tatami: 27, offset: 0, loginRequired: true, priceRegular: 5500, priceDaytime: 3850, priceSolo: 1100, guitarAmps: [JCM900, JC120, 'Fender ToneMaster Twin Reverb'], bassAmp: 'Ampeg SVT-3PRO + SVT-810E', drumSet: 'YAMAHA Recording Custom' },
      { id: 'noah-shibuya-g1', studioId: 3233, name: 'G1st (12帖)', tatami: 12, offset: 30, loginRequired: false, priceRegular: 3410, priceDaytime: 2310, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3PRO + SVT-810E', drumSet: 'CANOPUS YAIBA II' },
      { id: 'noah-shibuya-g2', studioId: 3219, name: 'G2st (10帖)', tatami: 10, offset: 0, loginRequired: false, priceRegular: 3300, priceDaytime: 2200, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg V7+ SVT-810E', drumSet: 'CANOPUS YAIBA II' },
      { id: 'noah-shibuya-g3', studioId: 3227, name: 'G3st (11帖)', tatami: 11, offset: 0, loginRequired: false, priceRegular: 3300, priceDaytime: 2200, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Orange 4 Stroke 500 LTD + OBC810', drumSet: 'CANOPUS YAIBA II' },
      { id: 'noah-shibuya-s', studioId: 3229, name: 'Sst (6帖)', tatami: 6, offset: 0, loginRequired: false, priceRegular: 2750, priceDaytime: 1540, priceSolo: 770, guitarAmps: [JC120], bassAmp: 'Markbass Little Mark IV + ST104HF', drumSet: 'CANOPUS YAIBA II' },
      { id: 'noah-shibuya-djbooth1', studioId: 3224, name: 'DJ Booth1 (4帖)', tatami: 4, offset: 0, loginRequired: false, priceRegular: 1870, priceDaytime: 1870, priceSolo: 1870, guitarAmps: [], bassAmp: '', drumSet: '' },
      { id: 'noah-shibuya-booth2', studioId: 3235, name: 'Booth2 (4.5帖)', tatami: 5, offset: 30, loginRequired: false, priceRegular: 770, priceDaytime: 770, priceSolo: 770, guitarAmps: [JC120], bassAmp: '', drumSet: '' },
      { id: 'noah-shibuya-recstudio', studioId: 3236, name: 'REC STUDIO (4.5帖)', tatami: 5, offset: 30, loginRequired: false, priceRegular: 2310, priceDaytime: 1870, priceSolo: 880, guitarAmps: [], bassAmp: '', drumSet: '' },
    ],
  },
  // 2. 渋谷1号店 (12室)
  {
    key: 'shibuya1',
    name: 'サウンドスタジオノア 渋谷1号店',
    rooms: [
      { id: 'noah-shibuya1-a1st', studioId: 105, name: 'A1st (9帖)', tatami: 9, offset: 0, loginRequired: false, priceRegular: 2860, priceDaytime: 1650, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Markbass Little Mark IV + ST104HF', drumSet: 'SAKAE The Almighty' },
      { id: 'noah-shibuya1-a2st', studioId: 106, name: 'A2st (10帖)', tatami: 10, offset: 0, loginRequired: false, priceRegular: 2970, priceDaytime: 1760, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-350H', drumSet: 'Pearl MMX series' },
      { id: 'noah-shibuya1-a3st', studioId: 107, name: 'A3st (8帖)', tatami: 8, offset: 30, loginRequired: false, priceRegular: 2750, priceDaytime: 1540, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H', drumSet: 'Pearl MRP series' },
      { id: 'noah-shibuya1-a5st', studioId: 108, name: 'A5st (10帖)', tatami: 10, offset: 30, loginRequired: false, priceRegular: 2970, priceDaytime: 1760, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'ORANGE 4-STROKE-300 & OBC410+OBC115', drumSet: 'Pearl MCX series' },
      { id: 'noah-shibuya1-b1st', studioId: 109, name: 'B1st (12帖)', tatami: 12, offset: 0, loginRequired: true, priceRegular: 3300, priceDaytime: 2090, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-350H', drumSet: 'Pearl MSX series' },
      { id: 'noah-shibuya1-b2st', studioId: 110, name: 'B2st (12帖)', tatami: 12, offset: 0, loginRequired: true, priceRegular: 3300, priceDaytime: 2090, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3PRO', drumSet: 'Pearl MRX series' },
      { id: 'noah-shibuya1-b3st', studioId: 111, name: 'B3st (14帖)', tatami: 14, offset: 0, loginRequired: true, priceRegular: 3520, priceDaytime: 2310, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H', drumSet: 'Pearl MMP series' },
      { id: 'noah-shibuya1-b5st', studioId: 112, name: 'B5st (11帖)', tatami: 11, offset: 30, loginRequired: true, priceRegular: 3300, priceDaytime: 1980, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H', drumSet: 'SAKAE The Almighty' },
      { id: 'noah-shibuya1-e1st', studioId: 113, name: 'E1st (16帖)', tatami: 16, offset: 0, loginRequired: true, priceRegular: 3850, priceDaytime: 2530, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H', drumSet: 'Pearl RF series' },
      { id: 'noah-shibuya1-e2st', studioId: 114, name: 'E2st+Sub (17帖)', tatami: 17, offset: 30, loginRequired: true, priceRegular: 3960, priceDaytime: 2750, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 't.c.electronic RH750', drumSet: "DW Collector's series" },
      { id: 'noah-shibuya1-vobooth', studioId: 115, name: 'Vo.Booth (3帖)', tatami: 3, offset: 30, loginRequired: false, priceRegular: 770, priceDaytime: 770, priceSolo: 770, guitarAmps: [], bassAmp: '', drumSet: '' },
      { id: 'noah-shibuya1-rpstudio', studioId: 2973, name: 'R/P STUDIO (6帖)', tatami: 6, offset: 0, loginRequired: false, priceRegular: 2420, priceDaytime: 1980, priceSolo: 880, guitarAmps: [], bassAmp: '', drumSet: '' },
    ],
  },
  // 3. 渋谷2号店 (14室)
  {
    key: 'shibuya2',
    name: 'サウンドスタジオノア 渋谷2号店',
    rooms: [
      { id: 'noah-shibuya2-sst', studioId: 166, name: 'Sst (7帖)', tatami: 7, offset: 30, loginRequired: false, priceRegular: 2530, priceDaytime: 1650, priceSolo: 770, guitarAmps: [JCM900], bassAmp: 'MarkBass Little Mark III & STD104HF', drumSet: 'CANOPUS R.F.M SET' },
      { id: 'noah-shibuya2-a1st', studioId: 167, name: 'A1st (8帖)', tatami: 8, offset: 0, loginRequired: false, priceRegular: 2860, priceDaytime: 1760, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Markbass Little Mark IV & STD104HF', drumSet: 'Pearl MMP series' },
      { id: 'noah-shibuya2-a2st', studioId: 168, name: 'A2st (8帖)', tatami: 8, offset: 0, loginRequired: false, priceRegular: 2860, priceDaytime: 1760, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H & SVT610HLF', drumSet: 'Pearl MMP series' },
      { id: 'noah-shibuya2-a3st', studioId: 169, name: 'A3st (8帖)', tatami: 8, offset: 30, loginRequired: false, priceRegular: 2860, priceDaytime: 1760, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H & SVT610HLF', drumSet: 'Pearl MCX series' },
      { id: 'noah-shibuya2-g1st', studioId: 170, name: 'G1st (10帖)', tatami: 10, offset: 0, loginRequired: false, priceRegular: 3190, priceDaytime: 2090, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg Venture V7', drumSet: 'Pearl MMP series' },
      { id: 'noah-shibuya2-g2st', studioId: 171, name: 'G2st (10帖)', tatami: 10, offset: 0, loginRequired: false, priceRegular: 3190, priceDaytime: 2090, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H & SVT810E', drumSet: 'Pearl MMP series' },
      { id: 'noah-shibuya2-g3st', studioId: 172, name: 'G3st (11帖)', tatami: 11, offset: 30, loginRequired: false, priceRegular: 3300, priceDaytime: 2200, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H & SVT610HLF', drumSet: 'Pearl MCX series' },
      { id: 'noah-shibuya2-b1st', studioId: 173, name: 'B1st (13帖)', tatami: 13, offset: 0, loginRequired: true, priceRegular: 3740, priceDaytime: 2530, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS Little Mark Vintage1000 58R & STD108HR', drumSet: 'Pearl MMP series' },
      { id: 'noah-shibuya2-b2st', studioId: 174, name: 'B2st (14帖)', tatami: 14, offset: 0, loginRequired: true, priceRegular: 3850, priceDaytime: 2640, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H & SVT810E', drumSet: 'Pearl MMP series' },
      { id: 'noah-shibuya2-b3st', studioId: 175, name: 'B3st (14帖)', tatami: 14, offset: 30, loginRequired: true, priceRegular: 3850, priceDaytime: 2640, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H & SVT810E', drumSet: 'Pearl MMP series' },
      { id: 'noah-shibuya2-e1st', studioId: 176, name: 'E1st (16帖)', tatami: 16, offset: 0, loginRequired: true, priceRegular: 4180, priceDaytime: 2860, priceSolo: 1100, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H & SVT-810E', drumSet: "DW Collector's Maple Set" },
      { id: 'noah-shibuya2-e2st', studioId: 177, name: 'E2st (16帖)', tatami: 16, offset: 30, loginRequired: true, priceRegular: 4180, priceDaytime: 2860, priceSolo: 1100, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT450H & SVT810E', drumSet: 'Pearl Reference series' },
      { id: 'noah-shibuya2-cst', studioId: 178, name: 'Cst (22帖)', tatami: 22, offset: 30, loginRequired: true, priceRegular: 5060, priceDaytime: 3520, priceSolo: 1100, guitarAmps: [JCM900, JC120, "Fender Twin Reverb '65"], bassAmp: 'Ampeg SVT-450H & SVT810E', drumSet: 'SONOR SQ1 Series' },
      { id: 'noah-shibuya2-vobooth', studioId: 179, name: 'Vo.Booth (3帖)', tatami: 3, offset: 30, loginRequired: false, priceRegular: 770, priceDaytime: 770, priceSolo: 770, guitarAmps: [], bassAmp: '', drumSet: '' },
    ],
  },
  // 4. 渋谷3号店 (15室)
  {
    key: 'shibuya3',
    name: 'サウンドスタジオノア 渋谷3号店',
    rooms: [
      { id: 'noah-shibuya3-a1st', studioId: 3288, name: 'A1st (8帖)', tatami: 8, offset: 30, loginRequired: false, priceRegular: 2970, priceDaytime: 1760, priceSolo: 770, guitarAmps: ['Positive Grid REACTOR 100'], bassAmp: 'Markbass Little Mark 58R + Standard104HR', drumSet: 'YAMAHA Live Custom Hybrid Oak' },
      { id: 'noah-shibuya3-a2st', studioId: 3291, name: 'A2st (8帖)', tatami: 8, offset: 0, loginRequired: false, priceRegular: 2970, priceDaytime: 1760, priceSolo: 770, guitarAmps: ['Fender Hot Rod DeVille 212 IV'], bassAmp: 'Ampeg Venture V3 + SVT-410HLF', drumSet: 'Pearl Session Studio Select' },
      { id: 'noah-shibuya3-a3st', studioId: 3295, name: 'A3st (8帖)', tatami: 8, offset: 0, loginRequired: false, priceRegular: 2970, priceDaytime: 1760, priceSolo: 770, guitarAmps: ['Positive Grid REACTOR 100'], bassAmp: 'FENDER Rumble 800 HD + RUMBLE 210 CAB', drumSet: 'SAKAE Evolved Japan Custom Drum' },
      { id: 'noah-shibuya3-a4st', studioId: 3296, name: 'A4st (8帖)', tatami: 8, offset: 0, loginRequired: false, priceRegular: 2970, priceDaytime: 1760, priceSolo: 770, guitarAmps: ['Fender Hot Rod DeVille 212 IV'], bassAmp: 'HARTKE LH1000 + HyDrive HL410', drumSet: 'Pearl Session Studio Select' },
      { id: 'noah-shibuya3-cst', studioId: 3290, name: 'Cst (22帖)', tatami: 22, offset: 0, loginRequired: true, priceRegular: 5280, priceDaytime: 3740, priceSolo: 1100, guitarAmps: [JCM900, JC120, 'Fender Tone Master Twin Reverb'], bassAmp: 'Ampeg SVT-3PRO + SVT-810HLF', drumSet: 'YAMAHA Recording Custom' },
      { id: 'noah-shibuya3-est', studioId: 3287, name: 'Est (15帖)', tatami: 15, offset: 30, loginRequired: true, priceRegular: 3960, priceDaytime: 2640, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'ASHDOWN RM 800 EVOIII + RM 414T EVOIII', drumSet: 'CANOPUS Birch Series Studio kit Plus' },
      { id: 'noah-shibuya3-dj1', studioId: 3293, name: 'DJ1st (3.5帖)', tatami: 4, offset: 0, loginRequired: false, priceRegular: 1980, priceDaytime: 1980, priceSolo: 1980, guitarAmps: [], bassAmp: '', drumSet: '', },
      { id: 'noah-shibuya3-dj2', studioId: 3294, name: 'DJ2st (3.5帖)', tatami: 4, offset: 0, loginRequired: false, priceRegular: 1980, priceDaytime: 1980, priceSolo: 1980, guitarAmps: [], bassAmp: '', drumSet: '' },
      { id: 'noah-shibuya3-dj3', studioId: 3286, name: 'DJ3st (8帖)', tatami: 8, offset: 30, loginRequired: false, priceRegular: 3630, priceDaytime: 2860, priceSolo: 2200, guitarAmps: [], bassAmp: '', drumSet: '' },
      { id: 'noah-shibuya3-booth1', studioId: 3297, name: 'Booth1 (3.5帖)', tatami: 4, offset: 0, loginRequired: false, priceRegular: 880, priceDaytime: 880, priceSolo: 880, guitarAmps: ['Positive Grid REACTOR 50', 'Spark 2 + Spark CAB'], bassAmp: '', drumSet: '' },
      { id: 'noah-shibuya3-booth2', studioId: 3298, name: 'Booth2 (3.5帖)', tatami: 4, offset: 0, loginRequired: false, priceRegular: 880, priceDaytime: 880, priceSolo: 880, guitarAmps: ['Positive Grid REACTOR 50', 'Spark 2 + Spark CAB'], bassAmp: '', drumSet: '' },
      { id: 'noah-shibuya3-booth3', studioId: 3299, name: 'Booth3 (3帖)', tatami: 3, offset: 0, loginRequired: false, priceRegular: 880, priceDaytime: 880, priceSolo: 880, guitarAmps: ['Positive Grid REACTOR 50', 'Spark 2 + Spark CAB'], bassAmp: '', drumSet: '' },
      { id: 'noah-shibuya3-booth4', studioId: 3300, name: 'Booth4 (3.5帖)', tatami: 4, offset: 0, loginRequired: false, priceRegular: 880, priceDaytime: 880, priceSolo: 880, guitarAmps: ['Positive Grid REACTOR 50', 'Spark 2 + Spark CAB'], bassAmp: '', drumSet: '' },
      { id: 'noah-shibuya3-recbooth', studioId: 3289, name: 'Rec.booth (4帖)', tatami: 4, offset: 30, loginRequired: false, priceRegular: 2310, priceDaytime: 1870, priceSolo: 880, guitarAmps: [], bassAmp: '', drumSet: '' },
      { id: 'noah-shibuya3-recstudio', studioId: 3277, name: 'REC STUDIO (11帖)', tatami: 11, offset: 0, loginRequired: false, priceRegular: 2640, priceDaytime: 2200, priceSolo: 1650, guitarAmps: [], bassAmp: '', drumSet: '' },
    ],
  },
  // 5. 新宿店 (21室)
  {
    key: 'shinjuku',
    name: 'サウンドスタジオノア 新宿店',
    rooms: [
      { id: 'noah-shinjuku-s1st', studioId: 204, name: 'S1st (7帖)', tatami: 7, offset: 30, loginRequired: false, priceRegular: 2640, priceDaytime: 1870, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'markbass little mark iv + Standard104HF', drumSet: 'Pearl MCX series' },
      { id: 'noah-shinjuku-s2st', studioId: 205, name: 'S2st (7帖)', tatami: 7, offset: 0, loginRequired: false, priceRegular: 2530, priceDaytime: 1760, priceSolo: 770, guitarAmps: [JCM900], bassAmp: 'DARKGLASS Microtubes900 + DG410C', drumSet: 'Pearl MMP series' },
      { id: 'noah-shinjuku-s3st', studioId: 206, name: 'S3st (7帖)', tatami: 7, offset: 0, loginRequired: false, priceRegular: 2530, priceDaytime: 1760, priceSolo: 770, guitarAmps: [JCM900], bassAmp: 'Markbass Little Mark Tube + Standard104HF', drumSet: 'Pearl MRP series' },
      { id: 'noah-shinjuku-a1st', studioId: 207, name: 'A1st (9帖)', tatami: 9, offset: 30, loginRequired: false, priceRegular: 3080, priceDaytime: 1980, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Markbass Little Mark Tube + Standard104HF', drumSet: 'Pearl RFP series' },
      { id: 'noah-shinjuku-a2st', studioId: 208, name: 'A2st (10帖)', tatami: 10, offset: 30, loginRequired: false, priceRegular: 3190, priceDaytime: 2090, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT450H + 810E', drumSet: 'Pearl MMP series' },
      { id: 'noah-shinjuku-a3st', studioId: 209, name: 'A3st (10帖)', tatami: 10, offset: 30, loginRequired: false, priceRegular: 3190, priceDaytime: 2090, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT450H + 810E', drumSet: 'SAKAE The Almighty' },
      { id: 'noah-shinjuku-a5st', studioId: 210, name: 'A5st (10帖)', tatami: 10, offset: 30, loginRequired: false, priceRegular: 3190, priceDaytime: 2090, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT450H + 810E', drumSet: 'Pearl MMP series' },
      { id: 'noah-shinjuku-a6st', studioId: 211, name: 'A6st (9帖)', tatami: 9, offset: 0, loginRequired: false, priceRegular: 3080, priceDaytime: 1980, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT450H + 810E', drumSet: 'Pearl RFP series' },
      { id: 'noah-shinjuku-a7st', studioId: 212, name: 'A7st (9帖)', tatami: 9, offset: 0, loginRequired: false, priceRegular: 3080, priceDaytime: 1980, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Markbass Little Mark Tube + Standard104HF', drumSet: 'Pearl MRP series' },
      { id: 'noah-shinjuku-g1st', studioId: 213, name: 'G1st (11帖)', tatami: 11, offset: 0, loginRequired: false, priceRegular: 3300, priceDaytime: 2200, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Markbass Little Mark IV', drumSet: 'Pearl RFP series' },
      { id: 'noah-shinjuku-g2st', studioId: 214, name: 'G2st (11帖)', tatami: 11, offset: 0, loginRequired: false, priceRegular: 3300, priceDaytime: 2200, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'EBS Classic 450 + Classic 810', drumSet: 'Pearl RF series' },
      { id: 'noah-shinjuku-g3st', studioId: 215, name: 'G3st (11帖)', tatami: 11, offset: 0, loginRequired: false, priceRegular: 3300, priceDaytime: 2200, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'EBS Reidmar502 + ClassicLine810', drumSet: 'SAKAE The Almighty' },
      { id: 'noah-shinjuku-b1st', studioId: 216, name: 'B1st (12帖)', tatami: 12, offset: 30, loginRequired: true, priceRegular: 3520, priceDaytime: 2310, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS Little Mark Rocker 500 + Standard108HR', drumSet: 'Pearl RF series' },
      { id: 'noah-shinjuku-b2st', studioId: 217, name: 'B2st (12帖)', tatami: 12, offset: 30, loginRequired: true, priceRegular: 3520, priceDaytime: 2310, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT450H + 810E', drumSet: 'SONOR SQ1 Series' },
      { id: 'noah-shinjuku-b3st', studioId: 218, name: 'B3st (13帖)', tatami: 13, offset: 30, loginRequired: true, priceRegular: 3630, priceDaytime: 2420, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'aguilar TONE HAMMER500 + DB810', drumSet: 'SAKAE The Almighty' },
      { id: 'noah-shinjuku-e1st', studioId: 219, name: 'E1st (18帖)', tatami: 18, offset: 0, loginRequired: true, priceRegular: 4510, priceDaytime: 3300, priceSolo: 1100, guitarAmps: ['Fender Twin Reverb', 'Marshall JCM2000 DSL100+1960A', JC120], bassAmp: 'Ampeg SVT-3PRO + 810E', drumSet: "DW Collector's Set" },
      { id: 'noah-shinjuku-e2st', studioId: 220, name: 'E2st (15帖)', tatami: 15, offset: 30, loginRequired: true, priceRegular: 4070, priceDaytime: 2860, priceSolo: 1100, guitarAmps: ['Marshall JCM2000 DSL100+1960A', JC120], bassAmp: 'Ampeg SVT450H + 810E', drumSet: 'YAMAHA Recording Custom' },
      { id: 'noah-shinjuku-e3st', studioId: 221, name: 'E3st (16帖)', tatami: 16, offset: 0, loginRequired: true, priceRegular: 4180, priceDaytime: 2970, priceSolo: 1100, guitarAmps: ['Marshall JCM2000 DSL100+1960A', JC120], bassAmp: 'MARKBASS Little Mark Vintage', drumSet: 'SAKAE The Almighty' },
      { id: 'noah-shinjuku-csst', studioId: 3045, name: 'CSst+Sub (30帖)', tatami: 30, offset: 0, loginRequired: true, priceRegular: 6380, priceDaytime: 4400, priceSolo: 1320, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT450H + 810E', drumSet: "DW Collector's Series" },
      { id: 'noah-shinjuku-fst', studioId: 3046, name: 'Fst (14帖)', tatami: 14, offset: 0, loginRequired: true, priceRegular: 3960, priceDaytime: 2750, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'Darkglass ALPHA·OMEGA 900 + DG410N', drumSet: 'SJC tour series' },
      { id: 'noah-shinjuku-recstudio', studioId: 3048, name: 'REC STUDIO (6帖)', tatami: 6, offset: 0, loginRequired: false, priceRegular: 2200, priceDaytime: 1980, priceSolo: 880, guitarAmps: [], bassAmp: '', drumSet: '' },
    ],
  },
  // 6. 秋葉原店 (14室)
  {
    key: 'akihabara',
    name: 'サウンドスタジオノア 秋葉原店',
    rooms: [
      { id: 'noah-akihabara-a1st', studioId: 222, name: 'A1st (8帖)', tatami: 8, offset: 0, loginRequired: false, priceRegular: 2970, priceDaytime: 1760, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS LMR500', drumSet: 'Pearl MRP series' },
      { id: 'noah-akihabara-a2st', studioId: 223, name: 'A2st (8帖)', tatami: 8, offset: 0, loginRequired: false, priceRegular: 2970, priceDaytime: 1760, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Hartke LX8500 + 4.5XL', drumSet: 'Pearl MMP series (12"+13"+16"+22")' },
      { id: 'noah-akihabara-a3st', studioId: 224, name: 'A3st (9帖)', tatami: 9, offset: 30, loginRequired: false, priceRegular: 3080, priceDaytime: 1870, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS Little Mark IV + Standard104HF', drumSet: 'Pearl MMP series' },
      { id: 'noah-akihabara-g1st', studioId: 225, name: 'G1st (12帖)', tatami: 12, offset: 0, loginRequired: false, priceRegular: 3410, priceDaytime: 2310, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS Little Mark IV + 108HR', drumSet: 'SAKAE The Almighty' },
      { id: 'noah-akihabara-g2st', studioId: 226, name: 'G2st (9.5帖)', tatami: 10, offset: 30, loginRequired: false, priceRegular: 3190, priceDaytime: 1980, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS LM250 + 108HR', drumSet: 'SAKAE The Almighty' },
      { id: 'noah-akihabara-gsst', studioId: 227, name: 'GSst (10帖)', tatami: 10, offset: 0, loginRequired: false, priceRegular: 3190, priceDaytime: 2090, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3PRO + 810', drumSet: 'SAKAE The Almighty' },
      { id: 'noah-akihabara-recbooth', studioId: 228, name: 'REC.booth (5帖)', tatami: 5, offset: 0, loginRequired: false, priceRegular: 1650, priceDaytime: 1430, priceSolo: 880, guitarAmps: [], bassAmp: '', drumSet: '' },
      { id: 'noah-akihabara-b1st', studioId: 229, name: 'B1st (14帖)', tatami: 14, offset: 0, loginRequired: true, priceRegular: 3850, priceDaytime: 2640, priceSolo: 880, guitarAmps: ['Marshall JCM2000 DSL100+1960A', JC120], bassAmp: 'MARKBASS Little Mark Vintage', drumSet: 'LUDWIG Classic Maple series' },
      { id: 'noah-akihabara-b2st', studioId: 230, name: 'B2st (13帖)', tatami: 13, offset: 0, loginRequired: true, priceRegular: 3740, priceDaytime: 2530, priceSolo: 880, guitarAmps: ['Marshall JCM2000 DSL100+1960A', JC120], bassAmp: 'Ampeg SVT-3PRO + 810', drumSet: 'Pearl Reference PURE series' },
      { id: 'noah-akihabara-e1st', studioId: 231, name: 'E1st (21帖)', tatami: 21, offset: 30, loginRequired: true, priceRegular: 4510, priceDaytime: 3300, priceSolo: 990, guitarAmps: ['Marshall JCM2000 DSL100+1960A', JC120], bassAmp: 'EBS HD360 + ProLine810', drumSet: 'Pearl RFP series' },
      { id: 'noah-akihabara-e2st', studioId: 232, name: 'E2st (20帖)', tatami: 20, offset: 0, loginRequired: true, priceRegular: 4510, priceDaytime: 3300, priceSolo: 990, guitarAmps: ['Marshall JCM2000 DSL100+1960A', JC120], bassAmp: 'MARKBASS LMR500 + 108HR', drumSet: 'SONOR ProLite series' },
      { id: 'noah-akihabara-cst', studioId: 233, name: 'Cst+Sub (24帖)', tatami: 24, offset: 0, loginRequired: true, priceRegular: 5720, priceDaytime: 4070, priceSolo: 1210, guitarAmps: ['Marshall JCM2000 DSL100+1960A', JC120, 'Fender Twin Reverb 65'], bassAmp: 'MARKBASS Vintage + 108HR', drumSet: "DW Collector's Maple Set" },
      { id: 'noah-akihabara-booth1', studioId: 234, name: 'Booth1 (3帖)', tatami: 3, offset: 30, loginRequired: false, priceRegular: 770, priceDaytime: 770, priceSolo: 770, guitarAmps: [], bassAmp: '', drumSet: '' },
      { id: 'noah-akihabara-booth2', studioId: 235, name: 'Booth2 (3帖)', tatami: 3, offset: 30, loginRequired: false, priceRegular: 770, priceDaytime: 770, priceSolo: 770, guitarAmps: [], bassAmp: '', drumSet: '' },
    ],
  },
  // 7. 御茶ノ水店 (11室)
  {
    key: 'ochanomizu',
    name: 'サウンドスタジオノア 御茶ノ水店',
    rooms: [
      { id: 'noah-ochanomizu-booth', studioId: 3016, name: 'Booth (4帖)', tatami: 4, offset: 0, loginRequired: false, priceRegular: 880, priceDaytime: 880, priceSolo: 880, guitarAmps: [], bassAmp: '', drumSet: '' },
      { id: 'noah-ochanomizu-a1st', studioId: 3015, name: 'A1st (8.5帖)', tatami: 9, offset: 0, loginRequired: false, priceRegular: 2970, priceDaytime: 1870, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Aguilar Tone Hammer 500 + DB410', drumSet: 'SAKAE Evolved' },
      { id: 'noah-ochanomizu-a2st', studioId: 3179, name: 'A2st (8.5帖)', tatami: 9, offset: 0, loginRequired: false, priceRegular: 2970, priceDaytime: 1870, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Darkglass MICROTUBES 500V2 + DG410N + DG210N', drumSet: 'PEARL REFERENCE PURE' },
      { id: 'noah-ochanomizu-a3st', studioId: 3019, name: 'A3st (8.5帖)', tatami: 9, offset: 30, loginRequired: false, priceRegular: 2970, priceDaytime: 1870, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3PRO + PN-410HLF', drumSet: 'Gretsch Limited Edition USA Custom 5 Piece' },
      { id: 'noah-ochanomizu-a5st', studioId: 3023, name: 'A5st (9帖)', tatami: 9, offset: 30, loginRequired: false, priceRegular: 2970, priceDaytime: 1870, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS Little Mark Vintage + STANDARD104HF', drumSet: 'CANOPUS YAIBA II' },
      { id: 'noah-ochanomizu-gst', studioId: 3178, name: 'Gst (12帖)', tatami: 12, offset: 30, loginRequired: false, priceRegular: 3300, priceDaytime: 2200, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'PJB BP800 + 6B9T', drumSet: 'PEARL Masters Maple GUM' },
      { id: 'noah-ochanomizu-cst', studioId: 3018, name: 'Cst (18帖)', tatami: 18, offset: 0, loginRequired: true, priceRegular: 4620, priceDaytime: 3300, priceSolo: 1100, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3PRO + SVT810E', drumSet: "DW Collector's Maple Set" },
      { id: 'noah-ochanomizu-b1st', studioId: 3022, name: 'B1st (13帖)', tatami: 13, offset: 30, loginRequired: true, priceRegular: 3740, priceDaytime: 2640, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS Little Mark IV + STANDARD108HR', drumSet: 'PEARL MRS' },
      { id: 'noah-ochanomizu-b2st', studioId: 3024, name: 'B2st (14帖)', tatami: 14, offset: 0, loginRequired: true, priceRegular: 3850, priceDaytime: 2750, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3PRO + SVT810E', drumSet: 'SONOR SQ1' },
      { id: 'noah-ochanomizu-b3st', studioId: 3025, name: 'B3st (14帖)', tatami: 14, offset: 0, loginRequired: true, priceRegular: 3850, priceDaytime: 2750, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS Little Mark IV + STANDARD108HR', drumSet: 'TAMA Starclassic Maple series' },
      { id: 'noah-ochanomizu-est', studioId: 3020, name: 'Est (15帖)', tatami: 15, offset: 30, loginRequired: true, priceRegular: 4070, priceDaytime: 2860, priceSolo: 990, guitarAmps: [JCM900, JC120], bassAmp: 'orange 4stroke LTD + OBC810', drumSet: "DW Collector's Series" },
    ],
  },
  // 8. 高田馬場店 (15室)
  {
    key: 'takadanobaba',
    name: 'サウンドスタジオノア 高田馬場店',
    rooms: [
      { id: 'noah-takadanobaba-a1st', studioId: 116, name: 'A1st (8帖)', tatami: 8, offset: 0, loginRequired: false, priceRegular: 2860, priceDaytime: 1650, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg B2RE', drumSet: 'Pearl MSX series (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-takadanobaba-a2st', studioId: 117, name: 'A2st (9帖)', tatami: 9, offset: 0, loginRequired: false, priceRegular: 2970, priceDaytime: 1760, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg VENTURE V3', drumSet: 'Pearl MSX series (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-takadanobaba-a3st', studioId: 118, name: 'A3st (8帖)', tatami: 8, offset: 30, loginRequired: false, priceRegular: 2860, priceDaytime: 1650, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3pro', drumSet: 'Pearl MSX series (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-takadanobaba-a5st', studioId: 119, name: 'A5st (8帖)', tatami: 8, offset: 30, loginRequired: false, priceRegular: 2860, priceDaytime: 1650, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS Little Mark Rocker 500', drumSet: 'SAKAE The Almighty' },
      { id: 'noah-takadanobaba-g1st', studioId: 120, name: 'G1st (11帖)', tatami: 11, offset: 0, loginRequired: false, priceRegular: 3190, priceDaytime: 1870, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3pro', drumSet: 'Pearl MSX series (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-takadanobaba-g2st', studioId: 121, name: 'G2st (11帖)', tatami: 11, offset: 30, loginRequired: false, priceRegular: 3190, priceDaytime: 1870, priceSolo: 770, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS Little Mark Rocker 500', drumSet: 'SAKAE The Almighty Birch (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-takadanobaba-b1st', studioId: 122, name: 'B1st (14帖)', tatami: 14, offset: 0, loginRequired: true, priceRegular: 3520, priceDaytime: 2200, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS Little Mark Vintage + Standard108HR', drumSet: 'SAKAE the Almighty (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-takadanobaba-b2st', studioId: 123, name: 'B2st (14帖)', tatami: 14, offset: 30, loginRequired: true, priceRegular: 3520, priceDaytime: 2200, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3pro', drumSet: 'YAMAHA Recording Custom (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-takadanobaba-b3st', studioId: 124, name: 'B3st (14帖)', tatami: 14, offset: 30, loginRequired: true, priceRegular: 3520, priceDaytime: 2200, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3pro', drumSet: 'Pearl MMX series (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-takadanobaba-est', studioId: 125, name: 'Est (17帖)', tatami: 17, offset: 0, loginRequired: true, priceRegular: 3850, priceDaytime: 2750, priceSolo: 880, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H', drumSet: 'Pearl Reference series (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-takadanobaba-fst', studioId: 126, name: 'Fst (21帖)', tatami: 21, offset: 0, loginRequired: true, priceRegular: 4290, priceDaytime: 3080, priceSolo: 990, guitarAmps: [JCM900, "Fender Twin Reverb '65", JC120], bassAmp: 'Fender TB600 Head + 810 Cabinet', drumSet: 'SONOR SQ1 Series (10"HT+12"LT+16"FT+22"BD)' },
      { id: 'noah-takadanobaba-cstsub', studioId: 127, name: 'Cst+Sub (30帖+5帖)', tatami: 30, offset: 0, loginRequired: true, priceRegular: 5940, priceDaytime: 4180, priceSolo: 1100, guitarAmps: [JCM900, "Fender Twin Reverb '65", JC120], bassAmp: 'Ampeg SVT 450H/SVT810E', drumSet: "DW Collector's Maple Set (12x9,13x10,16x14,22x18)" },
      { id: 'noah-takadanobaba-booth1', studioId: 128, name: 'Booth.1 (3帖)', tatami: 3, offset: 0, loginRequired: false, priceRegular: 770, priceDaytime: 770, priceSolo: 770, guitarAmps: [], bassAmp: '', drumSet: '' },
      { id: 'noah-takadanobaba-booth2', studioId: 130, name: 'Booth.2 (4帖)', tatami: 4, offset: 30, loginRequired: false, priceRegular: 770, priceDaytime: 770, priceSolo: 770, guitarAmps: [JC120], bassAmp: '', drumSet: '' },
      { id: 'noah-takadanobaba-recbooth', studioId: 129, name: 'REC.Booth (5帖)', tatami: 5, offset: 30, loginRequired: false, priceRegular: 1760, priceDaytime: 1540, priceSolo: 880, guitarAmps: [], bassAmp: '', drumSet: '' },
    ],
  },
  // 9. 池袋店 (11室) - scripts/scan-noah-branch.ts ikebukuro (branch_id=13) で実データ確認済み
  {
    key: 'ikebukuro',
    name: 'サウンドスタジオノア 池袋店',
    rooms: [
      { id: 'noah-ikebukuro-sst', studioId: 142, name: 'Sst (6.5帖)', tatami: 6.5, offset: 0, loginRequired: false, priceRegular: 2300, priceDaytime: 1500, priceSolo: 700, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-450H', drumSet: 'Pearl MMX series (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-ikebukuro-a1st', studioId: 143, name: 'A1st (8帖)', tatami: 8, offset: 0, loginRequired: false, priceRegular: 2600, priceDaytime: 1600, priceSolo: 700, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg Venture V3', drumSet: 'Pearl MMX series (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-ikebukuro-a2st', studioId: 144, name: 'A2st (8帖)', tatami: 8, offset: 0, loginRequired: false, priceRegular: 2600, priceDaytime: 1600, priceSolo: 700, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS BIG BANG', drumSet: 'SAKAE The Almighty (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-ikebukuro-a3st', studioId: 145, name: 'A3st (8帖)', tatami: 8, offset: 0, loginRequired: false, priceRegular: 2600, priceDaytime: 1600, priceSolo: 700, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3pro', drumSet: 'Pearl MMX series (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-ikebukuro-a5st', studioId: 146, name: 'A5st (10帖)', tatami: 10, offset: 0, loginRequired: false, priceRegular: 2800, priceDaytime: 1700, priceSolo: 700, guitarAmps: [JCM900, JC120], bassAmp: 'EBS Classic 450', drumSet: 'SAKAE The Almighty' },
      { id: 'noah-ikebukuro-b1st', studioId: 147, name: 'B1st (14帖)', tatami: 14, offset: 0, loginRequired: true, priceRegular: 3300, priceDaytime: 2200, priceSolo: 800, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3pro', drumSet: 'YAMAHA Absolute Hybrid Maple (10"HT+12"LT+16"FT+22"BD)' },
      { id: 'noah-ikebukuro-b2st', studioId: 148, name: 'B2st (13帖)', tatami: 13, offset: 0, loginRequired: true, priceRegular: 3200, priceDaytime: 2100, priceSolo: 800, guitarAmps: [JCM900, JC120], bassAmp: 'Ampeg SVT-3pro', drumSet: 'Pearl MMX series (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-ikebukuro-e1stsub', studioId: 149, name: 'E1st+Sub (20帖)', tatami: 20, offset: 0, loginRequired: true, priceRegular: 4600, priceDaytime: 3200, priceSolo: 900, guitarAmps: [`${JCM900} ×2台`, JC120], bassAmp: 'Ampeg SVT-3pro', drumSet: "DW Collector's Maple Set (10\"HT+12\"HT+13\"LT+16\"FT+22\"BD)" },
      { id: 'noah-ikebukuro-e2stsub', studioId: 150, name: 'E2st+Sub (16帖)', tatami: 16, offset: 0, loginRequired: true, priceRegular: 3700, priceDaytime: 2600, priceSolo: 900, guitarAmps: [JCM900, JC120], bassAmp: 'MARKBASS Little Mark IV 300', drumSet: 'Pearl Reference series (12"HT+13"LT+16"FT+22"BD)' },
      { id: 'noah-ikebukuro-booth1', studioId: 151, name: 'Booth1 (3帖)', tatami: 3, offset: 0, loginRequired: false, priceRegular: 700, priceDaytime: 700, priceSolo: 700, guitarAmps: [], bassAmp: '', drumSet: '' },
      { id: 'noah-ikebukuro-booth2', studioId: 3273, name: 'Booth2 (2.5帖)', tatami: 2.5, offset: 30, loginRequired: false, priceRegular: 700, priceDaytime: 700, priceSolo: 700, guitarAmps: [], bassAmp: '', drumSet: '' },
    ],
  },
];
