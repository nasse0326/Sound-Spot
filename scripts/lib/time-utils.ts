import { addDays, format } from 'date-fns';

/**
 * 24時以降（例: 25:00, 32:00）の深夜営業時刻を、翌日以降の正規のISO日時に変換する。
 * 未対応のままPostgresへ送るとtimestamptzとして不正な値になりinsertが失敗するため、
 * 深夜営業スタジオの時刻を扱う全フェッチャーはこの関数を経由すること。
 */
export function toIsoWithRollover(dateStr: string, hour: number, minute: number): string {
  const daysOffset = Math.floor(hour / 24);
  const normalizedHour = hour % 24;
  const baseDateObj = new Date(`${dateStr}T00:00:00+09:00`);
  const actualDateObj = daysOffset > 0 ? addDays(baseDateObj, daysOffset) : baseDateObj;
  const actualDateStr = format(actualDateObj, 'yyyy-MM-dd');
  const hh = String(normalizedHour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return `${actualDateStr}T${hh}:${mm}:00+09:00`;
}
