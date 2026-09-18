import { NextRequest, NextResponse } from 'next/server';
import { getRoomsWithSlotsFromSupabase } from '@/lib/supabase/api';
import { getMockRoomsWithSlots } from '@/lib/mock-data';
import { format } from 'date-fns';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const area = searchParams.get('area') || 'all';

  const mockRooms = getMockRoomsWithSlots(dateStr);
  const filtered = area === 'all'
    ? mockRooms
    : mockRooms.filter((r) => r.studio.area === area);

  // 1. Supabaseからリアル空き枠データを取得
  try {
    const supabaseRooms = await getRoomsWithSlotsFromSupabase(dateStr, area);
    if (supabaseRooms && supabaseRooms.length > 0) {
      // rooms/studiosマスター（seed.sqlの固定UUID）とクローラーが書き込むroom_id
      // （src/config内の各部屋idから決定的生成したUUID）が一致しない部屋が多数あり、
      // 大半の部屋でスロット同期に失敗している状態がある。部屋自体は取得できても
      // スロットがほぼ空という不完全なデータをそのまま返すと「空き無し」に見えて
      // しまうため、十分な割合でスロットが揃っている場合のみSupabaseソースを信頼する。
      const roomsWithSlots = supabaseRooms.filter((r) => r.slots && r.slots.length > 0).length;

      // さらに、seed.sqlにまだ登録されていない新規スタジオ（studios/roomsテーブル自体に
      // 存在しない）はSupabaseクエリの結果に一切現れないため、上のスロット充足率チェックを
      // すり抜けて「全店舗網羅済み」と誤判定される（新規エリアがまるごと欠落したまま返って
      // しまう）。モック側が知っている全スタジオがSupabase側にも存在するか確認し、
      // 1件でも丸ごと欠けていればモックへフォールバックする。
      const expectedStudioIds = new Set(filtered.map((r) => r.studio.id));
      const supabaseStudioIds = new Set(supabaseRooms.map((r) => r.studio.id));
      const missingStudioCount = [...expectedStudioIds].filter((id) => !supabaseStudioIds.has(id)).length;

      if (missingStudioCount === 0 && roomsWithSlots >= supabaseRooms.length * 0.5) {
        return NextResponse.json({
          source: 'supabase',
          data: supabaseRooms,
        });
      }
      console.warn(`Supabase data incomplete (${roomsWithSlots}/${supabaseRooms.length} rooms have slots, ${missingStudioCount} studio(s) entirely missing), falling back to mock data.`);
    }
  } catch (e) {
    console.warn('Failed to query Supabase, falling back to mock data:', e);
  }

  // Supabase未設定またはフォールバック: ローカルモックデータ

  return NextResponse.json({
    source: 'mock',
    data: filtered,
  });
}
