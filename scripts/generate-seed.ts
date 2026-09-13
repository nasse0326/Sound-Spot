import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { MOCK_STUDIOS, getMockRoomsWithSlots } from '../src/lib/mock-data';
import { format } from 'date-fns';

function toUUID(str: string): string {
  const hash = crypto.createHash('md5').update(str).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '4' + hash.substring(13, 16),
    'a' + hash.substring(17, 20),
    hash.substring(20, 32)
  ].join('-');
}

function escapeSql(str: string | null | undefined): string {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function generateSeedSql() {
  const lines: string[] = [];

  lines.push('-- ==========================================');
  lines.push(`-- SoundSpot 本番シードデータ (実在${MOCK_STUDIOS.length}店舗・部屋マスター)`);
  lines.push('-- 都内3大エリア (渋谷・新宿・秋葉原) 公式マスター完全反映');
  lines.push(`-- Generated At: ${new Date().toISOString()}`);
  lines.push('-- ==========================================');
  lines.push('');
  lines.push('DO $$');
  lines.push('BEGIN');
  lines.push('  -- 既存データのクリーンアップ');
  lines.push('  DELETE FROM availability_slots;');
  lines.push('  DELETE FROM room_equipments;');
  lines.push('  DELETE FROM rooms;');
  lines.push('  DELETE FROM studios;');
  lines.push('');
  lines.push(`  -- 1. スタジオ店舗マスター (${MOCK_STUDIOS.length}店舗)`);

  for (const st of MOCK_STUDIOS) {
    const stId = toUUID(st.id);
    lines.push(`  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)`);
    lines.push(`  VALUES (`);
    lines.push(`    ${escapeSql(stId)},`);
    lines.push(`    ${escapeSql(st.name)},`);
    lines.push(`    ${escapeSql(st.chainName)},`);
    lines.push(`    ${escapeSql(st.area)},`);
    lines.push(`    ${escapeSql(st.prefecture)},`);
    lines.push(`    ${escapeSql(st.nearestStation)},`);
    lines.push(`    ${escapeSql(st.address)},`);
    lines.push(`    ${escapeSql(st.tel)},`);
    lines.push(`    ${escapeSql(st.bookingUrl)},`);
    lines.push(`    ${escapeSql(st.groupBookingRule)},`);
    lines.push(`    ${st.groupBookingLeadMonths || 3},`);
    lines.push(`    ${escapeSql(st.soloBookingRule)},`);
    lines.push(`    ${st.soloBookingLeadHours || 24},`);
    lines.push(`    ${escapeSql(st.websiteUrl)}`);
    lines.push(`  ) ON CONFLICT (id) DO NOTHING;`);
    lines.push('');
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const allRooms = getMockRoomsWithSlots(todayStr);

  lines.push(`  -- 2. 部屋マスター (${allRooms.length}部屋)`);
  for (const r of allRooms) {
    const rId = toUUID(r.id);
    const stId = toUUID(r.studioId);
    lines.push(`  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)`);
    lines.push(`  VALUES (`);
    lines.push(`    ${escapeSql(rId)},`);
    lines.push(`    ${escapeSql(stId)},`);
    lines.push(`    ${escapeSql(r.name)},`);
    lines.push(`    ${escapeSql(r.floor || '')},`);
    lines.push(`    ${r.sizeTatami},`);
    lines.push(`    ${r.capacity},`);
    lines.push(`    ${r.pricePerHourRegular},`);
    lines.push(`    ${r.pricePerHourDaytime},`);
    lines.push(`    ${r.pricePerHourSolo},`);
    lines.push(`    ${r.startTimeOffset || 0}`);
    lines.push(`  ) ON CONFLICT (id) DO NOTHING;`);
    lines.push('');
  }

  lines.push(`  -- 3. 常設機材マスター (${allRooms.length}件)`);
  for (const r of allRooms) {
    const rId = toUUID(r.id);
    const eq = r.equipment;
    const gAmps = (eq.guitarAmps || []).map(a => `"${a.replace(/"/g, '\\"')}"`).join(',');
    const gAmpsSql = `'{${gAmps}}'`;
    const keys = (eq.keyboards || []).map(k => `"${k.replace(/"/g, '\\"')}"`).join(',');
    const keysSql = `'{${keys}}'`;

    lines.push(`  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)`);
    lines.push(`  VALUES (`);
    lines.push(`    ${escapeSql(rId)},`);
    lines.push(`    ${gAmpsSql},`);
    lines.push(`    ${escapeSql(eq.bassAmp || '')},`);
    lines.push(`    ${escapeSql(eq.drumSet || '')},`);
    lines.push(`    ${eq.isTwinPedalAllowed ?? true},`);
    lines.push(`    ${keysSql},`);
    lines.push(`    ${escapeSql(eq.additionalNotes || '')}`);
    lines.push(`  ) ON CONFLICT (room_id) DO NOTHING;`);
    lines.push('');
  }

  lines.push('END $$;');
  lines.push('');

  const outPath = path.resolve(process.cwd(), 'supabase/seed.sql');
  fs.writeFileSync(outPath, lines.join('\n'), 'utf-8');
  console.log(`✅ supabase/seed.sql を最新の${MOCK_STUDIOS.length}店舗・${allRooms.length}部屋で生成しました。(${outPath})`);
}

generateSeedSql();
