import { RoomWithSlots, AvailabilitySlot, Studio } from '@/types/studio';

/**
 * 電話予約のみでリアルタイム空き状況を取得できない店舗かどうかを判定する
 * （ペンタ系チェーン、またはWEB予約URLが無く電話番号のみ登録されている店舗）。
 * カード表示・タイムライン表示・空き状況判定の3箇所で同じ条件を使うため、
 * 個別に重複させず必ずここを参照する。
 * Vivo Sound Studioはbookingurlに公式サイトURLを設定しているため上記の
 * 「bookingUrlが無い」判定には引っかからないが、実際はゲスト閲覧不可・
 * 会員登録必須のオンライン予約のため自動巡回非対応＝電話/LINE予約のみの
 * 店舗と同じ扱いにする必要があり、chainName名で個別に例外指定する。
 */
export function isPhoneOnlyStudio(studio: Pick<Studio, 'chainName' | 'bookingUrl' | 'tel'> | null | undefined): boolean {
  if (!studio) return false;
  return (
    Boolean(studio.chainName?.includes('PENTA')) ||
    studio.chainName === 'Vivo Sound Studio' ||
    (!studio.bookingUrl && !!studio.tel)
  );
}

/**
 * ペンタ系チェーンの中で唯一、スタジオペンタ新宿店だけは土日祝限定でリアルタイム
 * 空き状況を取得できている（他のペンタ店舗は完全に電話予約のみ）。isPhoneOnlyStudio
 * の判定上は他のペンタ店舗と同じく「電話予約のみ」扱いで部屋一覧を折りたたむが、
 * この店舗だけは実際に見る価値のあるデータがあるため、折りたたみのデフォルトを
 * 開いた状態にする。
 * studio.idで判定しないのは、Supabase経由（source: 'supabase'）ではidがtoUUID済みの
 * ランダムなUUID（例: a9336dba-...）に置き換わり、mock側のスラグid
 * （'shinjuku-penta-main'）と一致しなくなるため。店舗名はどちらの経路でも
 * 同じ文字列で保たれるので、名前で判定する。
 */
export function shouldDefaultExpandRoomList(studio: Pick<Studio, 'name'> | null | undefined): boolean {
  return studio?.name === 'スタジオペンタ 新宿店';
}

/**
 * エリアの標準表示順（対応エリア一覧・supported-studios.tsのセクション順に合わせる）。
 * カード一覧・タイムラインビュー双方のスタジオ並び順で共通して使う。
 */
export const AREA_DISPLAY_ORDER = ['秋葉原', '渋谷', '新宿', '高田馬場', '池袋', '下北沢', '吉祥寺', '高円寺', '船橋', '横浜'];

export interface RoomAvailabilityMatch {
  isAvailable: boolean;
  matchType: 'exact' | 'early30' | 'late30' | 'none' | 'phone_only' | 'unfetched';
  matchedStartTime?: string; // e.g. 11:00, 10:30, 11:30
  matchedEndTime?: string;   // e.g. 12:00, 11:30, 12:30
  label: string;             // e.g. 空き, 10:30~ 空き, 11:30~ 空き, 満室, 要TEL, 未取得
  availableCandidateTimes: string[]; // e.g. [10:30, 11:30]
}

/**
 * 部屋名の自然順ソート比較関数（"A1st", "A2st", "B1st", "Cst", "REC.STUDIO",
 * "1st", "202st" のように、店舗ごとに命名規則は違ってもアルファベット+数字の
 * 組み合わせで意味のある順番になっていることが多いため、数字部分を桁数無視で
 * 数値比較する（"A2st"は"A10st"より前）。畳数表記の"(6帖)"部分も含めて比較する
 * が、部屋名本体が先に差分を生むため実用上は無視して問題ない。
 */
export function naturalCompareRoomNames(a: string, b: string): number {
  const tokenize = (s: string) => s.match(/\d+|\D+/g) || [];
  const aTokens = tokenize(a);
  const bTokens = tokenize(b);
  const len = Math.max(aTokens.length, bTokens.length);

  for (let i = 0; i < len; i++) {
    const aTok = aTokens[i];
    const bTok = bTokens[i];
    if (aTok === undefined) return -1;
    if (bTok === undefined) return 1;

    const aNum = /^\d+$/.test(aTok) ? Number(aTok) : null;
    const bNum = /^\d+$/.test(bTok) ? Number(bTok) : null;

    if (aNum !== null && bNum !== null) {
      if (aNum !== bNum) return aNum - bNum;
    } else {
      const cmp = aTok.localeCompare(bTok);
      if (cmp !== 0) return cmp;
    }
  }
  return 0;
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
  const isPhoneOnly = isPhoneOnlyStudio(room.studio);

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
