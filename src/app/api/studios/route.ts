import { NextRequest, NextResponse } from 'next/server';
import { getRoomsWithSlotsFromSupabase } from '@/lib/supabase/api';
import { getMockRoomsWithSlots } from '@/lib/mock-data';
import { format } from 'date-fns';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const area = searchParams.get('area') || 'all';

  // 1. Supabaseからリアル空き枠データを取得
  try {
    const supabaseRooms = await getRoomsWithSlotsFromSupabase(dateStr, area);
    if (supabaseRooms && supabaseRooms.length > 0) {
      return NextResponse.json({
        source: 'supabase',
        data: supabaseRooms,
      });
    }
  } catch (e) {
    console.warn('Failed to query Supabase, falling back to mock data:', e);
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
