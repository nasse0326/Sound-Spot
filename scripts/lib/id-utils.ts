import crypto from 'crypto';

/**
 * 各データソースの一意な部屋id文字列から、決定的なUUID形式の文字列を導出する。
 * Supabaseのrooms.id / availability_slots.room_idは、どちらもこの関数を通した
 * 同一の入力文字列から生成される前提で一致する（詳細: supabase/seed.sqlのコメント参照）。
 */
export function toUUID(str: string): string {
  const hash = crypto.createHash('md5').update(str).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '4' + hash.substring(13, 16),
    'a' + hash.substring(17, 20),
    hash.substring(20, 32)
  ].join('-');
}
