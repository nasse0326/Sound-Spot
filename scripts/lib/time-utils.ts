/**
 * 24時以降（例: 25:00, 32:00）の深夜営業時刻を、翌日以降の正規のISO日時に変換する。
 * 未対応のままPostgresへ送るとtimestamptzとして不正な値になりinsertが失敗するため、
 * 深夜営業スタジオの時刻を扱う全フェッチャーはこの関数を経由すること。
 *
 * 【重要】実行環境のローカルタイムゾーンに一切依存しない実装にすること。
 * 以前は `new Date(`${dateStr}T00:00:00+09:00`)` で一度Dateオブジェクトを作り、
 * date-fnsのformat()やDate#getDate()等の「ローカルタイムゾーン基準」のAPIで
 * 年月日を読み戻していたため、実行環境のタイムゾーンがJST以外（GitHub Actionsの
 * Ubuntuランナーは既定でUTC）だと、日付が1日ズレて生成されるバグがあった
 * （手元のJST設定PCで動作確認しても再現せず、本番のGitHub Actions実行でのみ
 * 発生していたため長期間気づかれなかった）。
 * この実装はDate.UTC()での構築とgetUTC*()での読み出しのみを使い、実行環境の
 * ローカルタイムゾーン設定を一切参照しないため、どの環境で実行しても同じ結果になる。
 */
export function toIsoWithRollover(dateStr: string, hour: number, minute: number): string {
  const daysOffset = Math.floor(hour / 24);
  const normalizedHour = hour % 24;
  const [y, m, d] = dateStr.split('-').map(Number);
  const shifted = new Date(Date.UTC(y, m - 1, d + daysOffset));
  const yStr = shifted.getUTCFullYear();
  const mStr = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const dStr = String(shifted.getUTCDate()).padStart(2, '0');
  const hh = String(normalizedHour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return `${yStr}-${mStr}-${dStr}T${hh}:${mm}:00+09:00`;
}
