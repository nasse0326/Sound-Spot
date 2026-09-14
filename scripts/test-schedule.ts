process.env.IS_TEST_RUN = 'true';
import { isScheduledCrawlTime } from './crawl-studios';
import { isWeekendOrHoliday } from './lib/penta-fetcher';

function testSchedules() {
  console.log('🧪 スケジュール判定ガードのテスト開始...');

  // 1. 毎日共通 4回判定テスト (平日・休日問わず定刻＆遅延の判定)
  console.log('\n--- 毎日固定4回テスト (06:33, 11:48, 17:18, 21:33) ---');
  const tests = [
    { time: '2026-09-14T06:33:00+09:00', expected: true, label: '朝枠 06:33 (定刻)' },
    { time: '2026-09-14T06:45:00+09:00', expected: true, label: '朝枠 06:45 (12分遅延)' },
    { time: '2026-09-14T08:33:00+09:00', expected: false, label: '08:33 (対象外時間スキップ)' },
    { time: '2026-09-14T11:48:00+09:00', expected: true, label: '昼枠 11:48 (定刻)' },
    { time: '2026-09-14T13:03:00+09:00', expected: false, label: '13:03 (対象外時間スキップ)' },
    { time: '2026-09-14T17:18:00+09:00', expected: true, label: '夕方枠 17:18 (定刻)' },
    { time: '2026-09-14T17:35:00+09:00', expected: true, label: '夕方枠 17:35 (17分遅延)' },
    { time: '2026-09-14T21:33:00+09:00', expected: true, label: '夜枠 21:33 (定刻)' },
    { time: '2026-09-14T03:00:00+09:00', expected: false, label: '03:00 (深夜外枠スキップ)' },
    // 休日でも同じ4枠で動作することを確認
    { time: '2026-09-20T06:33:00+09:00', expected: true, label: '休日 朝枠 06:33 (定刻)' },
    { time: '2026-09-20T11:48:00+09:00', expected: true, label: '休日 昼枠 11:48 (定刻)' },
    { time: '2026-09-20T17:18:00+09:00', expected: true, label: '休日 夕方枠 17:18 (定刻)' },
    { time: '2026-09-20T21:33:00+09:00', expected: true, label: '休日 夜枠 21:33 (定刻)' },
  ];

  for (const t of tests) {
    const d = new Date(t.time);
    const res = isScheduledCrawlTime(d);
    const ok = res.canProceed === t.expected;
    console.log(`  ${ok ? '✅' : '❌'} [${t.label}] canProceed: ${res.canProceed} (期待値: ${t.expected}) - ${res.reason}`);
    if (!ok) throw new Error(`Test failed for ${t.label}`);
  }

  console.log('\n🎉 毎日固定4回のスケジュール判定テストを完全にパスしました！');
}

testSchedules();
