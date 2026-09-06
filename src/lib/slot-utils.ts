import { RoomWithSlots, AvailabilitySlot } from '@/types/studio';

export interface RoomAvailabilityMatch {
  isAvailable: boolean;
  matchType: 'exact' | 'early30' | 'late30' | 'none' | 'phone_only';
  matchedStartTime?: string; // e.g. 11:00, 10:30, 11:30
  matchedEndTime?: string;   // e.g. 12:00, 11:30, 12:30
  label: string;             // e.g. 空き, 10:30~ 空き, 11:30~ 空き, 満室, 電話受付
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
 * Check room availability with optional ±30 minute tolerance.
 */
export function checkRoomAvailability(
  room: RoomWithSlots,
  targetStartTime: string,
  targetEndTime: string,
  allowAdjacent30Min: boolean = true
): RoomAvailabilityMatch {
  if (!room.slots || room.slots.length === 0) {
    return {
      isAvailable: false,
      matchType: 'phone_only',
      label: '電話受付',
      availableCandidateTimes: [],
    };
  }

  const targetStartMin = timeStringToMinutes(targetStartTime);
  const targetEndMin = timeStringToMinutes(targetEndTime);
  const duration = Math.max(60, targetEndMin - targetStartMin);

  // 1. Check exact match: [targetStartMin, targetStartMin + duration]
  const exactAvailable = isWindowAvailable(room.slots, targetStartMin, targetStartMin + duration);
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

  // If adjacent 30 min matching is disabled, stop here
  if (!allowAdjacent30Min) {
    return {
      isAvailable: false,
      matchType: 'none',
      label: '満室',
      availableCandidateTimes: [],
    };
  }

  // 2. Check early by 30 min: [targetStartMin - 30, targetStartMin - 30 + duration]
  const earlyStartMin = targetStartMin - 30;
  const earlyAvailable = earlyStartMin >= 0 && isWindowAvailable(room.slots, earlyStartMin, earlyStartMin + duration);
  const earlyTimeStr = minutesToTimeString(earlyStartMin);

  // 3. Check late by 30 min: [targetStartMin + 30, targetStartMin + 30 + duration]
  const lateStartMin = targetStartMin + 30;
  const lateAvailable = lateStartMin + duration <= 24 * 60 && isWindowAvailable(room.slots, lateStartMin, lateStartMin + duration);
  const lateTimeStr = minutesToTimeString(lateStartMin);

  const candidateTimes: string[] = [];
  if (earlyAvailable) candidateTimes.push(earlyTimeStr);
  if (lateAvailable) candidateTimes.push(lateTimeStr);

  if (earlyAvailable && lateAvailable) {
    return {
      isAvailable: true,
      matchType: 'early30',
      matchedStartTime: earlyTimeStr,
      matchedEndTime: minutesToTimeString(earlyStartMin + duration),
      label: `${earlyTimeStr}/${lateTimeStr}~ 空き`,
      availableCandidateTimes: candidateTimes,
    };
  }

  if (earlyAvailable) {
    return {
      isAvailable: true,
      matchType: 'early30',
      matchedStartTime: earlyTimeStr,
      matchedEndTime: minutesToTimeString(earlyStartMin + duration),
      label: `${earlyTimeStr}~ 空き`,
      availableCandidateTimes: [earlyTimeStr],
    };
  }

  if (lateAvailable) {
    return {
      isAvailable: true,
      matchType: 'late30',
      matchedStartTime: lateTimeStr,
      matchedEndTime: minutesToTimeString(lateStartMin + duration),
      label: `${lateTimeStr}~ 空き`,
      availableCandidateTimes: [lateTimeStr],
    };
  }

  return {
    isAvailable: false,
    matchType: 'none',
    label: '満室',
    availableCandidateTimes: [],
  };
}
