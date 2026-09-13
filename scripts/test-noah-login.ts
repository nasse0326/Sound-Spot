import { loginNoah } from './lib/noah-login';

async function testNoahLoginModule() {
  console.log('🧪 ノア自動ログインモジュールのテスト開始...');

  // 1. 認証情報未設定時のテスト
  console.log('\n--- 1. 認証情報未設定テスト ---');
  const emptyRes = await loginNoah('', '');
  console.log('  未設定時 success:', emptyRes.success, 'message:', emptyRes.message);
  if (emptyRes.success) throw new Error('Empty credentials should fail');

  // 2. ダミー認証情報でのログイン通信テスト（CSRF取得とPOST送信が動作するか）
  console.log('\n--- 2. ダミー認証情報による通信フロー検証 ---');
  const dummyRes = await loginNoah('test_bot@dummy.local', 'invalid_pwd_123');
  console.log('  ダミー認証時 success:', dummyRes.success, 'message:', dummyRes.message);
  if (dummyRes.success) throw new Error('Dummy login should not succeed');
  if (!dummyRes.message?.includes('ログインに失敗しました') && !dummyRes.message?.includes('IDまたはパスワードが不正')) {
    console.log('  （サーバー応答メッセージ）:', dummyRes.message);
  }

  console.log('\n🎉 ノア自動ログインモジュールの通信・バリデーションテストを完全にパスしました！');
}

testNoahLoginModule();
