import { request } from 'playwright';
import fs from 'fs';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

async function directApiTest() {
  console.log('⚡ [Step 2] 保存済みCookieを使って直接 get_chart_data API を叩いてみます...');

  if (!fs.existsSync(STORAGE_STATE_PATH)) {
    console.error('❌ storageState.json が見つかりません。');
    process.exit(1);
  }

  // 保存済みのCookieを取り出す
  const storageState = JSON.parse(fs.readFileSync(STORAGE_STATE_PATH, 'utf-8'));

  const apiContext = await request.newContext({
    storageState: STORAGE_STATE_PATH,
    baseURL: 'https://www.studionoah.jp',
    extraHTTPHeaders: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': 'https://www.studionoah.jp/noahweb/webs/chart/',
    },
  });

  try {
    // 渋谷2号店のチャートデータ取得を試行
    console.log('📡 POST https://www.studionoah.jp/noahweb/webs/get_chart_data を実行中...');
    
    // まずrender_chartを叩いてセッションを該当店舗に合わせる
    const renderRes = await apiContext.post('/noahweb/webs/render_chart/shibuya2');
    console.log(`📥 render_chart レスポンス: HTTP ${renderRes.status()}`);

    // 次にget_chart_dataを取得
    const res = await apiContext.post('/noahweb/webs/get_chart_data');
    console.log(`📥 get_chart_data レスポンス: HTTP ${res.status()}`);

    if (res.status() === 200) {
      const text = await res.text();
      console.log('📄 レスポンス冒頭 (200文字):', text.slice(0, 200));
      if (text.startsWith('{') || text.startsWith('[')) {
        const data = JSON.parse(text);
        fs.writeFileSync('noah-shibuya2-2weeks.json', JSON.stringify(data, null, 2));
        console.log('🎉 2週間分の生JSONデータの保存に成功しました！ => noah-shibuya2-2weeks.json');
      } else {
        console.log('ℹ️ HTMLが返却されました。タイトル:', text.match(/<title>(.*?)<\/title>/i)?.[1]);
      }

      // データ構造の要約を出力
      console.log('\n📊 === データ構造の要約 ===');
      console.log('トップレベルのキー:', Object.keys(data));
      if (data.header) {
        console.log(`対象日数: ${data.header.length} 日間 (${data.header[0]?.date} 〜 ${data.header[data.header.length - 1]?.date})`);
      }
      if (data.studios || data.rooms || data.body || data.data) {
        const roomsKey = data.studios ? 'studios' : data.rooms ? 'rooms' : data.body ? 'body' : 'data';
        console.log(`部屋情報キー [${roomsKey}]:`, Array.isArray(data[roomsKey]) ? `${data[roomsKey].length} 部屋` : typeof data[roomsKey]);
      }
    } else {
      console.warn('⚠️ 200以外のステータス:', await res.text());
    }
  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await apiContext.dispose();
  }
}

directApiTest();
