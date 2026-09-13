process.env.IS_TEST_RUN = 'true';
import { isScheduledCrawlTime } from './crawl-studios';
import { isWeekendOrHoliday } from './lib/penta-fetcher';

function testSchedules() {
  console.log('🧪 スケジュール判定ガードのテスト開始...');

  // 1. 平日テスト (2026-09-14 月曜日 / 平日)
  console.log('\n--- 1. 平日テスト (2026-09-14 月曜日) ---');
  const weekdayTests = [
    { time: '2026-09-14T06:30:00+09:00', expected: true, label: '平日 06:30 (定刻)' },
    { time: '2026-09-14T06:40:00+09:00', expected: true, label: '平日 06:40 (10分遅延)' },
    { time: '2026-09-14T08:30:00+09:00', expected: false, label: '平日 08:30 (休日専用枠のためスキップ対象)' },
    { time: '2026-09-14T11:45:00+09:00', expected: true, label: '平日 11:45 (定刻)' },
    { time: '2026-09-14T13:00:00+09:00', expected: false, label: '平日 13:00 (休日専用枠のためスキップ対象)' },
    { time: '2026-09-14T17:15:00+09:00', expected: true, label: '平日 17:15 (定刻)' },
    { time: '2026-09-14T21:30:00+09:00', expected: true, label: '平日 21:30 (定刻)' },
    { time: '2026-09-14T03:00:00+09:00', expected: false, label: '平日 03:00 (深夜外枠スキップ)' },
  ];

  for (const t of weekdayTests) {
    const d = new Date(t.time);
    const res = isScheduledCrawlTime(d);
    const ok = res.canProceed === t.expected;
    console.log(`  ${ok ? '✅' : '❌'} [${t.label}] canProceed: ${res.canProceed} (期待値: ${t.expected}) - ${res.reason}`);
    if (!ok) throw new Error(`Test failed for ${t.label}`);
  }

  // 2. 休日・祝日テスト (2026-09-20 日曜日 / 休日)
  console.log('\n--- 2. 休日テスト (2026-09-20 日曜日) ---');
  const holidayTests = [
    { time: '2026-09-20T06:30:00+09:00', expected: false, label: '休日 06:30 (平日専用枠のためスキップ対象)' },
    { time: '2026-09-20T08:30:00+09:00', expected: true, label: '休日 08:30 (定刻)' },
    { time: '2026-09-20T08:45:00+09:00', expected: true, label: '休日 08:45 (15分遅延)' },
    { time: '2026-09-20T11:45:00+09:00', expected: false, label: '休日 11:45 (平日専用枠のためスキップ対象)' },
    { time: '2026-09-20T13:00:00+09:00', expected: true, label: '休日 13:00 (定刻)' },
    { time: '2026-09-20T17:15:00+09:00', expected: true, label: '休日 17:15 (定刻)' },
    { time: '2026-09-20T21:30:00+09:00', expected: true, label: '休日 21:30 (定刻)' },
  ];

  for (const t of holidayTests) {
    const d = new Date(t.time);
    const res = isScheduledCrawlTime(d);
    const ok = res.canProceed === t.expected;
    console.log(`  ${ok ? '✅' : '❌'} [${t.label}] canProceed: ${res.canProceed} (期待値: ${t.expected}) - ${res.reason}`);
    if (!ok) throw new Error(`Test failed for ${t.label}`);
  }

  // 3. 祝日判定テスト (2026-09-21 敬老の日 / 祝日)
  console.log('\n--- 3. 祝日テスト (2026-09-21 月曜祝日・敬老の日) ---');
  const isKeiroHoliday = isWeekendOrHoliday('2026-09-21');
  console.log(`  敬老の日 (2026-09-21) 祝日判定: ${isKeiroHoliday ? '✅ 祝日判定OK' : '❌ 祝日判定NG'}`);
  if (!isKeiroHoliday) throw new Error('2026-09-21 should be holiday');

  const keiroRes0830 = isScheduledCrawlTime(new Date('2026-09-21T08:30:00+09:00'));
  console.log(`  敬老の日 08:30 (休日スケジュール適用): canProceed = ${keiroRes0830.canProceed} (期待値: true)`);
  if (!keiroRes0830.canProceed) throw new Error('Holiday 08:30 should proceed');

  const keiroRes0630 = isScheduledCrawlTime(new Date('2026-09-21T06:30:00+09:00'));
  console.log(`  敬老の日 06:30 (平日スケジュール除外): canProceed = ${keiroRes0630.canProceed} (期待値: false)`);
  if (keiroRes0630.canProceed) throw new Error('Holiday 06:30 should NOT proceed');

  console.log('\n🎉 全てのスケジュール判定・祝日判定テストを完全にパスしました！');
}

testSchedules();
