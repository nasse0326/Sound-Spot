import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function parseGoodman() {
  const filePath = path.resolve(process.cwd(), 'goodman-akiba-raw.html');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`file://${filePath}`);

  const data = await page.evaluate(() => {
    // 時間ヘッダーの取得
    const timeHeaders: string[] = [];
    document.querySelectorAll('tr').forEach((tr) => {
      const txt = tr.textContent || '';
      if (txt.includes('10:00') && txt.includes('10:30') && timeHeaders.length === 0) {
        tr.querySelectorAll('td, th').forEach((cell) => {
          const t = cell.textContent?.trim() || '';
          if (t.includes(':')) {
            timeHeaders.push(t.replace(/\s+/g, ''));
          }
        });
      }
    });

    const rooms: any[] = [];
    document.querySelectorAll('tr').forEach((tr) => {
      const text = tr.textContent || '';
      if (text.includes('st') && text.includes('畳')) {
        const firstCell = tr.querySelector('td, th')?.textContent?.trim() || '';
        const match = firstCell.match(/(.*?st|.*?Booth.*?)\s*\((\d+)畳(.*?)\)/i);
        if (match) {
          const roomName = match[1].trim();
          const size = parseInt(match[2]);
          const note = match[3].trim();

          const cells = Array.from(tr.querySelectorAll('td')).slice(1);
          const slots: any[] = [];

          cells.forEach((td, idx) => {
            const hasCheckbox = td.querySelector('input[type="checkbox"]') !== null;
            const tdText = td.textContent?.trim() || '';
            const tdImg = td.querySelector('img')?.getAttribute('src') || '';
            const isClosed = tdText.includes('🚫') || tdImg.includes('ng');
            const isBooked = tdText.includes('×') || tdImg.includes('batsu');

            const timeLabel = timeHeaders[idx] || `Slot_${idx}`;

            slots.push({
              time: timeLabel,
              status: hasCheckbox ? 'AVAILABLE' : isBooked ? 'BOOKED' : isClosed ? 'CLOSED' : 'UNKNOWN',
            });
          });

          rooms.push({
            name: roomName,
            size,
            note,
            availableSlots: slots.filter(s => s.status === 'AVAILABLE').map(s => s.time),
            slots,
          });
        }
      }
    });

    return { timeHeaders, rooms };
  });

  console.log('Time Headers:', data.timeHeaders.slice(0, 5), '... total:', data.timeHeaders.length);
  console.log('Goodman Parsed Rooms:');
  for (const r of data.rooms) {
    console.log(`  ${r.name} (${r.size}畳): ${r.availableSlots.length} available slots`);
  }

  fs.writeFileSync('goodman-akiba-parsed.json', JSON.stringify(data, null, 2));
  console.log('✅ goodman-akiba-parsed.json 保存完了！');

  await browser.close();
}

parseGoodman();
