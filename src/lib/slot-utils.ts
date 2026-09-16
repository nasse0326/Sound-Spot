import { RoomWithSlots, AvailabilitySlot } from '@/types/studio';

export interface RoomAvailabilityMatch {
  isAvailable: boolean;
  matchType: 'exact' | 'early30' | 'late30' | 'none' | 'phone_only' | 'unfetched';
  matchedStartTime?: string; // e.g. 11:00, 10:30, 11:30
  matchedEndTime?: string;   // e.g. 12:00, 11:30, 12:30
  label: string;             // e.g. 空き, 10:30~ 空き, 11:30~ 空き, 満室, 要TEL, 未取得
  availableCandidateTimes: string[]; // e.g. [10:30, 11:30]
}

// Convert HH:MM string to minutes from 00:00
export function timeStringToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

// Convert minutes from 00:00 to HH:MM
export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Check if slot data exists for a specified window [startMin, endMin].
 */
export function hasSlotDataForWindow(slots: AvailabilitySlot[], startMin: number, endMin: number): boolean {
  if (!slots || slots.length === 0) return false;
  return slots.some((slot) => {
    const sDate = new Date(slot.startTime);
    const eDate = new Date(slot.endTime);
    const sMin = sDate.getHours() * 60 + sDate.getMinutes();
    let eMin = eDate.getHours() * 60 + eDate.getMinutes();
    if (eMin === 0 && eDate.getDate() !== sDate.getDate()) {
      eMin = 24 * 60;
    }
    return sMin < endMin && eMin > startMin;
  });
}

/**
 * Check if a room has continuous available slots for a specified window [startMin, endMin].
 */
export function isWindowAvailable(slots: AvailabilitySlot[], startMin: number, endMin: number): boolean {
  if (!slots || slots.length === 0) return false;

  // Find all slots that overlap with [startMin, endMin]
  const relevantSlots = slots.filter((slot) => {
    const sDate = new Date(slot.startTime);
    const eDate = new Date(slot.endTime);
    const sMin = sDate.getHours() * 60 + sDate.getMinutes();
    let eMin = eDate.getHours() * 60 + eDate.getMinutes();
    if (eMin === 0 && eDate.getDate() !== sDate.getDate()) {
      eMin = 24 * 60; // midnight next day
    }
    return sMin < endMin && eMin > startMin;
  });

  if (relevantSlots.length === 0) return false;

  // All relevant slots must be available
  const allAvailable = relevantSlots.every((s) => s.status === 'available');
  if (!allAvailable) return false;

  // Ensure there are no gaps between slots covering [startMin, endMin]
  const minCovered = Math.min(
    ...relevantSlots.map((s) => {
      const d = new Date(s.startTime);
      return d.getHours() * 60 + d.getMinutes();
    })
  );
  const maxCovered = Math.max(
    ...relevantSlots.map((s) => {
      const d = new Date(s.endTime);
      let m = d.getHours() * 60 + d.getMinutes();
      if (m === 0 && d.getDate() !== new Date(s.startTime).getDate()) m = 24 * 60;
      return m;
    })
  );

  return minCovered <= startMin && maxCovered >= endMin;
}

/**
 * Find real available slot start times within ±toleranceMin of targetStartMin that can
 * host the full requested duration, based on the room's actual slot data (not an assumed
 * :00/:30 grid). This is what lets rooms with unusual offsets (:15, :45, etc.) surface as
 * "close enough" candidates instead of only ever matching an exact ±30 minute grid point.
 */
function findNearbyAvailableStarts(
  slots: AvailabilitySlot[],
  targetStartMin: number,
  duration: number,
  toleranceMin: number = 30
): number[] {
  const candidates = new Set<number>();
  for (const slot of slots) {
    if (slot.status !== 'available') continue;
    const d = new Date(slot.startTime);
    const startMin = d.getHours() * 60 + d.getMinutes();
    if (startMin === targetStartMin) continue; // exact match is handled separately
    if (Math.abs(startMin - targetStartMin) <= toleranceMin) {
      candidates.add(startMin);
    }
  }
  return [...candidates]
    .filter((startMin) => isWindowAvailable(slots, startMin, startMin + duration))
    .sort((a, b) => a - b);
}

