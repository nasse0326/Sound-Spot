import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getMockRoomsWithSlots, MOCK_STUDIOS } from '@/lib/mock-data';
import { format } from 'date-fns';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const area = searchParams.get('area') || 'all';

  // Supabaseが設定されていればDBから取得
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('rooms')
        .select(`
          *,
          studio:studios(*),
          equipment:room_equipments(*),
          slots:availability_slots(*)
        `);

      if (area !== 'all') {
        // スタジオのエリアでフィルタリング
        const { data: studiosInArea } = await supabase
          .from('studios')
          .select('id')
          .eq('area', area);

        const studioIds = studiosInArea?.map((s) => s.id) || [];
        query = query.in('studio_id', studioIds);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json({
          source: 'supabase',
          data,
        });
      }
    } catch (e) {
      console.warn('Failed to query Supabase, falling back to mock data:', e);
    }
  }

  // Supabase未設定またはフォールバック: ローカルモックデータ
  const mockRooms = getMockRoomsWithSlots(dateStr);
  const filtered = area === 'all' 
    ? mockRooms 
    : mockRooms.filter((r) => r.studio.area === area);

  return NextResponse.json({
    source: 'mock',
    data: filtered,
  });
}
