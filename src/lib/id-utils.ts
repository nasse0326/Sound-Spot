import crypto from 'crypto';

/**
 * 各データソースの一意なid文字列から、決定的なUUID形式の文字列を導出する。
 * supabase/seed.sql（scripts/generate-seed.ts）がstudios.id/rooms.idを生成する際と
 * 同一のアルゴリズム（scripts/lib/id-utils.tsの複製）。APIルート側でモックのslug id
 * とSupabase側のUUIDを突き合わせるために使う。
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
