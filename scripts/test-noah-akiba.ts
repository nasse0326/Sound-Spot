import { request } from 'playwright';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'storageState.json');

async function testNoahAkiba() {
  const apiContext = await request.newContext({
    storageState: STORAGE_STATE_PATH,
    baseURL: 'https://www.studionoah.jp',
    extraHTTPHeaders: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': 'https://www.studionoah.jp/noahweb/webs/chart/',
    },
  });

  // Try different slugs
  const candidates = ['akihabara', 'akiba', 'kanda'];
  for (const slug of candidates) {
    const renderRes = await apiContext.post(`/noahweb/webs/render_chart/${slug}`);
    console.log(`Slug: ${slug} => HTTP ${renderRes.status()}`);
    if (renderRes.status() === 200) {
      const dataRes = await apiContext.post('/noahweb/webs/get_chart_data');
      console.log(`  get_chart_data => HTTP ${dataRes.status()}`);
      if (dataRes.status() === 200) {
        const text = await dataRes.text();
        console.log('  Response text (500 chars):', text.slice(0, 500));
        if (text.startsWith('{')) {
          const json = JSON.parse(text);
          console.log('  Keys:', Object.keys(json));
          return json;
        }
      }
    }
  }
}

testNoahAkiba();
