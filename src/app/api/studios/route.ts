import { NextRequest, NextResponse } from 'next/server';
import { getRoomsWithSlotsFromSupabase } from '@/lib/supabase/api';
import { format } from 'date-fns';

// ローカルJSONモックフォールバック層は撤去済み（2026-09-21）。以前はSupabase側の
// データが不完全な場合にmock-data.ts（全店舗分のJSON、当時約43MB）へ静的importで
// フォールバックしていたが、この静的importが毎リクエストごとにCloudflare Workerの
// RAM上限（既定128MB）を超過させ、全エリアで500エラーになる障害を起こした
// （経緯は project_cloudflare_asset_size_limit メモリ参照）。現在はエリア追加のたびに
// 即座にSupabaseへ反映する運用（surgical insert）が定着しているため、Supabaseが
// 唯一のデータソースとなる。Supabase未設定・クエリ失敗時は空配列を返す。
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const area = searchParams.get('area') || 'all';

  const supabaseRooms = await getRoomsWithSlotsFromSupabase(dateStr, area);

  return NextResponse.json({
    source: 'supabase',
    data: supabaseRooms || [],
  });
}
