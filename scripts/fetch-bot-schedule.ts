import { chromium } from 'playwright';
import fs from 'fs';

async function fetchBotSchedule() {
  console.log('📡 ベースオントップ秋葉原昭和通り口店のスケジュール取得を開始...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  });

  await page.goto('https://studi-ol.com/shop/705', { waitUntil: 'networkidle', timeout: 30000 });

  // 取得対象の room_id 一覧
  const rooms = [
    { id: 3105, name: '1st', size: 17, startTiming: 0 },
    { id: 3106, name: '2st', size: 9, startTiming: 0 },
    { id: 3107, name: '3st', size: 9, startTiming: 0 },
    { id: 3108, name: '4st', size: 15, startTiming: 0 },
    { id: 3109, name: '5st', size: 15, startTiming: 30 },
    { id: 3110, name: '6st', size: 9, startTiming: 30 },
    { id: 3111, name: '7st', size: 7, startTiming: 30 },
    { id: 3112, name: 'Piano', size: 3, startTiming: 0 },
  ];

  const dateStart = '2026-09-05 00:00:00';
  const dateEnd   = '2026-09-12 23:59:59';

  const results: any[] = [];

  for (const r of rooms) {
    const data = await page.evaluate(async ({ roomId, start, end }) => {
      // @ts-ignore
      const token = $('input[name="_token"]').val() || $('meta[name="csrf-token"]').attr('content') || 'qvvJNU2M4rxyKWM3XfRfakudCDMPb5IhlOaAxNP3';
      // @ts-ignore
      return new Promise((resolve) => {
        // @ts-ignore
        $.post('https://studi-ol.com/get_schedule_room', {
          '_token': token,
          'room_id': roomId,
          'start': start,
          'end': end,
        }, (res: any) => {
          resolve(res);
        }).fail((err: any) => resolve({ error: err.statusText }));
      });
    }, { roomId: r.id, start: dateStart, end: dateEnd });

    console.log(`  Room ${r.name} (${r.size}帖, :${r.startTiming}) => ${Array.isArray(data) ? data.length + ' events' : 'error'}`);
    results.push({
      ...r,
      events: data,
    });
  }

  fs.writeFileSync('bot-akiba-schedules.json', JSON.stringify(results, null, 2));
  console.log('✅ bot-akiba-schedules.json に保存完了！');
  await browser.close();
}

fetchBotSchedule();