/**
 * Check room availability with optional ±30 minute tolerance.
 */
export function checkRoomAvailability(
  room: RoomWithSlots,
  targetStartTime: string,
  targetEndTime: string,
  allowAdjacent30Min: boolean = true
): RoomAvailabilityMatch {
  const isPhoneOnly = room.studio?.chainName?.includes('PENTA') || (!room.studio?.bookingUrl && !!room.studio?.tel);

  if (!room.slots || room.slots.length === 0) {
    if (isPhoneOnly) {
      return {
        isAvailable: false,
        matchType: 'phone_only',
        label: '要TEL',
        availableCandidateTimes: [],
      };
    }
    return {
      isAvailable: false,
      matchType: 'unfetched',
      label: '未取得',
      availableCandidateTimes: [],
    };
  }

  const targetStartMin = timeStringToMinutes(targetStartTime);
  const targetEndMin = timeStringToMinutes(targetEndTime);
  const duration = Math.max(60, targetEndMin - targetStartMin);

  // 1. Check exact match: [targetStartMin, targetStartMin + duration]
  // ただし、この部屋が実際に開始できる時刻（startTimeOffsetを起点に
  // bookingStartGranularityMinutes刻みの各点）に乗っていない検索時刻に対しては
  // 「完全一致」を名乗らせない。isWindowAvailableは重なり合う複数スロットの和集合が
  // 連続していれば true を返すため、例えば15分開始の部屋に対して00分ちょうどで検索すると
  // 前後2つの実スロット（13:15-14:15と14:15-15:15）がどちらも空いているだけで
  // 「14:00ちょうどに空きあり」という誤った完全一致判定になってしまう
  // （実際にはこの部屋は14:00という時刻では予約できない）。
  // bookingStartGranularityMinutes省略時は60分刻み（毎時startTimeOffset分のみ）が
  // 従来通りのデフォルト。GOODMAN AKIBAのように30分刻みで:00/:30どちらからでも
  // 開始できる部屋はgranularity=30を指定することで、:30の検索も正しく「一致」になる。
  const roomOffset = room.startTimeOffset || 0;
  const granularity = room.bookingStartGranularityMinutes || 60;
  const isAlignedToRoomGrid = (((targetStartMin - roomOffset) % granularity) + granularity) % granularity === 0;
  const exactAvailable = isAlignedToRoomGrid && isWindowAvailable(room.slots, targetStartMin, targetStartMin + duration);
  if (exactAvailable) {
    return {
      isAvailable: true,
      matchType: 'exact',
      matchedStartTime: targetStartTime,
      matchedEndTime: targetEndTime,
      label: '空き',
      availableCandidateTimes: [targetStartTime],
    };
  }

  // 2. ±30分以内の実スロットを直接スキャン（:00/:30グリッド前提を排除し、
  //    :15/:45等の変則的な開始オフセットの部屋も候補として正しく拾えるようにする）
  if (allowAdjacent30Min) {
    const nearbyStarts = findNearbyAvailableStarts(room.slots, targetStartMin, duration, 30);
    if (nearbyStarts.length > 0) {
      const candidateTimes = nearbyStarts.map(minutesToTimeString);
      const firstStart = nearbyStarts[0];
      const matchType = firstStart < targetStartMin ? 'early30' : 'late30';
      return {
        isAvailable: true,
        matchType,
        matchedStartTime: candidateTimes[0],
        matchedEndTime: minutesToTimeString(firstStart + duration),
        label: `${candidateTimes.join('/')}~ 空き`,
        availableCandidateTimes: candidateTimes,
      };
    }
  }

  // Check if slot data exists for exact target window
  const hasExactData = hasSlotDataForWindow(room.slots, targetStartMin, targetStartMin + duration);
  if (!hasExactData) {
    return {
      isAvailable: false,
      matchType: 'unfetched',
      label: '未取得',
      availableCandidateTimes: [],
    };
  }

  return {
    isAvailable: false,
    matchType: 'none',
    label: '満室',
    availableCandidateTimes: [],
  };
}
