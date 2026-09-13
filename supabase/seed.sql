-- ==========================================
-- SoundSpot 本番シードデータ (実在17店舗・部屋マスター)
-- 都内3大エリア (渋谷・新宿・秋葉原) 公式マスター完全反映
-- Generated At: 2026-09-13T11:32:54.765Z
-- ==========================================

DO $$
BEGIN
  -- 既存データのクリーンアップ
  DELETE FROM availability_slots;
  DELETE FROM room_equipments;
  DELETE FROM rooms;
  DELETE FROM studios;

  -- 1. スタジオ店舗マスター (17店舗)
  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    'd5bbbdd3-34f8-4496-a964-4ae6df2de8f4',
    'ベースオントップ 秋葉原昭和通り口店',
    'BASS ON TOP',
    '秋葉原',
    '東京都',
    '秋葉原駅 昭和通り口 徒歩2分',
    '東京都千代田区神田佐久間町3丁目37-1 文唱堂ビル B1F',
    '03-5825-4544',
    'https://studi-ol.com/shop/705',
    'WEBにて予約受付可能',
    3,
    '前日12:00よりWEBにて受付開始',
    24,
    'https://bassontop.tokyo.jp/band/akihabara/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    'fbea3867-f708-406e-a267-f0f5e3a5eca1',
    'STUDIO GOODMAN AKIBA',
    'STUDIO GOODMAN',
    '秋葉原',
    '東京都',
    '秋葉原駅 昭和通り口 徒歩5分',
    '東京都千代田区神田佐久間町1-16 クレジデンス神田佐久間町 B1F',
    '03-5846-9454',
    'https://studio.goodman2020.com/',
    'WEBにて予約受付可能',
    3,
    '当日10:00（平日3日前）よりWEB受付開始',
    24,
    'https://studio.goodman2020.com/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    'aa891b1f-d51f-4800-a73c-a4082becad19',
    'スタジオ音楽館 アキバ店',
    'スタジオ音楽館',
    '秋葉原',
    '東京都',
    '秋葉原駅 電気街口 徒歩2分',
    '東京都千代田区外神田1-3-13 大森ビル 6F',
    '03-3256-6955',
    'https://www.ajg.jp/shop/ReservationTop.php?id=Twb03vvjqn2fba1',
    'WEBにて予約受付可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    24,
    'http://www.st-ongakukan.com/akihabara/akihabara.html'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '87d744c8-ff3f-42f8-a830-e232ecf402df',
    'サウンドスタジオノア 秋葉原店',
    'SOUND STUDIO NOAH',
    '秋葉原',
    '東京都',
    '末広町駅 徒歩1分 / 秋葉原駅 徒歩6分',
    '東京都千代田区外神田6-14-8',
    '03-5816-8383',
    'https://www.studionoah.jp/akihabara/',
    'WEBにて予約受付可能',
    3,
    '前日21:00よりWEB受付開始',
    24,
    'https://www.studionoah.jp/akihabara/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'サウンドスタジオノア 御茶ノ水店',
    'SOUND STUDIO NOAH',
    '秋葉原',
    '東京都',
    '御茶ノ水駅 御茶ノ水橋口 徒歩3分 / 神保町駅 A5出口 徒歩5分',
    '東京都千代田区神田駿河台2丁目1-17',
    '03-6427-3361',
    'https://www.studionoah.jp/ochanomizu/',
    '3ヶ月前の1日よりWEB予約可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
    'https://www.studionoah.jp/ochanomizu/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    'ゲートウェイスタジオ 渋谷道玄坂店',
    'GATEWAY STUDIO',
    '渋谷',
    '東京都',
    '渋谷駅 道玄坂口 徒歩4分 / 神泉駅 徒歩3分',
    '東京都渋谷区道玄坂2-13-5 ハーベストビルディング 3F・4F・5F',
    '03-3462-5552',
    'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=tlsccmeco&mn=8',
    '3ヶ月前の同日よりWEB/電話にて予約可能',
    3,
    '前日のオープン（09:00）よりWEB/電話受付開始 (1名770円/h、2名1,210円/h)',
    24,
    'http://www.gw-studio.com/studios/studio_shibu2/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'サウンドスタジオノア 渋谷本店',
    'SOUND STUDIO NOAH',
    '渋谷',
    '東京都',
    '渋谷駅 ハチ公口 徒歩6分 / 神泉駅 徒歩8分',
    '東京都渋谷区宇田川町36-0 ビルディングB1F-4F',
    '03-5485-1441',
    'https://www.studionoah.jp/shibuya_honten/',
    '3ヶ月前の1日よりWEB予約可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
    'https://www.studionoah.jp/shibuya_honten/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'サウンドスタジオノア 渋谷1号店',
    'SOUND STUDIO NOAH',
    '渋谷',
    '東京都',
    '渋谷駅 東口・宮益坂 徒歩3分',
    '東京都渋谷区渋谷2-19-15 宮益坂ビルディングB1F',
    '03-5485-1441',
    'https://www.studionoah.jp/shibuya1/',
    '3ヶ月前の1日よりWEB予約可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
    'https://www.studionoah.jp/shibuya1/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'サウンドスタジオノア 渋谷2号店',
    'SOUND STUDIO NOAH',
    '渋谷',
    '東京都',
    '渋谷駅 ハチ公口 徒歩5分',
    '東京都渋谷区宇田川町39-2 B1F',
    '03-3780-5766',
    'https://www.studionoah.jp/shibuya2/',
    '3ヶ月前の1日よりWEB予約可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
    'https://www.studionoah.jp/shibuya2/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'サウンドスタジオノア 渋谷3号店',
    'SOUND STUDIO NOAH',
    '渋谷',
    '東京都',
    '渋谷駅 西口・マークシティ口 徒歩5分',
    '東京都渋谷区道玄坂1-15-3 プリメーラ道玄坂B1F',
    '03-6416-3663',
    'https://www.studionoah.jp/shibuya3/',
    '3ヶ月前の1日よりWEB予約可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
    'https://www.studionoah.jp/shibuya3/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '230f823c-11fc-4770-a3f9-3bb769a0bcfc',
    'スタジオペンタ 渋谷シティサイド店',
    'STUDIO PENTA',
    '渋谷',
    '東京都',
    '渋谷駅 西口 徒歩3分',
    '東京都渋谷区桜丘町24-2 第3富士商事ビルB1F',
    '03-3462-2811',
    'https://studiopenta.jp/rehearsal/shibuyacityside/',
    '2ヶ月前より電話にて受付（オンライン予約非対応）',
    2,
    '前日営業開始（10:00）より電話にて受付開始',
    38,
    'https://studiopenta.jp/rehearsal/shibuyacityside/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    'feac07ff-504a-47a8-a504-390b3fa58406',
    'スタジオペンタ 渋谷ジュークハウス店',
    'STUDIO PENTA',
    '渋谷',
    '東京都',
    '渋谷駅 西口 徒歩4分',
    '東京都渋谷区桜丘町15-17 登栄桜丘ビルB1F',
    '03-3462-2815',
    'https://studiopenta.jp/rehearsal/shibuyajukehouse/',
    '2ヶ月前より電話にて受付（オンライン予約非対応）',
    2,
    '前日営業開始（10:00）より電話にて受付開始',
    38,
    'https://studiopenta.jp/rehearsal/shibuyajukehouse/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '4d810a77-a37e-49e7-a279-1e4fbd51f543',
    'スタジオペンタ 渋谷ムーンサイド店',
    'STUDIO PENTA',
    '渋谷',
    '東京都',
    '渋谷駅 西口 徒歩5分',
    '東京都渋谷区桜丘町14-10 渋谷コープB1F',
    '03-3462-2818',
    'https://studiopenta.jp/rehearsal/shibuyamoonside/',
    '2ヶ月前より電話にて受付（オンライン予約非対応）',
    2,
    '前日営業開始（10:00）より電話にて受付開始',
    38,
    'https://studiopenta.jp/rehearsal/shibuyamoonside/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'サウンドスタジオノア 新宿店',
    'SOUND STUDIO NOAH',
    '新宿',
    '東京都',
    '新宿駅 西口 徒歩4分 / 西新宿駅 徒歩2分',
    '東京都新宿区西新宿1-3-14 新宿サンゲンビルB1F-7F',
    '03-5332-8366',
    'https://www.studionoah.jp/shinjuku/',
    '3ヶ月前の1日よりWEB予約可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
    'https://www.studionoah.jp/shinjuku/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '74b1b450-9ddd-4a1a-ac1f-83b62680d802',
    'STUDIO NODE 新宿店',
    'STUDIO NODE',
    '新宿',
    '東京都',
    '新宿駅 西口 徒歩6分 / 西武新宿駅 徒歩3分',
    '東京都新宿区西新宿7-16-12 YSビルB1F',
    '03-5386-3371',
    'https://www.studio-node.jp/studio/member/VisitorLogin.php?lc=llcvcamtc&mn=1&gr=3',
    'WEBにて予約受付可能',
    2,
    '前日よりWEB/電話にて受付開始',
    24,
    'https://www.studio-node.com/HomeSH.html'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    'スタジオペンタ 新宿店',
    'STUDIO PENTA',
    '新宿',
    '東京都',
    '新宿駅 東口 徒歩3分 / 新宿三丁目駅 徒歩2分',
    '東京都新宿区新宿3-11-6 エビスビルB1F',
    '03-3351-3140',
    'https://studiopenta.jp/rehearsal/shinjuku/',
    '土日祝リアルタイム空き状況公開中 / 予約は電話にて受付',
    2,
    '前日営業開始（10:00）より電話にて受付開始',
    38,
    'https://studiopenta.jp/rehearsal/shinjuku/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    'caa366f1-ea3c-4014-ad69-330b3b359a7c',
    'スタジオ音楽館 新宿西口店',
    'スタジオ音楽館',
    '新宿',
    '東京都',
    '新宿駅 西口 徒歩2分 / 新宿西口駅 徒歩3分',
    '東京都新宿区西新宿7-15-4 YSビルB2F',
    '03-3368-0131',
    'https://www.ajg.jp/shop/ReservationTop.php?id=Fuoxajj8krt105m',
    'WEBにて予約受付可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
    'http://www.st-ongakukan.com/sinjukunishi/sinjukunishi.html'
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. 部屋マスター (188部屋)
  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '712a2eb2-2c0e-4a6c-ac92-7be381e080c2',
    'd5bbbdd3-34f8-4496-a964-4ae6df2de8f4',
    '1st (17帖)',
    NULL,
    17,
    7,
    3600,
    3600,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f72196a8-188c-4638-ab1d-50bb777ed277',
    'd5bbbdd3-34f8-4496-a964-4ae6df2de8f4',
    '2st (9帖)',
    NULL,
    9,
    5,
    2800,
    2800,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'bc2ba5bf-d1a2-4a13-ae4d-2f400309cf59',
    'd5bbbdd3-34f8-4496-a964-4ae6df2de8f4',
    '3st (9帖)',
    NULL,
    9,
    5,
    2800,
    2800,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '15cdf5ea-410c-410e-a09b-0d66a782224d',
    'd5bbbdd3-34f8-4496-a964-4ae6df2de8f4',
    '4st (15帖)',
    NULL,
    15,
    7,
    3600,
    3600,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '114425a9-be9d-434f-a34e-9cd675dd62af',
    'd5bbbdd3-34f8-4496-a964-4ae6df2de8f4',
    '5st (15帖)',
    NULL,
    15,
    7,
    3600,
    3600,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '587a80c4-6e96-4089-aaf0-9576dba22188',
    'd5bbbdd3-34f8-4496-a964-4ae6df2de8f4',
    '6st (9帖)',
    NULL,
    9,
    5,
    2800,
    2800,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '78b1c338-153f-4e5e-ad08-2ddff43d6657',
    'd5bbbdd3-34f8-4496-a964-4ae6df2de8f4',
    '7st (7帖)',
    NULL,
    7,
    2,
    2200,
    2200,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd6036857-29cd-4669-a628-289a7bc80a71',
    'd5bbbdd3-34f8-4496-a964-4ae6df2de8f4',
    'Piano (3帖)',
    NULL,
    3,
    2,
    2200,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a54af9b9-5947-4dfe-a79f-f5b550d690eb',
    'fbea3867-f708-406e-a267-f0f5e3a5eca1',
    '201st (8帖)',
    NULL,
    8,
    5,
    2420,
    1980,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '5ffe9795-da83-4673-a77b-d953bc2237ab',
    'fbea3867-f708-406e-a267-f0f5e3a5eca1',
    '202st (8帖)',
    NULL,
    8,
    5,
    2420,
    1980,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '3fd0901e-80e1-4b85-aedf-5e3d146cd13b',
    'fbea3867-f708-406e-a267-f0f5e3a5eca1',
    '203st (5帖・ドラム無し)',
    NULL,
    5,
    2,
    1540,
    1320,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '4b69db35-529d-4ea8-a9a7-9af6febc6c8c',
    'fbea3867-f708-406e-a267-f0f5e3a5eca1',
    '204st (10帖)',
    NULL,
    10,
    5,
    2640,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '40575c9a-5c17-4fd7-a265-3fe5e53903b3',
    'fbea3867-f708-406e-a267-f0f5e3a5eca1',
    '205st (10帖)',
    NULL,
    10,
    5,
    2640,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '49ac09db-a80a-40cb-aa3f-5ef828fe39df',
    'fbea3867-f708-406e-a267-f0f5e3a5eca1',
    '301st (8帖)',
    NULL,
    8,
    5,
    2420,
    1980,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '63dbcec7-f888-42ca-a1d0-ed6389800657',
    'fbea3867-f708-406e-a267-f0f5e3a5eca1',
    '302st (14帖)',
    NULL,
    14,
    6,
    3080,
    2530,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '34de4681-993b-48d8-af29-5de7a03183a6',
    'fbea3867-f708-406e-a267-f0f5e3a5eca1',
    '303st (16帖)',
    NULL,
    16,
    6,
    3410,
    2860,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a9899e98-ccf5-4939-a735-38a3dc52bae3',
    'fbea3867-f708-406e-a267-f0f5e3a5eca1',
    '304st (16帖)',
    NULL,
    16,
    6,
    3410,
    2860,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f83035d0-e272-46e3-a7f1-d6ef24a53846',
    'fbea3867-f708-406e-a267-f0f5e3a5eca1',
    '305st (14帖)',
    NULL,
    14,
    6,
    3080,
    2530,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '61a61365-429d-41c5-aa89-02e9324ef527',
    'aa891b1f-d51f-4800-a73c-a4082becad19',
    'Aスタジオ (6帖)',
    NULL,
    6,
    4,
    2200,
    1200,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c4dc37da-2f87-46ed-a46c-2fffafa2bc14',
    'aa891b1f-d51f-4800-a73c-a4082becad19',
    'Bスタジオ (15帖)',
    NULL,
    15,
    6,
    4070,
    2860,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e6d4bcb4-1ac0-4b09-abe9-6985f9c0ed1b',
    'aa891b1f-d51f-4800-a73c-a4082becad19',
    'Cスタジオ (9帖)',
    NULL,
    9,
    4,
    3050,
    1980,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '5789c5d5-4583-4ff6-af2d-5a5e68944c60',
    'aa891b1f-d51f-4800-a73c-a4082becad19',
    'Dスタジオ (8帖)',
    NULL,
    8,
    4,
    2790,
    1650,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '7eb56b13-c580-42c0-a1dc-62b748c8c3fa',
    'aa891b1f-d51f-4800-a73c-a4082becad19',
    'Eスタジオ (7帖)',
    NULL,
    7,
    4,
    2720,
    1460,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd73c6e46-be02-49e5-ad34-76eb1dea971d',
    'aa891b1f-d51f-4800-a73c-a4082becad19',
    'Gスタジオ (12帖)',
    NULL,
    12,
    6,
    3820,
    2200,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '0ecd7c76-d727-4cba-ad74-4169b37233c8',
    'aa891b1f-d51f-4800-a73c-a4082becad19',
    'Music Innスタジオ (50帖)',
    NULL,
    50,
    30,
    10640,
    7700,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd17b04a7-ec41-4075-ab69-df2c8ac8c9f3',
    '87d744c8-ff3f-42f8-a830-e232ecf402df',
    'A1st (8帖)',
    NULL,
    8,
    4,
    1760,
    1650,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9c46418e-fbb5-46b8-a601-6e454d7aa024',
    '87d744c8-ff3f-42f8-a830-e232ecf402df',
    'A2st (8帖)',
    NULL,
    8,
    4,
    1760,
    1650,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '71b86197-5941-4b52-a4b6-f9e0532b1a7d',
    '87d744c8-ff3f-42f8-a830-e232ecf402df',
    'A3st (9帖)',
    NULL,
    9,
    4,
    1870,
    1760,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '20f20a28-6e09-4adc-a230-b9f923c4e8b9',
    '87d744c8-ff3f-42f8-a830-e232ecf402df',
    'B1st (14帖)',
    NULL,
    14,
    6,
    2640,
    2420,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1aaaf8af-86d6-4f6a-a20a-37d6edd0c1f0',
    '87d744c8-ff3f-42f8-a830-e232ecf402df',
    'B2st (13帖)',
    NULL,
    13,
    6,
    2530,
    2310,
    990,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '07c1a711-04d7-4574-aab9-4004b05e2ac5',
    '87d744c8-ff3f-42f8-a830-e232ecf402df',
    'Cst+Sub (28帖)',
    NULL,
    28,
    8,
    4400,
    4180,
    1320,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '81ec7e78-3097-45b1-ae85-b903149e1741',
    '87d744c8-ff3f-42f8-a830-e232ecf402df',
    'E1st (21帖)',
    NULL,
    21,
    8,
    3300,
    3080,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '137fd230-4e36-4c74-a79c-baef38fd40aa',
    '87d744c8-ff3f-42f8-a830-e232ecf402df',
    'E2st (20帖)',
    NULL,
    20,
    8,
    3190,
    2970,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '83dc87b5-68e4-446f-ade5-ad8d1216e1bd',
    '87d744c8-ff3f-42f8-a830-e232ecf402df',
    'G1st (12帖)',
    NULL,
    12,
    6,
    2310,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'fa545ee6-7a4e-4bc1-ab01-d6e4bfdc2589',
    '87d744c8-ff3f-42f8-a830-e232ecf402df',
    'GSst (10帖)',
    NULL,
    10,
    4,
    2200,
    2090,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '913c246b-2211-45de-a026-ff6ac5d9f74e',
    '87d744c8-ff3f-42f8-a830-e232ecf402df',
    'Booth1 (3帖)',
    NULL,
    3,
    4,
    880,
    880,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '37004b0a-c16e-472f-a623-b12b6422d05f',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '1st (15帖)',
    NULL,
    15,
    7,
    3630,
    2420,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '20659f06-445c-47bd-ae3d-eae71245f20a',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '2st (13帖)',
    NULL,
    13,
    6,
    3190,
    2310,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '2a79243f-5da5-418a-a691-bd538e46590b',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '3st (10帖)',
    NULL,
    10,
    5,
    2750,
    1980,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '212d1ed9-22c7-44da-a2c1-39b51062a121',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '4st (8帖)',
    NULL,
    8,
    4,
    2310,
    1650,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '5c8af270-1f1a-488c-a1e2-4b32df38dce4',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '5st (8帖 Vo/Rec/Key)',
    NULL,
    8,
    4,
    2000,
    1500,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '74e06b46-9c79-40a2-ae84-841aa3ebfd6b',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '6st (9帖)',
    NULL,
    9,
    5,
    2420,
    1870,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6228f8d9-7c12-4b2b-a164-31a4085c7e25',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '7st (12帖+ミーティング)',
    NULL,
    12,
    6,
    3300,
    2420,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6922f0c8-5e2f-4f4b-a2e8-90f4d46750ca',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '8st (9帖)',
    NULL,
    9,
    5,
    2420,
    1870,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '0014ad0d-bf32-4247-a1b5-112160220fd1',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '9st (9帖)',
    NULL,
    9,
    5,
    2420,
    1870,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8c5a21da-52a8-4208-a958-a9c4a13144d4',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '10st (28帖 ゲネプロ特大)',
    NULL,
    28,
    15,
    4950,
    3300,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'af90e0c1-5a8d-452b-a270-8296537f61c0',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '11st (10帖)',
    NULL,
    10,
    5,
    2750,
    1980,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a9c59576-138e-48c7-ac4f-94049112b584',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '12st (18帖)',
    NULL,
    18,
    8,
    3960,
    2860,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'abb0ff7d-1205-47c7-a3aa-391156ff017a',
    '74b1b450-9ddd-4a1a-ac1f-83b62680d802',
    '2Ast (9帖)',
    'B1F',
    9,
    5,
    2500,
    1200,
    600,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'de067131-b150-44ab-af46-48c1d2d91999',
    '74b1b450-9ddd-4a1a-ac1f-83b62680d802',
    '2Bst (11帖)',
    'B1F',
    11,
    5,
    2700,
    1300,
    650,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a486a993-e770-4be6-a527-4fed25028897',
    '74b1b450-9ddd-4a1a-ac1f-83b62680d802',
    '3Cst (10帖)',
    'B1F',
    10,
    5,
    2600,
    1200,
    600,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '46c86ba3-74ee-4194-a204-dd4ff0cb3ef7',
    '74b1b450-9ddd-4a1a-ac1f-83b62680d802',
    '3Dst (16帖)',
    'B1F',
    16,
    7,
    3500,
    1800,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '24b48732-8ed1-4188-a370-ec6c7ff334af',
    '74b1b450-9ddd-4a1a-ac1f-83b62680d802',
    '4Est (12帖)',
    'B1F',
    12,
    6,
    2800,
    1300,
    650,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'df6f8066-3e39-438d-a1fb-d07ad9ade168',
    '74b1b450-9ddd-4a1a-ac1f-83b62680d802',
    '4Fst (14帖)',
    'B1F',
    14,
    6,
    3300,
    1800,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '85af3cdb-91ad-4c91-a6a6-07177a2e9026',
    '74b1b450-9ddd-4a1a-ac1f-83b62680d802',
    '5Gst (26帖)',
    'B1F',
    26,
    10,
    4200,
    3500,
    850,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '4a5ffb74-0ea9-4800-a18e-e16337f9a84d',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'Sst (18帖)',
    'B1F-4F',
    18,
    8,
    5280,
    3960,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '0a71e054-2db3-456e-aa96-24f62f1247aa',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'A1st (15帖)',
    'B1F-4F',
    15,
    6,
    4620,
    3520,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '37d628cf-d078-4a0f-a1c5-cb78c54b2237',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'A2st (13帖)',
    'B1F-4F',
    13,
    5,
    4070,
    3080,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '708992bd-38d0-443b-a9fc-22c0ac365c89',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'B1st (12帖)',
    'B1F-4F',
    12,
    5,
    3850,
    2860,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c8847f55-f477-4570-a5cc-5747af2fa505',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'B2st (12帖)',
    'B1F-4F',
    12,
    5,
    3850,
    2860,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b8dc28f5-ca28-445d-af2a-902414393883',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'B3st (11帖)',
    'B1F-4F',
    11,
    5,
    3630,
    2750,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '53d24a61-8a94-4ee7-ab80-7e801f9092c3',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'B4st (11帖)',
    'B1F-4F',
    11,
    5,
    3630,
    2750,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd7dff647-1383-4d83-a56d-3878c7094294',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'Cst (10帖)',
    'B1F-4F',
    10,
    4,
    3410,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '0e4efa8b-f93c-43a6-a471-d65da6058b9b',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'G1st (9帖)',
    'B1F-4F',
    9,
    4,
    3190,
    2420,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '89903f20-3886-496c-ad90-494b431acfe2',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'G2st (8帖)',
    'B1F-4F',
    8,
    3,
    2970,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f87e769e-7574-43d7-a3a7-72c71440e3cd',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'G3st (8帖)',
    'B1F-4F',
    8,
    3,
    2970,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '5d5987d6-81dd-4463-af36-c27bb2c0db5a',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'Booth1 (4帖)',
    'B1F-4F',
    4,
    2,
    1980,
    1540,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c2602fae-f223-4efc-a8c8-5600d484637a',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'Booth2 (3帖)',
    'B1F-4F',
    3,
    2,
    1760,
    1320,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'ce4965cc-bedf-457d-a8a3-4e21ea9ce8cb',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'Rec Booth (5帖)',
    'B1F-4F',
    5,
    2,
    2200,
    1650,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b0606ba9-a0a6-4293-a1b4-1439f89995d0',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'A1st (15帖)',
    'B1F-4F',
    15,
    6,
    4620,
    3520,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6213987c-af79-4dc6-af31-953d3c2eae59',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'A2st (13帖)',
    'B1F-4F',
    13,
    5,
    4070,
    3080,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9a870c6a-d15a-4d38-a048-c02f64c6b3ac',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'A3st (12帖)',
    'B1F-4F',
    12,
    5,
    3850,
    2860,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'fd1535e3-e1fd-410a-ac89-387a36452a5c',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'A5st (10帖)',
    'B1F-4F',
    10,
    4,
    3410,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b1b739c4-c3d1-4a5e-a16f-6a7c95b761f9',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'B1st (14帖)',
    'B1F-4F',
    14,
    6,
    4400,
    3300,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e21770e9-e22d-4c98-a5c0-3e24d071df50',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'B2st (12帖)',
    'B1F-4F',
    12,
    5,
    3850,
    2860,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9292692b-63fb-4a07-aa76-b3abd080afa0',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'B3st (11帖)',
    'B1F-4F',
    11,
    5,
    3630,
    2750,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e5f1a378-f589-4a23-abbe-c2312506a404',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'B5st (10帖)',
    'B1F-4F',
    10,
    4,
    3410,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '3234cb26-8d2a-458f-af77-fc01c5ad7640',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'E1st (9帖)',
    'B1F-4F',
    9,
    4,
    3190,
    2420,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '45ce0638-8a6e-4490-a8e5-efe73d71de94',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'E2st (8帖)',
    'B1F-4F',
    8,
    3,
    2970,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '50ca3504-77e5-4f90-a91d-4ef30b1891ef',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'VoBooth (4帖)',
    'B1F-4F',
    4,
    2,
    1980,
    1540,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '66c0151a-f6df-48f1-aafe-a70718a63cf2',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'RecStudio (6帖)',
    'B1F-4F',
    6,
    2,
    2420,
    1870,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1c06ae8b-d763-4c30-acd8-14e1a23db13f',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'Sst (17帖)',
    'B1F-4F',
    17,
    7,
    5060,
    3850,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f19dd1d5-fcc5-4dae-ab11-b53dfa24b413',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'A1st (15帖)',
    'B1F-4F',
    15,
    6,
    4620,
    3520,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '686c9882-4f6d-4cb2-a90e-ed30de33c322',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'A2st (13帖)',
    'B1F-4F',
    13,
    5,
    4070,
    3080,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1595267d-dc24-451b-a420-c559a74807f9',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'A3st (12帖)',
    'B1F-4F',
    12,
    5,
    3850,
    2860,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '23c6e4c0-2570-4e2e-a714-9339a664351c',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'G1st (11帖)',
    'B1F-4F',
    11,
    5,
    3630,
    2750,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '224e586c-39c5-460c-a283-0f4340b8469a',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'G2st (10帖)',
    'B1F-4F',
    10,
    4,
    3410,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '968c2952-f674-4855-acee-6a24d982ea77',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'G3st (9帖)',
    'B1F-4F',
    9,
    4,
    3190,
    2420,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'fb4f53e8-ca1b-4da4-a6b6-226934bbfcce',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'B1st (14帖)',
    'B1F-4F',
    14,
    6,
    4400,
    3300,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '923d95f7-eb66-4c3c-a5dc-e19bfd30d355',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'B2st (12帖)',
    'B1F-4F',
    12,
    5,
    3850,
    2860,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'dae16e59-070c-46c6-a4ce-424acd42c722',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'B3st (11帖)',
    'B1F-4F',
    11,
    5,
    3630,
    2750,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '0bcc7d80-1a57-4982-ab67-c65a82ecc2d6',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'E1st (10帖)',
    'B1F-4F',
    10,
    4,
    3410,
    2530,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8364d67d-6de8-4c1b-a70d-9d6e89bef490',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'E2st (9帖)',
    'B1F-4F',
    9,
    4,
    3190,
    2420,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '94354240-95e7-46e7-a3aa-b9e89906cec2',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'Cst (8帖)',
    'B1F-4F',
    8,
    3,
    2970,
    2200,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'da2435c5-6c82-4b1a-a3fc-844f4411b222',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'VoBooth (3帖)',
    'B1F-4F',
    3,
    2,
    1760,
    1320,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6fc0c3f6-e13b-40da-ad6f-e1cdc5bfa0cc',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'A1st (14帖)',
    'B1F-4F',
    14,
    6,
    4400,
    3300,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '05bcdee6-c576-4178-ad69-ad489206f105',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'A2st (12帖)',
    'B1F-4F',
    12,
    5,
    3850,
    2860,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '65a89f10-6570-4946-a763-4a0786313ae0',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'A3st (10帖)',
    'B1F-4F',
    10,
    4,
    3410,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9251ac9c-22e3-42f8-ad8f-20ee6e2baf64',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'A4st (9帖)',
    'B1F-4F',
    9,
    4,
    3190,
    2420,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd38aaabb-ddc3-4ddb-afc2-e22947cc7aab',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'Cst (15帖)',
    'B1F-4F',
    15,
    6,
    4620,
    3520,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f037846b-f9bf-402e-adef-52b53259d265',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'Est (11帖)',
    'B1F-4F',
    11,
    5,
    3630,
    2750,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9947d99d-4791-4961-af25-b32392ca03f0',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'DJ 1st (6帖)',
    'B1F-4F',
    6,
    2,
    2420,
    1870,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '344ee7d0-57b0-4436-a4e6-35593a11865d',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'DJ 2st (6帖)',
    'B1F-4F',
    6,
    2,
    2420,
    1870,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8a28b25f-a5cb-4deb-ab0e-07fad13e4ffe',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'DJ 3st (6帖)',
    'B1F-4F',
    6,
    2,
    2420,
    1870,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '573b9772-4b4a-420b-aa84-fe0c52b11a05',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'Booth1 (4帖)',
    'B1F-4F',
    4,
    2,
    1980,
    1540,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '43ec5944-f044-4be7-a746-146d806677be',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'Booth2 (3帖)',
    'B1F-4F',
    3,
    2,
    1760,
    1320,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '44eaa8c3-8612-4fd0-a662-28b07891ec5d',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'Booth3 (3帖)',
    'B1F-4F',
    3,
    2,
    1760,
    1320,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a74efd97-b868-4eb6-a4dc-663637e70ad5',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'Booth4 (3帖)',
    'B1F-4F',
    3,
    2,
    1760,
    1320,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd768deaf-a1ca-46e5-ac30-45d73b277fcc',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'RecBooth (5帖)',
    'B1F-4F',
    5,
    2,
    2200,
    1650,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd6280852-4816-4a0e-a5a0-762ce8eafd3a',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'RecStudioBooth (7帖)',
    'B1F-4F',
    7,
    3,
    2640,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6533019b-fd2b-4d8a-aebd-b56ab224e6c9',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'S1st (22帖)',
    'B1F-4F',
    22,
    10,
    6270,
    4730,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '54b0db7f-be43-4ec5-a5ba-ef2af688e6e4',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'S2st (18帖)',
    'B1F-4F',
    18,
    8,
    5280,
    3960,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '22555425-4419-4377-a622-18ee665619b0',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'S3st (16帖)',
    'B1F-4F',
    16,
    7,
    4840,
    3630,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '3980a7b0-3b56-4f66-a67c-ee7178704557',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'A1st (15帖)',
    'B1F-4F',
    15,
    6,
    4620,
    3520,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'ab6343c8-63ac-4a91-a14f-fc13000d7787',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'A2st (14帖)',
    'B1F-4F',
    14,
    6,
    4400,
    3300,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '2ba2719c-85f6-4f57-a7e2-0186912d1e72',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'A3st (13帖)',
    'B1F-4F',
    13,
    5,
    4070,
    3080,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '4561b432-5fed-410e-ad62-66975be1d700',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'A5st (12帖)',
    'B1F-4F',
    12,
    5,
    3850,
    2860,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '020848cf-8bc0-4949-a864-136f7c0c8958',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'A6st (11帖)',
    'B1F-4F',
    11,
    5,
    3630,
    2750,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '21728d58-0a2f-4098-a168-3399f7df950e',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'A7st (10帖)',
    'B1F-4F',
    10,
    4,
    3410,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '15eb1f23-6c10-4f75-ae71-7b6fd2c73b70',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'G1st (12帖)',
    'B1F-4F',
    12,
    5,
    3850,
    2860,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6d150cc0-3fbd-4758-a9db-f841ecbd0a6f',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'G2st (10帖)',
    'B1F-4F',
    10,
    4,
    3410,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '66c3c1b7-23d8-4ebd-a2e3-73eadbbaefb1',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'G3st (9帖)',
    'B1F-4F',
    9,
    4,
    3190,
    2420,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6f48a19d-ea14-4ecf-a6b2-8a53e52b1a57',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'B1st (14帖)',
    'B1F-4F',
    14,
    6,
    4400,
    3300,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '08e75658-60c5-428c-ad95-339733493a22',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'B2st (12帖)',
    'B1F-4F',
    12,
    5,
    3850,
    2860,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a7e05898-4164-4676-ab35-f1e025b787dd',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'B3st (10帖)',
    'B1F-4F',
    10,
    4,
    3410,
    2530,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '59dfe699-342c-4134-a593-e6d1b1746667',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'E1st (11帖)',
    'B1F-4F',
    11,
    5,
    3630,
    2750,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '3305287e-91a8-404e-af5f-cc780dd476b8',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'E2st (9帖)',
    'B1F-4F',
    9,
    4,
    3190,
    2420,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1cb23559-e4ba-4ffe-a3d4-77bfa3df9d35',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'E3st (8帖)',
    'B1F-4F',
    8,
    3,
    2970,
    2200,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '139685cd-4f49-408c-ac1e-a792c7ac4eda',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'CSst (25帖)',
    'B1F-4F',
    25,
    10,
    6600,
    4950,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f569322e-230e-40a6-af4a-8558fe281de8',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'Fst (13帖)',
    'B1F-4F',
    13,
    5,
    4070,
    3080,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'eae2e123-8205-4639-afaa-daa7a10d5cd5',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'RecStudio (8帖)',
    'B1F-4F',
    8,
    3,
    2970,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd236c685-eb13-4bf0-a2e7-f20a8fcddcc8',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'Booth (4帖)',
    'B1F-4F',
    4,
    2,
    1980,
    1540,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f14d626d-c1d1-407c-aaac-8b56f0adc0ea',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'A1st (8.5帖)',
    'B1F-4F',
    9,
    4,
    3190,
    2420,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'afad3f14-8068-43e4-a8a9-96636d515d09',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'A2st (8.5帖)',
    'B1F-4F',
    9,
    4,
    3190,
    2420,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '892cfbe1-78aa-40e5-a7e1-4d81463adffc',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'Cst (18帖)',
    'B1F-4F',
    18,
    8,
    5280,
    3960,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8013d52f-98a6-492a-a6ee-f4d9d33cc743',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'Gst (12帖)',
    'B1F-4F',
    12,
    5,
    3850,
    2860,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c31796b9-7051-4051-ab84-92ca2a943e1b',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'B1st (13帖)',
    'B1F-4F',
    13,
    5,
    4070,
    3080,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'ce717ec8-2b6b-4dff-a718-6a992b502c72',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'A3st (8.5帖)',
    'B1F-4F',
    9,
    4,
    3190,
    2420,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '7f9b520b-fe11-4dca-ac15-920787760df2',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'A5st (9帖)',
    'B1F-4F',
    9,
    4,
    3190,
    2420,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'eed1ebb1-d6d4-4ea5-a4b2-2a4dca51806d',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'Est (15帖)',
    'B1F-4F',
    15,
    6,
    4620,
    3520,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '431b51df-8abe-4c82-a959-46e753388a3f',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'B2st (14帖)',
    'B1F-4F',
    14,
    6,
    4400,
    3300,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '3dfa9a10-d175-43ac-a57a-2c8d36a3221c',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'B3st (14帖)',
    'B1F-4F',
    14,
    6,
    4400,
    3300,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e7df1a49-e966-4cbc-ac4b-4e04a0728b60',
    '230f823c-11fc-4770-a3f9-3bb769a0bcfc',
    '1st (16帖)',
    'B1F',
    16,
    7,
    3520,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '62d85c00-343e-419a-a20b-fc9e25736133',
    '230f823c-11fc-4770-a3f9-3bb769a0bcfc',
    '2st (14帖)',
    'B1F',
    14,
    6,
    3190,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '563db1d8-3259-4554-a794-6b3a17e7ca4c',
    '230f823c-11fc-4770-a3f9-3bb769a0bcfc',
    '3st (12帖)',
    'B1F',
    12,
    5,
    2860,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd07faab7-64a0-4ed2-a467-f040d67f07c6',
    '230f823c-11fc-4770-a3f9-3bb769a0bcfc',
    '4st (10帖)',
    'B1F',
    10,
    5,
    2640,
    1760,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b184b83d-7c3d-48a7-af04-aa4a390b7e03',
    '230f823c-11fc-4770-a3f9-3bb769a0bcfc',
    '5st (9帖)',
    'B1F',
    9,
    4,
    2420,
    1650,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e8ac9ef2-344d-4452-a211-b77e787d3d9c',
    '230f823c-11fc-4770-a3f9-3bb769a0bcfc',
    '6st (8帖)',
    'B1F',
    8,
    4,
    2200,
    1540,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '074a0ac1-4f2a-4ded-aeab-76b534f428d4',
    '230f823c-11fc-4770-a3f9-3bb769a0bcfc',
    '7st (7帖)',
    'B1F',
    7,
    3,
    1980,
    1430,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'fa7f37ad-c3a6-4c24-a1df-30561f9feab8',
    'feac07ff-504a-47a8-a504-390b3fa58406',
    '1st (16帖)',
    'B1F',
    16,
    7,
    3520,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9b229f1d-8168-4b09-ab53-b3a9a7dab44f',
    'feac07ff-504a-47a8-a504-390b3fa58406',
    '2st (15帖)',
    'B1F',
    15,
    6,
    3300,
    2310,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'dc811606-26a9-46ed-ae15-00cf144baf68',
    'feac07ff-504a-47a8-a504-390b3fa58406',
    '3st (13帖)',
    'B1F',
    13,
    6,
    2970,
    2090,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '11c252f1-c358-4500-a456-659ae2ac6e8a',
    'feac07ff-504a-47a8-a504-390b3fa58406',
    '4st (12帖)',
    'B1F',
    12,
    5,
    2860,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '75ea60c4-a804-48cf-ad81-652b91cff742',
    'feac07ff-504a-47a8-a504-390b3fa58406',
    '5st (10帖)',
    'B1F',
    10,
    5,
    2640,
    1760,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6a30cce5-b0f1-47fb-a330-23fff513c9b1',
    'feac07ff-504a-47a8-a504-390b3fa58406',
    '6st (8帖)',
    'B1F',
    8,
    4,
    2200,
    1540,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '31c5900d-5331-4f5c-a042-30dcd529ebc8',
    'feac07ff-504a-47a8-a504-390b3fa58406',
    '7st (7帖)',
    'B1F',
    7,
    3,
    1980,
    1430,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '0ace9d72-b6f4-428d-acc4-8090853878df',
    '4d810a77-a37e-49e7-a279-1e4fbd51f543',
    '1st (15帖)',
    'B1F',
    15,
    6,
    3300,
    2310,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '7d4877c1-4b44-4876-a4e3-46d0688cb26c',
    '4d810a77-a37e-49e7-a279-1e4fbd51f543',
    '2st (13帖)',
    'B1F',
    13,
    6,
    2970,
    2090,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '39e2172b-04f1-44d7-a78e-5d4b53c2dfa9',
    '4d810a77-a37e-49e7-a279-1e4fbd51f543',
    '3st (11帖)',
    'B1F',
    11,
    5,
    2750,
    1870,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '129c3f86-4245-4392-a4f2-df6fb5cb4434',
    '4d810a77-a37e-49e7-a279-1e4fbd51f543',
    '4st (10帖)',
    'B1F',
    10,
    5,
    2640,
    1760,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '60c2a2cd-c13f-40a2-a463-43d8c5b6d543',
    '4d810a77-a37e-49e7-a279-1e4fbd51f543',
    '5st (8帖)',
    'B1F',
    8,
    4,
    2200,
    1540,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '5f779fec-e93a-4568-a045-a610c1d19687',
    '4d810a77-a37e-49e7-a279-1e4fbd51f543',
    '6st (7帖)',
    'B1F',
    7,
    3,
    1980,
    1430,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9c841b9e-dcd4-4346-a742-c42c6e5d4fe5',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '101st L (16帖)',
    '1F',
    16,
    7,
    3520,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c0a04ff1-51c3-474f-a01b-e1dbdcfed810',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '102st L (16帖)',
    '1F',
    16,
    7,
    3520,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '56c4eafd-e586-4499-a92b-1f2c1f1d3d2e',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '103st L (16帖)',
    '1F',
    16,
    7,
    3520,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e51686b1-ed5c-41ef-aa46-779fd3447f82',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '201st M (14帖)',
    '2F',
    14,
    6,
    3190,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'dacfb6b8-72c2-4012-ab64-bc6202f6ab17',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '202st M (14帖)',
    '2F',
    14,
    6,
    3190,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '4f29bafc-3c9a-4668-ae2a-d109091b411a',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '203st M (14帖)',
    '2F',
    14,
    6,
    3190,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd44d4a0e-1564-41bd-ab84-610477e76bd2',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '204st M (14帖)',
    '2F',
    14,
    6,
    3190,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b49d4732-cfe3-4f59-af7a-dcd95661a29a',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '301st M (14帖)',
    '3F',
    14,
    6,
    3190,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f9828fe0-2631-4327-a839-b23614c26b42',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '302st M (12帖)',
    '3F',
    12,
    5,
    2860,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'be77f115-e523-4175-ac26-b0b6dd6c2ba7',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '303st M (12帖)',
    '3F',
    12,
    5,
    2860,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '18ce79d2-a600-4794-a034-5ef0da3c6aa8',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '304st M (12帖)',
    '3F',
    12,
    5,
    2860,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e971c550-259c-4101-a238-377ca9900806',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '401st M (12帖)',
    '4F',
    12,
    5,
    2860,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '7e1158a2-aecc-4e28-a60b-62daf7433c3a',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '402st M (10帖)',
    '4F',
    10,
    5,
    2640,
    1760,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f8c7b055-e820-4d52-ab20-5e11548308f7',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '403st M (10帖)',
    '4F',
    10,
    5,
    2640,
    1760,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'cbe0e853-0cef-4060-ac6f-00abd1277301',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '404st M (10帖)',
    '4F',
    10,
    5,
    2640,
    1760,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'ba37b319-9525-468e-a11d-6c1e50bedf2b',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '501st M (12帖)',
    '5F',
    12,
    5,
    2860,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '56125f05-a588-4289-a153-477a3c59a3bb',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '502st M (10帖)',
    '5F',
    10,
    5,
    2640,
    1760,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '2e2b47a1-f4d2-4534-aaef-eb30ce58afc4',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '503st M (10帖)',
    '5F',
    10,
    5,
    2640,
    1760,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '626796fb-c74a-42ed-a1c6-ec1e856640d0',
    'a9336dba-41bc-4d18-abcd-d94a03a4cd42',
    '504st L (16帖)',
    '5F',
    16,
    7,
    3520,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '63f2c048-7266-4ced-a5cf-31cc5daf3251',
    'caa366f1-ea3c-4014-ad69-330b3b359a7c',
    'Rhythm (9帖)',
    'B2F',
    9,
    4,
    3140,
    1980,
    790,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8c1cd820-80e5-4cf0-a834-1a7d3ad27438',
    'caa366f1-ea3c-4014-ad69-330b3b359a7c',
    'Harmony (10帖)',
    'B2F',
    10,
    4,
    3440,
    2250,
    790,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'df34deb4-2a88-409c-aa6e-0c87eb54c63a',
    'caa366f1-ea3c-4014-ad69-330b3b359a7c',
    'Tone (11帖)',
    'B2F',
    11,
    5,
    3560,
    2360,
    790,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '342165d6-2c35-44dd-a337-2ff2d460ebe8',
    'caa366f1-ea3c-4014-ad69-330b3b359a7c',
    'Kick (13帖)',
    'B2F',
    13,
    6,
    3930,
    2640,
    790,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '43d72d14-a694-4b55-abff-b051d504febb',
    'caa366f1-ea3c-4014-ad69-330b3b359a7c',
    'Opus (17帖)',
    'B2F',
    17,
    8,
    4710,
    3520,
    790,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f7300908-7845-46d9-afae-9ce73612e1fe',
    'caa366f1-ea3c-4014-ad69-330b3b359a7c',
    'Beat (20帖)',
    'B2F',
    20,
    15,
    5140,
    3960,
    790,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '69203f06-eee5-41d9-aa4e-86a98a678bb7',
    'caa366f1-ea3c-4014-ad69-330b3b359a7c',
    'Multiplex (22帖)',
    'B2F',
    22,
    15,
    5380,
    4180,
    790,
    0
  ) ON CONFLICT (id) DO NOTHING;

  -- 3. 常設機材マスター (188件)
  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '712a2eb2-2c0e-4a6c-ac92-7be381e080c2',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg SVT',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg SVT、Pearl Drums、15帖以上、セルフレコ対応'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f72196a8-188c-4638-ab1d-50bb777ed277',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'bc2ba5bf-d1a2-4a13-ae4d-2f400309cf59',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '15cdf5ea-410c-410e-a09b-0d66a782224d',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg SVT',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg SVT、Pearl Drums、15帖以上、セルフレコ対応'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '114425a9-be9d-434f-a34e-9cd675dd62af',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg SVT',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg SVT、Pearl Drums、15帖以上、セルフレコ対応'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '587a80c4-6e96-4089-aaf0-9576dba22188',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '78b1c338-153f-4e5e-ad08-2ddff43d6657',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd6036857-29cd-4669-a628-289a7bc80a71',
    '{}',
    'Ampeg / Bass Amp',
    'Standard Drum Set',
    true,
    '{"アップライトピアノ常設"}',
    'アップライトピアノ常設、完全分煙'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a54af9b9-5947-4dfe-a79f-f5b550d690eb',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg / Bass Amp',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5ffe9795-da83-4673-a77b-d953bc2237ab',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg / Bass Amp',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3fd0901e-80e1-4b85-aedf-5e3d146cd13b',
    '{}',
    'Ampeg / Bass Amp',
    'Standard Drum Set',
    true,
    '{"キーボード常設"}',
    'ボーカル・個人練習特化、キーボード常設'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '4b69db35-529d-4ea8-a9a7-9af6febc6c8c',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg / Bass Amp',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '40575c9a-5c17-4fd7-a265-3fe5e53903b3',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg / Bass Amp',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '49ac09db-a80a-40cb-aa3f-5ef828fe39df',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg / Bass Amp',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '63dbcec7-f888-42ca-a1d0-ed6389800657',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg',
    'Canopus Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg、Canopus Drums、14帖以上'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '34de4681-993b-48d8-af29-5de7a03183a6',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg',
    'Canopus Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg、Canopus Drums、14帖以上'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a9899e98-ccf5-4939-a735-38a3dc52bae3',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg',
    'Canopus Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg、Canopus Drums、14帖以上'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f83035d0-e272-46e3-a7f1-d6ef24a53846',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg',
    'Canopus Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg、Canopus Drums、14帖以上'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '61a61365-429d-41c5-aa89-02e9324ef527',
    '{"Marshall","Roland JC-120","Fender Twin Reverb"}',
    'Ampeg / Bass Amp',
    'Standard Drum Set',
    true,
    '{}',
    'Marshall、Roland JC-120、Fender Twin Reverb、無料レンタル充実'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c4dc37da-2f87-46ed-a46c-2fffafa2bc14',
    '{"ギターアンプ4種常設","Marshall","Roland JC-120"}',
    'Ampeg',
    'Standard Drum Set',
    true,
    '{}',
    'ギターアンプ4種常設、Marshall、Roland JC-120、Ampeg、広々12帖以上'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e6d4bcb4-1ac0-4b09-abe9-6985f9c0ed1b',
    '{"Marshall","Roland JC-120","Fender Twin Reverb"}',
    'Ampeg / Bass Amp',
    'Standard Drum Set',
    true,
    '{}',
    'Marshall、Roland JC-120、Fender Twin Reverb、無料レンタル充実'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5789c5d5-4583-4ff6-af2d-5a5e68944c60',
    '{"Marshall","Roland JC-120","Fender Twin Reverb"}',
    'Ampeg / Bass Amp',
    'Standard Drum Set',
    true,
    '{}',
    'Marshall、Roland JC-120、Fender Twin Reverb、無料レンタル充実'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '7eb56b13-c580-42c0-a1dc-62b748c8c3fa',
    '{"Marshall","Roland JC-120","Fender Twin Reverb"}',
    'Ampeg / Bass Amp',
    'Standard Drum Set',
    true,
    '{}',
    'Marshall、Roland JC-120、Fender Twin Reverb、無料レンタル充実'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd73c6e46-be02-49e5-ad34-76eb1dea971d',
    '{"ギターアンプ4種常設","Marshall","Roland JC-120"}',
    'Ampeg',
    'Standard Drum Set',
    true,
    '{}',
    'ギターアンプ4種常設、Marshall、Roland JC-120、Ampeg、広々12帖以上'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '0ecd7c76-d727-4cba-ad74-4169b37233c8',
    '{"アンプ多数常設"}',
    'Ampeg / Bass Amp',
    'Standard Drum Set',
    true,
    '{}',
    '50帖超巨大スタジオ、ライブ・ゲネプロ対応、アンプ多数常設'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd17b04a7-ec41-4075-ab69-df2c8ac8c9f3',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg',
    'Canopus Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg、Canopus Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9c46418e-fbb5-46b8-a601-6e454d7aa024',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg',
    'Canopus Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg、Canopus Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '71b86197-5941-4b52-a4b6-f9e0532b1a7d',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg',
    'Canopus Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg、Canopus Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '20f20a28-6e09-4adc-a230-b9f923c4e8b9',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg',
    'Canopus Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg、Canopus Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1aaaf8af-86d6-4f6a-a20a-37d6edd0c1f0',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg',
    'Canopus Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg、Canopus Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '07c1a711-04d7-4574-aab9-4004b05e2ac5',
    '{"Marshall JVM410H","Roland JC-120"}',
    'Ampeg SVT',
    'DW Drums',
    true,
    '{}',
    'Marshall JVM410H、Roland JC-120、Ampeg SVT、DW Drums、ゲネプロ対応20帖以上'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '81ec7e78-3097-45b1-ae85-b903149e1741',
    '{"Marshall JVM410H","Roland JC-120"}',
    'Ampeg SVT',
    'DW Drums',
    true,
    '{}',
    'Marshall JVM410H、Roland JC-120、Ampeg SVT、DW Drums、ゲネプロ対応20帖以上'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '137fd230-4e36-4c74-a79c-baef38fd40aa',
    '{"Marshall JVM410H","Roland JC-120"}',
    'Ampeg SVT',
    'DW Drums',
    true,
    '{}',
    'Marshall JVM410H、Roland JC-120、Ampeg SVT、DW Drums、ゲネプロ対応20帖以上'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '83dc87b5-68e4-446f-ade5-ad8d1216e1bd',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg',
    'Canopus Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg、Canopus Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'fa545ee6-7a4e-4bc1-ab01-d6e4bfdc2589',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg',
    'Canopus Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg、Canopus Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '913c246b-2211-45de-a026-ff6ac5d9f74e',
    '{}',
    'Ampeg / Bass Amp',
    'Standard Drum Set',
    true,
    '{}',
    'ボーカル録音専用、完全防音ブース'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '37004b0a-c16e-472f-a623-b12b6422d05f',
    '{"Marshall JCM2000","Roland JC-120B"}',
    'Ampeg SVT-450H',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120B、Ampeg SVT-450H、Pearl Drums、セルフレコ対応、15帖以上'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '20659f06-445c-47bd-ae3d-eae71245f20a',
    '{"Marshall JCM900","Roland JC-120B"}',
    'Ampeg SVT-450H',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120B、Ampeg SVT-450H、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '2a79243f-5da5-418a-a691-bd538e46590b',
    '{"Marshall DSL100H","Roland JC-120B"}',
    'Hartke 3500',
    'Pearl Drums',
    true,
    '{}',
    'Marshall DSL100H、Roland JC-120B、Hartke 3500、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '212d1ed9-22c7-44da-a2c1-39b51062a121',
    '{"Marshall DSL40CR","Roland JC-120B"}',
    'Hartke 3500',
    'Pearl Drums',
    true,
    '{}',
    'Marshall DSL40CR、Roland JC-120B、Hartke 3500、Pearl Drums、少人数割'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5c8af270-1f1a-488c-a1e2-4b32df38dce4',
    '{"Roland JC-120B"}',
    'Ampeg / Hartke Bass Amp',
    'Standard Drum Set',
    true,
    '{"YAMAHA CP4 STAGE"}',
    'Roland JC-120B、YAMAHA CP4 STAGE、ドラムレスブース、ボーカル・配信特化'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '74e06b46-9c79-40a2-ae84-841aa3ebfd6b',
    '{"Marshall JCM900","Roland JC-120B"}',
    'Ampeg SVT',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120B、Ampeg SVT、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6228f8d9-7c12-4b2b-a164-31a4085c7e25',
    '{"Marshall JCM2000","Roland JC-120B"}',
    'Ampeg SVT',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120B、Ampeg SVT、Pearl Drums、30分スタート、専用ミーティングブース'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6922f0c8-5e2f-4f4b-a2e8-90f4d46750ca',
    '{"Marshall DSL100H","Roland JC-120B"}',
    'Hartke 3500',
    'Pearl Drums',
    true,
    '{}',
    'Marshall DSL100H、Roland JC-120B、Hartke 3500、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '0014ad0d-bf32-4247-a1b5-112160220fd1',
    '{"Marshall DSL100H","Roland JC-120B"}',
    'Hartke 3500',
    'Pearl Drums',
    true,
    '{}',
    'Marshall DSL100H、Roland JC-120B、Hartke 3500、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8c5a21da-52a8-4208-a958-a9c4a13144d4',
    '{"Marshall JVM410H","Fender Twin Reverb","Roland JC-120B"}',
    'Ampeg SVT-CL',
    'Pearl Masters',
    true,
    '{}',
    'Marshall JVM410H、Fender Twin Reverb、Roland JC-120B、Ampeg SVT-CL、Pearl Masters、20帖以上、セルフレコ対応、ゲネプロ特大'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'af90e0c1-5a8d-452b-a270-8296537f61c0',
    '{"Marshall JCM900","Roland JC-120B"}',
    'Ampeg SVT',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120B、Ampeg SVT、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a9c59576-138e-48c7-ac4f-94049112b584',
    '{"Marshall JVM210H","Mesa/Boogie Dual Rectifier","Roland JC-120B"}',
    'Ampeg SVT-VR',
    'Canopus Yaiba II',
    true,
    '{}',
    'Marshall JVM210H、Mesa/Boogie Dual Rectifier、Roland JC-120B、Ampeg SVT-VR、Canopus Yaiba II、15帖以上、セルフレコ対応'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'abb0ff7d-1205-47c7-a3aa-391156ff017a',
    '{"Marshall JCM2000 + 1960A","Roland JC-120"}',
    'Hartke HA2500 + VX410 x2',
    'YAMAHA Oak Custom (20/10/12/14)',
    true,
    '{}',
    '手頃な9帖スタジオ。毎時30分スタート。YAMAHA CP-33 / S03完備。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'de067131-b150-44ab-af46-48c1d2d91999',
    '{"Marshall JCM2000 + 1960A","Roland JC-120"}',
    'Hartke HA2500 + VX410 x2',
    'YAMAHA Oak Custom (20/10/12/14)',
    true,
    '{}',
    '11帖スタジオ。毎時30分スタート。YAMAHA CP33 / S03完備。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a486a993-e770-4be6-a527-4fed25028897',
    '{"Marshall JCM2000 + 1960A","Roland JC-120"}',
    'Hartke HA2500 + VX410 x2',
    'YAMAHA Oak Custom (20/10/12/14)',
    true,
    '{}',
    '手頃な料金で人気の10帖スタジオ。毎時00分スタート。YAMAHA CP33 / S03完備。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '46c86ba3-74ee-4194-a204-dd4ff0cb3ef7',
    '{"Marshall JCM2000 + 1960A","Roland JC-120"}',
    'Hartke HA2500 + VX410 x2',
    'YAMAHA Recording Custom (20/8/10/12/13/14)',
    true,
    '{}',
    '広々16帖。毎時00分スタート。YAMAHA CP33 / S03完備。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '24b48732-8ed1-4188-a370-ec6c7ff334af',
    '{"Marshall JCM2000 + 1960A","Roland JC-120"}',
    'Hartke HA2500 + VX410 x2',
    'YAMAHA Oak Custom (20/10/12/14)',
    true,
    '{}',
    '標準的な12帖スタジオ。毎時00分スタート。YAMAHA CP33 / S03完備。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'df6f8066-3e39-438d-a1fb-d07ad9ade168',
    '{"Marshall JCM2000 + 1960A","Roland JC-120"}',
    'Hartke HA2500 + VX410 x2',
    'YAMAHA Recording Custom (20/8/10/12/13/14)',
    true,
    '{}',
    'ゆったり14帖。毎時00分スタート。YAMAHA CP33 / S03完備。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '85af3cdb-91ad-4c91-a6a6-07177a2e9026',
    '{"Marshall JCM2000 + 1960A","Roland JC-120","Fender Hot Rod Deville III 212"}',
    'Hartke HA3500 + VX410 x2',
    'YAMAHA Birch Custom (20/8/10/12/13/14)',
    true,
    '{}',
    '当店最大26帖スタジオ。毎時30分スタート。アンプ3台常設・大型ゲネプロ対応。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '4a5ffb74-0ea9-4800-a18e-e16337f9a84d',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '0a71e054-2db3-456e-aa96-24f62f1247aa',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '37d628cf-d078-4a0f-a1c5-cb78c54b2237',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '708992bd-38d0-443b-a9fc-22c0ac365c89',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c8847f55-f477-4570-a5cc-5747af2fa505',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b8dc28f5-ca28-445d-af2a-902414393883',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '53d24a61-8a94-4ee7-ab80-7e801f9092c3',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd7dff647-1383-4d83-a56d-3878c7094294',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '0e4efa8b-f93c-43a6-a471-d65da6058b9b',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '89903f20-3886-496c-ad90-494b431acfe2',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f87e769e-7574-43d7-a3a7-72c71440e3cd',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5d5987d6-81dd-4463-af36-c27bb2c0db5a',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c2602fae-f223-4efc-a8c8-5600d484637a',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'ce4965cc-bedf-457d-a8a3-4e21ea9ce8cb',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b0606ba9-a0a6-4293-a1b4-1439f89995d0',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6213987c-af79-4dc6-af31-953d3c2eae59',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9a870c6a-d15a-4d38-a048-c02f64c6b3ac',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'fd1535e3-e1fd-410a-ac89-387a36452a5c',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b1b739c4-c3d1-4a5e-a16f-6a7c95b761f9',
    '{"Roland JC-120","Marshall JVM210H + 1960A"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e21770e9-e22d-4c98-a5c0-3e24d071df50',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9292692b-63fb-4a07-aa76-b3abd080afa0',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e5f1a378-f589-4a23-abbe-c2312506a404',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3234cb26-8d2a-458f-af77-fc01c5ad7640',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '45ce0638-8a6e-4490-a8e5-efe73d71de94',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '50ca3504-77e5-4f90-a91d-4ef30b1891ef',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '66c0151a-f6df-48f1-aafe-a70718a63cf2',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1c06ae8b-d763-4c30-acd8-14e1a23db13f',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f19dd1d5-fcc5-4dae-ab11-b53dfa24b413',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '686c9882-4f6d-4cb2-a90e-ed30de33c322',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1595267d-dc24-451b-a420-c559a74807f9',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '23c6e4c0-2570-4e2e-a714-9339a664351c',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '224e586c-39c5-460c-a283-0f4340b8469a',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '968c2952-f674-4855-acee-6a24d982ea77',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'fb4f53e8-ca1b-4da4-a6b6-226934bbfcce',
    '{"Roland JC-120","Marshall JVM210H + 1960A"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '923d95f7-eb66-4c3c-a5dc-e19bfd30d355',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'dae16e59-070c-46c6-a4ce-424acd42c722',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '0bcc7d80-1a57-4982-ab67-c65a82ecc2d6',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8364d67d-6de8-4c1b-a70d-9d6e89bef490',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '94354240-95e7-46e7-a3aa-b9e89906cec2',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'da2435c5-6c82-4b1a-a3fc-844f4411b222',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6fc0c3f6-e13b-40da-ad6f-e1cdc5bfa0cc',
    '{"Roland JC-120","Marshall JVM210H + 1960A"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '05bcdee6-c576-4178-ad69-ad489206f105',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '65a89f10-6570-4946-a763-4a0786313ae0',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9251ac9c-22e3-42f8-ad8f-20ee6e2baf64',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd38aaabb-ddc3-4ddb-afc2-e22947cc7aab',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f037846b-f9bf-402e-adef-52b53259d265',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9947d99d-4791-4961-af25-b32392ca03f0',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '344ee7d0-57b0-4436-a4e6-35593a11865d',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8a28b25f-a5cb-4deb-ab0e-07fad13e4ffe',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '573b9772-4b4a-420b-aa84-fe0c52b11a05',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '43ec5944-f044-4be7-a746-146d806677be',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '44eaa8c3-8612-4fd0-a662-28b07891ec5d',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a74efd97-b868-4eb6-a4dc-663637e70ad5',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd768deaf-a1ca-46e5-ac30-45d73b277fcc',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd6280852-4816-4a0e-a5a0-762ce8eafd3a',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6533019b-fd2b-4d8a-aebd-b56ab224e6c9',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '54b0db7f-be43-4ec5-a5ba-ef2af688e6e4',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '22555425-4419-4377-a622-18ee665619b0',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3980a7b0-3b56-4f66-a67c-ee7178704557',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'ab6343c8-63ac-4a91-a14f-fc13000d7787',
    '{"Roland JC-120","Marshall JVM210H + 1960A"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '2ba2719c-85f6-4f57-a7e2-0186912d1e72',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '4561b432-5fed-410e-ad62-66975be1d700',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '020848cf-8bc0-4949-a864-136f7c0c8958',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '21728d58-0a2f-4098-a168-3399f7df950e',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '15eb1f23-6c10-4f75-ae71-7b6fd2c73b70',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6d150cc0-3fbd-4758-a9db-f841ecbd0a6f',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '66c3c1b7-23d8-4ebd-a2e3-73eadbbaefb1',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6f48a19d-ea14-4ecf-a6b2-8a53e52b1a57',
    '{"Roland JC-120","Marshall JVM210H + 1960A"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '08e75658-60c5-428c-ad95-339733493a22',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a7e05898-4164-4676-ab35-f1e025b787dd',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '59dfe699-342c-4134-a593-e6d1b1746667',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3305287e-91a8-404e-af5f-cc780dd476b8',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1cb23559-e4ba-4ffe-a3d4-77bfa3df9d35',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '139685cd-4f49-408c-ac1e-a792c7ac4eda',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f569322e-230e-40a6-af4a-8558fe281de8',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'eae2e123-8205-4639-afaa-daa7a10d5cd5',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd236c685-eb13-4bf0-a2e7-f20a8fcddcc8',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    '※セルフレコーディング・ボーカル・個人練習に最適な防音ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f14d626d-c1d1-407c-aaac-8b56f0adc0ea',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'afad3f14-8068-43e4-a8a9-96636d515d09',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '892cfbe1-78aa-40e5-a7e1-4d81463adffc',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8013d52f-98a6-492a-a6ee-f4d9d33cc743',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c31796b9-7051-4051-ab84-92ca2a943e1b',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'ce717ec8-2b6b-4dff-a718-6a992b502c72',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '7f9b520b-fe11-4dca-ac15-920787760df2',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'eed1ebb1-d6d4-4ea5-a4b2-2a4dca51806d',
    '{"Roland JC-120","Marshall JVM210H + 1960A","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '431b51df-8abe-4c82-a959-46e753388a3f',
    '{"Roland JC-120","Marshall JVM210H + 1960A"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3dfa9a10-d175-43ac-a57a-2c8d36a3221c',
    '{"Roland JC-120","Marshall JVM210H + 1960A"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e7df1a49-e966-4cbc-ac4b-4e04a0728b60',
    '{"Roland JC-120","Marshall JCM2000 DSL100","Mesa/Boogie Dual Rectifier"}',
    'Ampeg SVT-3PRO + SVT-810E',
    'Pearl Masters Studio',
    true,
    '{}',
    'シティサイド最大16帖スタジオ。ヴィンテージアンプも完備。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '62d85c00-343e-419a-a20b-fc9e25736133',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Hartke HA3500 + 410XL',
    'Pearl Session Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '563db1d8-3259-4554-a794-6b3a17e7ca4c',
    '{"Roland JC-120","Marshall DSL100H"}',
    'Ampeg SVT-350',
    'TAMA Starclassic',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd07faab7-64a0-4ed2-a467-f040d67f07c6',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b184b83d-7c3d-48a7-af04-aa4a390b7e03',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e8ac9ef2-344d-4452-a211-b77e787d3d9c',
    '{"Roland JC-120","Marshall JTM45"}',
    'Fender Bassman',
    'Canopus Yaiba',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '074a0ac1-4f2a-4ded-aeab-76b534f428d4',
    '{"Roland JC-120","VOX AC15"}',
    'Hartke HD150',
    'TAMA Club-JAM',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'fa7f37ad-c3a6-4c24-a1df-30561f9feab8',
    '{"Roland JC-120","Marshall JCM2000 DSL100","Hughes & Kettner TriAmp"}',
    'Ampeg SVT-4PRO + 810E',
    'Pearl Masters Premium',
    true,
    '{}',
    'ジュークハウスのフラッグシップ。抜けの良い音響設計。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9b229f1d-8168-4b09-ab53-b3a9a7dab44f',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Hartke HA3500 + 410XL',
    'TAMA Starclassic',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'dc811606-26a9-46ed-ae15-00cf144baf68',
    '{"Roland JC-120","Marshall DSL100H"}',
    'Ampeg SVT-350',
    'Pearl Session Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '11c252f1-c358-4500-a456-659ae2ac6e8a',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '75ea60c4-a804-48cf-ad81-652b91cff742',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6a30cce5-b0f1-47fb-a330-23fff513c9b1',
    '{"Roland JC-120","Fender Blues Junior"}',
    'Hartke HD150',
    'TAMA Club-JAM',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '31c5900d-5331-4f5c-a042-30dcd529ebc8',
    '{"Roland JC-120","VOX AC15"}',
    'Hartke HD150',
    'TAMA Club-JAM',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '0ace9d72-b6f4-428d-acc4-8090853878df',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-3PRO',
    'Pearl Masters Studio',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2818）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '7d4877c1-4b44-4876-a4e3-46d0688cb26c',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Hartke HA3500',
    'Pearl Session Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2818）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '39e2172b-04f1-44d7-a78e-5d4b53c2dfa9',
    '{"Roland JC-120","Marshall DSL100H"}',
    'Ampeg SVT-350',
    'TAMA Starclassic',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2818）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '129c3f86-4245-4392-a4f2-df6fb5cb4434',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2818）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '60c2a2cd-c13f-40a2-a463-43d8c5b6d543',
    '{"Roland JC-120","Fender Pro Junior"}',
    'Hartke HD150',
    'TAMA Club-JAM',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2818）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5f779fec-e93a-4568-a045-a610c1d19687',
    '{"Roland JC-120","VOX AC15"}',
    'Hartke HD150',
    'TAMA Club-JAM',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、リアルタイム空き確認・ご予約はお電話（03-3462-2818）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9c841b9e-dcd4-4346-a742-c42c6e5d4fe5',
    '{"Roland JC-120","Marshall JCM2000 DSL100","Mesa/Boogie Dual Rectifier"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'TAMA Starclassic Performer',
    true,
    '{}',
    'ペンタ新宿店1階の大型フラッグシップスタジオ。セルフレコ対応。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c0a04ff1-51c3-474f-a01b-e1dbdcfed810',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Ampeg SVT-350 + 410XL',
    'Pearl Masters Studio',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '56c4eafd-e586-4499-a92b-1f2c1f1d3d2e',
    '{"Roland JC-120","Marshall JVM210H"}',
    'Hartke HA3500 + 410XL',
    'Canopus Yaiba II',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e51686b1-ed5c-41ef-aa46-779fd3447f82',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Hartke HA3500',
    'Pearl Session Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'dacfb6b8-72c2-4012-ab64-bc6202f6ab17',
    '{"Roland JC-120","Marshall DSL100H"}',
    'Ampeg SVT-350',
    'TAMA Starclassic',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '4f29bafc-3c9a-4668-ae2a-d109091b411a',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Hartke HA3500',
    'Pearl Session Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd44d4a0e-1564-41bd-ab84-610477e76bd2',
    '{"Roland JC-120","Marshall DSL100H"}',
    'Ampeg SVT-350',
    'TAMA Starclassic',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b49d4732-cfe3-4f59-af7a-dcd95661a29a',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Hartke HA3500',
    'Pearl Session Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f9828fe0-2631-4327-a839-b23614c26b42',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'be77f115-e523-4175-ac26-b0b6dd6c2ba7',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '18ce79d2-a600-4794-a034-5ef0da3c6aa8',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e971c550-259c-4101-a238-377ca9900806',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '7e1158a2-aecc-4e28-a60b-62daf7433c3a',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f8c7b055-e820-4d52-ab20-5e11548308f7',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'cbe0e853-0cef-4060-ac6f-00abd1277301',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'ba37b319-9525-468e-a11d-6c1e50bedf2b',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '56125f05-a588-4289-a153-477a3c59a3bb',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '2e2b47a1-f4d2-4534-aaef-eb30ce58afc4',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '626796fb-c74a-42ed-a1c6-ec1e856640d0',
    '{"Roland JC-120","Marshall JVM210H","Fender Twin Reverb"}',
    'Ampeg SVT-4PRO',
    'Canopus Yaiba II',
    true,
    '{}',
    '5階の大型スタジオ。Fender Twin Reverb完備。セルフレコ対応。※土日祝日はリアルタイム空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '63f2c048-7266-4ced-a5cf-31cc5daf3251',
    '{"Roland JC-120","Marshall DSL100"}',
    'Ampeg SVT-350H + SVT-410HLF',
    'Pearl Standard Drum Set',
    true,
    '{}',
    'スタジオ音楽館 新宿西口店 標準高品位機材常設。全室00分スタート。個人練習は前日夜21時よりWeb受付。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8c1cd820-80e5-4cf0-a834-1a7d3ad27438',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-350H + SVT-410HLF',
    'Pearl Standard Drum Set',
    true,
    '{}',
    'スタジオ音楽館 新宿西口店 標準高品位機材常設。全室00分スタート。個人練習は前日夜21時よりWeb受付。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'df34deb4-2a88-409c-aa6e-0c87eb54c63a',
    '{"Roland JC-120","Marshall JCM2000 DSL100","Fender Twin Reverb"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'スタジオ音楽館 新宿西口店 標準高品位機材常設。全室00分スタート。個人練習は前日夜21時よりWeb受付。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '342165d6-2c35-44dd-a337-2ff2d460ebe8',
    '{"Roland JC-120","Marshall JVM210H","Fender Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Masters Custom',
    true,
    '{"Roland RD-88"}',
    'スタジオ音楽館 新宿西口店 標準高品位機材常設。全室00分スタート。個人練習は前日夜21時よりWeb受付。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '43d72d14-a694-4b55-abff-b051d504febb',
    '{"Roland JC-120","Marshall JVM410H","Fender 65 Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'スタジオ音楽館 新宿西口店 標準高品位機材常設。全室00分スタート。個人練習は前日夜21時よりWeb受付。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f7300908-7845-46d9-afae-9ce73612e1fe',
    '{"Roland JC-120","Marshall JVM410H","Fender Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'スタジオ音楽館 新宿西口店 標準高品位機材常設。全室00分スタート。個人練習は前日夜21時よりWeb受付。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '69203f06-eee5-41d9-aa4e-86a98a678bb7',
    '{"Roland JC-120","Marshall JVM410H","Hughes & Kettner"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{"Roland RD-88"}',
    'スタジオ音楽館 新宿西口店 標準高品位機材常設。全室00分スタート。個人練習は前日夜21時よりWeb受付。'
  ) ON CONFLICT (room_id) DO NOTHING;

END $$;
