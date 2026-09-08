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
  area: string; // "all" or "渋谷", "新宿", etc.
  minTatami: number;
  tatamiRanges: string[]; // 'under9' | '10to12' | '13to15' | '16plus'
  requireJc120: boolean;
  requireMarshall: boolean;
  requireRecording: boolean;
  showEarlyMorning: boolean; // 6:00〜9:00の早朝枠を表示するか
  requireLongHours: boolean; // 24時間営業または深夜・早朝対応スタジオのみ
  allowAdjacent30Min: boolean; // 前後30分（±30分）の枠も空きとして含めるか（デフォルトON）
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
