import { supabase, isSupabaseConfigured } from './client';
import { RoomWithSlots, Studio, RoomEquipment, AvailabilitySlot } from '@/types/studio';

export async function getRoomsWithSlotsFromSupabase(targetDate: string, area: string = 'all'): Promise<RoomWithSlots[] | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    // 1. スタジオと部屋、機材を取得
    let roomsQuery = supabase
      .from('rooms')
      .select(`
        *,
        studio:studios(*),
        equipment:room_equipments(*)
      `);

    if (area !== 'all') {
      const { data: areaStudios } = await supabase
        .from('studios')
        .select('id')
        .eq('area', area);
      const studioIds = (areaStudios || []).map((s: any) => s.id);
      roomsQuery = roomsQuery.in('studio_id', studioIds);
    }

    const { data: roomsData, error: roomsError } = await roomsQuery;
    if (roomsError || !roomsData || roomsData.length === 0) {
      return null;
    }

    // 2. 指定日のスロットを取得 (JST 00:00〜23:59:59 に相当する範囲)
    const startRange = `${targetDate}T00:00:00+09:00`;
    const endRange = `${targetDate}T23:59:59+09:00`;

    const { data: slotsData, error: slotsError } = await supabase
      .from('availability_slots')
      .select('*')
      .gte('start_time', startRange)
      .lte('start_time', endRange);

    const slotsByRoomId: Record<string, AvailabilitySlot[]> = {};
    if (!slotsError && slotsData) {
      slotsData.forEach((s: any) => {
        if (!slotsByRoomId[s.room_id]) {
          slotsByRoomId[s.room_id] = [];
        }
        slotsByRoomId[s.room_id].push({
          id: s.id,
          roomId: s.room_id,
          startTime: s.start_time,
          endTime: s.end_time,
          status: s.status,
        });
      });
    }

    // 3. RoomWithSlots 構造にマッピング
    const result: RoomWithSlots[] = roomsData.map((r: any) => {
      const st = r.studio;
      const studio: Studio = {
        id: st.id,
        name: st.name,
        chainName: st.chain_name,
        area: st.area,
        prefecture: st.prefecture,
        nearestStation: st.nearest_station,
        address: st.address,
        tel: st.tel,
        bookingUrl: st.booking_url,
        websiteUrl: st.website_url,
        groupBookingRule: st.group_booking_rule,
        groupBookingLeadMonths: st.group_booking_lead_months || 3,
        soloBookingRule: st.solo_booking_rule,
        soloBookingLeadHours: st.solo_booking_lead_hours || 24,
        is24Hours: st.name.includes('ノア') || st.name.includes('ゲートウェイ'),
      };

      const eq = r.equipment;
      const equipment: RoomEquipment = {
        id: eq?.id || `eq-${r.id}`,
        roomId: r.id,
        guitarAmps: eq?.guitar_amps || [],
        bassAmp: eq?.bass_amp || '',
        drumSet: eq?.drum_set || '',
        isTwinPedalAllowed: eq?.is_twin_pedal_allowed ?? true,
        keyboards: eq?.keyboards || [],
        additionalNotes: eq?.additional_notes || '',
      };

      return {
        id: r.id,
        studioId: r.studio_id,
        name: r.name,
        floor: r.floor,
        sizeTatami: Number(r.size_tatami),
        capacity: r.capacity,
        pricePerHourRegular: r.price_per_hour_regular,
        pricePerHourDaytime: r.price_per_hour_daytime,
        pricePerHourSolo: r.price_per_hour_solo,
        hasMirror: r.has_mirror,
        hasRecording: r.has_recording,
        startTimeOffset: r.start_time_offset,
        studio,
        equipment,
        slots: slotsByRoomId[r.id] || [],
      };
    });

    return result;
  } catch (err) {
    console.error('Error fetching rooms with slots from Supabase:', err);
    return null;
  }
}