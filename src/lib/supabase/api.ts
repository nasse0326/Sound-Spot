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
    // PostgRESTは1回のクエリで最大1000行までしか返さないため、1日分のスロットが
    // 1000件を超える場合（全店舗合計では容易に超える。実測で1日6,500件超）に備えて
    // rangeでページングする。
    // ⚠️ .order()を指定せずに.range()でページングすると、PostgreSQLはORDER BY無しの
    // 行順序を一切保証しないため、ページ間で同じ行が重複したり、逆に一部の行が
    // どのページにも現れず欠落したりする（実際にGOODMAN AKIBA等で特定の部屋だけ
    // 空き枠が「未取得」扱いになる形で発生した）。決定的な順序を強制するため
    // 主キーのidで安定ソートしてからページングする。
    const startRange = `${targetDate}T00:00:00+09:00`;
    const endRange = `${targetDate}T23:59:59+09:00`;

    let slotsData: any[] = [];
    let slotsError: any = null;
    const pageSize = 1000;
    for (let from = 0; ; from += pageSize) {
      const { data: page, error } = await supabase
        .from('availability_slots')
        .select('*')
        .gte('start_time', startRange)
        .lte('start_time', endRange)
        .order('id', { ascending: true })
        .range(from, from + pageSize - 1);
      if (error) {
        slotsError = error;
        break;
      }
      if (!page || page.length === 0) break;
      slotsData = slotsData.concat(page);
      if (page.length < pageSize) break;
    }

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
        // ゲートウェイ各店（渋谷・高田馬場3号店・池袋北口店）は公式サイト記載の営業時間が
        // いずれも10:00〜23:00前後で24h対応の記載が無いため、is24Hoursはノアのみとする。
        is24Hours: st.name.includes('ノア'),
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
        // GOODMAN AKIBAは実際の予約カレンダーが30分刻み（:00/:30どちらからでも開始でき、
        // 最低1時間から30分刻みで延長可能）なため、他店舗の「毎時1点のみ」とは区別する。
        // DBスキーマに列を追加するほどでもない例外なので、is24Hoursと同様に店舗名で判定する。
        bookingStartGranularityMinutes: st.name === 'STUDIO GOODMAN AKIBA' ? 30 : undefined,
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