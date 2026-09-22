export type SlotStatus = 'available' | 'booked' | 'unopened' | 'maintenance';

export interface Studio {
  id: string;
  name: string;
  chainName: string;
  area: string;
  prefecture: string;
  nearestStation: string;
  address: string;
  tel?: string;
  bookingUrl: string;
  groupBookingRule?: string;
  groupBookingLeadMonths: number;
  soloBookingRule?: string;
  soloBookingLeadHours: number;
  websiteUrl?: string;
  businessHoursSummary?: string;
  is24Hours?: boolean;
}

export interface RoomEquipment {
  id: string;
  roomId: string;
  guitarAmps: string[];
  bassAmp: string;
  drumSet: string;
  isTwinPedalAllowed: boolean;
  paSystem?: string;
  keyboards?: string[];
  cymbalsDetail?: string;
  additionalNotes?: string;
}

export interface Room {
  id: string;
  studioId: string;
  name: string;
  floor?: string;
  sizeTatami: number;
  capacity: number;
  pricePerHourRegular: number;
  pricePerHourDaytime: number;
  pricePerHourSolo: number;
  hasMirror: boolean;
  hasRecording: boolean;
  startTimeOffset: number; // 0 for :00, 30 for :30
  /**
   * この部屋が実際に開始できる時刻の刻み幅（分）。省略時は60（=毎時00分など、
   * startTimeOffsetで指定した1点のみが有効な開始時刻）として扱う。
   * GOODMAN AKIBAのように「:00からでも:30からでも開始できる」店舗は30を指定する
   * （startTimeOffsetは0のままで、そこから30分刻みで有効、という意味になる）。
   * startTimeOffsetが「常に固定の1点でしか開始できない」場合と、この値が
   * 「その点から刻み幅ごとに複数の開始時刻がある」場合とで意味が異なる点に注意。
   */
  bookingStartGranularityMinutes?: number;
  orderIndex?: number;
  imageUrl?: string;
  equipment?: RoomEquipment;
  studio?: Studio;
}

export interface AvailabilitySlot {
  id: string;
  roomId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  status: SlotStatus;
}

export type BookingType = 'band' | 'solo';

export interface SearchFilterParams {
  date: string; // YYYY-MM-DD
  startTime: string; // "14:00"
  endTime: string;   // "15:00"
  bookingType: BookingType;
  area?: string; // 後方互換用: "all" or "渋谷", "新宿", etc.
  areas?: string[]; // 複数選択エリア: ['渋谷', '新宿'] 等（未選択時は全エリア）
  minTatami: number;
  tatamiRanges: string[]; // 'under9' | '10to12' | '13to15' | '16plus'
  requireJc120: boolean;
  requireMarshall: boolean;
  requireRecording: boolean;
  showEarlyMorning: boolean; // 6:00〜9:00の早朝枠を表示するか
  requireLongHours: boolean; // 24時間営業または深夜・早朝対応スタジオのみ
  allowAdjacent30Min: boolean; // 前後1時間（±1時間、15分刻みのズレも含む）の枠も空きとして含めるか（デフォルトON）
}

export interface RoomWithSlots extends Room {
  studio: Studio;
  equipment: RoomEquipment;
  slots: AvailabilitySlot[];
  isMatchTargetWindow?: boolean;
  matchedSlotsSummary?: {
    totalHours: number;
    isFullyAvailable: boolean;
    hasShift30MinCandidate: boolean;
  };
}
