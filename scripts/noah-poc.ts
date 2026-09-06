import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// .env.local から環境変数を手動ロード
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const LOGIN_ID = process.env.NOAH_LOGIN_ID || '';
const PASSWORD = process.env.NOAH_PASSWORD || '';
const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

// 人間らしいランダム待機（2〜4秒）
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomWait = (min = 2000, max = 3500) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return sleep(ms);
};

async function run() {
  if (!LOGIN_ID || !PASSWORD) {
    console.error('❌ エラー: .env.local に NOAH_LOGIN_ID または NOAH_PASSWORD が設定されていません。');
    process.exit(1);
  }

  console.log('🚀 [NOAH PoC] ステルスモードでブラウザを起動します...');

  // セッションファイル（Cookie）が存在するか確認
  const hasStorageState = fs.existsSync(STORAGE_STATE_PATH);

  const browser = await chromium.launch({
    headless: true, // バックグラウンド実行
    args: [
      '--disable-blink-features=AutomationControlled', // 自動化検知回避
      '--no-sandbox',
    ],
  });

  const context = await browser.newContext({
    storageState: hasStorageState ? STORAGE_STATE_PATH : undefined,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
  });

  const page = await context.newPage();

  // navigator.webdriver を隠蔽するステルススクリプト
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  try {
    const targetUrl = 'https://www.studionoah.jp/noahweb/webs/chart/';
    console.log(`📡 カレンダーページへアクセス中: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await randomWait(2000, 3000);

    console.log('🔑 ログイン処理を実行中 (_postLogin を直接呼び出し)...');
    const loginResult = await page.evaluate(async ({ id, pass }) => {
      // @ts-ignore
      if (typeof window._openLoginForm === 'function') {
        // @ts-ignore
        window._openLoginForm();
      }
      // @ts-ignore
      const $id = window.$('#id_text');
      // @ts-ignore
      const $pass = window.$('#pass_text');

      if ($id.length && $pass.length) {
        $id.val(id).trigger('input').trigger('change');
        $pass.val(pass).trigger('input').trigger('change');

        // @ts-ignore
        if (typeof window._postLogin === 'function') {
          // @ts-ignore
          window._postLogin(null, document.getElementById('pass_text'));
          return { success: true, method: '_postLogin' };
        }
      }
      return { success: false, reason: 'Inputs or _postLogin not found' };
    }, { id: LOGIN_ID, pass: PASSWORD });

    console.log('📝 ログイン実行結果:', loginResult);
    await randomWait(3500, 5000);

    // ログイン後のセッション状態（Cookie等）を保存
    await context.storageState({ path: STORAGE_STATE_PATH });
    console.log(`💾 ログインセッションを保存しました: ${STORAGE_STATE_PATH}`);

    // ログイン後のスクリーンショット
    const afterLoginPath = path.resolve(process.cwd(), 'noah-after-login.png');
    await page.screenshot({ path: afterLoginPath, fullPage: true });
    console.log(`📸 ログイン後のスクリーンショットを保存しました: ${afterLoginPath}`);

    // 渋谷店舗のチェックボックスまたは選択要素を探す
    console.log('🔍 渋谷2号店の選択を試行中...');
    const shibuya2Option = page.locator('text="渋谷2号", label:has-text("渋谷2号"), [data-store="shibuya2"]').first();
    if (await shibuya2Option.count() > 0) {
      console.log('👆 渋谷2号店をクリック...');
      await shibuya2Option.click();
      await randomWait(2000, 3000);

      const chartPath = path.resolve(process.cwd(), 'noah-shibuya2-chart.png');
      await page.screenshot({ path: chartPath, fullPage: true });
      console.log(`📸 渋谷2号店選択後のスクリーンショット: ${chartPath}`);
    }

    // ログイン後のカレンダー画面の確認
    const currentUrl = page.url();
    console.log(`📍 現在のURL: ${currentUrl}`);

    await randomWait(2000, 3000);

    // カレンダー要素やスタジオ選択要素を探索
    const contentHtml = await page.content();
    console.log(`📊 取得ページサイズ: ${(contentHtml.length / 1024).toFixed(1)} KB`);

    // 画面キャプチャを保存（PoC結果確認用）
    const resultScreenshotPath = path.resolve(process.cwd(), 'noah-chart-result.png');
    await page.screenshot({ path: resultScreenshotPath, fullPage: false });
    console.log(`📸 スクリーンショットを保存しました: ${resultScreenshotPath}`);

    // カレンダーやテーブル要素の検出テスト
    const tableCount = await page.locator('table').count();
    const frameCount = await page.frames().length;
    console.log(`🔍 検出: テーブル数=${tableCount}, フレーム数=${frameCount}`);

    // 部屋名らしき要素のテキストを抽出
    const elements = await page.locator('.studio_name, .room_name, th, .tenpo').allInnerTexts();
    console.log('🏷️ 検出されたテキストサンプル:', elements.slice(0, 10));

    console.log('🎉 [NOAH PoC] 検証ステップが安全に完了しました。');
  } catch (error) {
    console.error('❌ 検証中にエラーが発生しました:', error);
  } finally {
    await browser.close();
    console.log('🔒 ブラウザを正常に終了しました。');
  }
}

run();
