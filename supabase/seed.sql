-- ==========================================
-- SoundSpot 本番シードデータ (実在33店舗・部屋マスター)
-- 都内3大エリア (渋谷・新宿・秋葉原) 公式マスター完全反映
-- Generated At: 2026-09-18T14:12:50.374Z
-- ==========================================

DO $$
BEGIN
  -- 既存データのクリーンアップ
  DELETE FROM availability_slots;
  DELETE FROM room_equipments;
  DELETE FROM rooms;
  DELETE FROM studios;

  -- 1. スタジオ店舗マスター (33店舗)
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
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'サウンドスタジオノア 秋葉原店',
    'SOUND STUDIO NOAH',
    '秋葉原',
    '東京都',
    '末広町駅 徒歩1分 / 秋葉原駅 徒歩6分',
    '東京都千代田区外神田6-14-8',
    '03-5816-8383',
    'https://www.studionoah.jp/akihabara/',
    '3ヶ月前の1日よりWEB予約可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
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
    '土日祝空き状況公開中 / 予約は電話にて受付',
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

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'サウンドスタジオノア 高田馬場店',
    'SOUND STUDIO NOAH',
    '高田馬場',
    '東京都',
    '高田馬場駅 徒歩3分',
    '東京都豊島区高田3-15-7',
    '03-3985-6761',
    'https://www.studionoah.jp/baba/',
    '3ヶ月前の1日よりWEB予約可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
    'https://www.studionoah.jp/baba/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    'ゲートウェイスタジオ 高田馬場3号店',
    'GATEWAY STUDIO',
    '高田馬場',
    '東京都',
    '高田馬場駅 徒歩3分',
    '東京都新宿区高田馬場1-28-6 和光ビルB棟',
    '03-3200-9997',
    'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=tlsccmeco&mn=3&gr=4',
    '3ヶ月前の同日よりWEB/電話にて予約可能',
    3,
    '前日のオープン（10:00）よりWEB/電話受付開始 (1名700円/h、2名1,100円/h)',
    24,
    'http://www.gw-studio.com/studios/studio_baba3rd/index'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '04e20b77-8376-447a-ab65-17a94338009d',
    'スタジオ音楽館 馬場駅前店',
    'スタジオ音楽館',
    '高田馬場',
    '東京都',
    '高田馬場駅 徒歩1分',
    '東京都新宿区高田馬場1丁目34-8大輝ビル地下1階',
    '03-6278-9288',
    'https://www.ajg.jp/shop/ReservationTop.php?id=Pnpa4ff1gt9m22p',
    'WEBにて予約受付可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
    'http://www.st-ongakukan.com/takadanobabaekimae/takadanobabaekimae.html'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '1bcbf9a7-fb8b-46d0-a2f7-4a100b8366db',
    'ベースオントップ 高田馬場店',
    'BASS ON TOP',
    '高田馬場',
    '東京都',
    '高田馬場駅 戸山口 徒歩1分',
    '東京都新宿区高田馬場1-33-14 サンフラワービル4F',
    '03-3203-9502',
    'https://studi-ol.com/shop/681',
    'WEBにて随時予約受付可能',
    3,
    '前日よりWEB/電話にて受付開始 (1〜2名700円/h)',
    24,
    'https://www.bassontop.co.jp/band/takadanobaba/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '2a666add-3363-4e02-a092-bf37c7e98cc9',
    'BAZOOKA STUDIO',
    'BAZOOKA STUDIO',
    '高田馬場',
    '東京都',
    '高田馬場駅 徒歩2分',
    '東京都新宿区高田馬場3-3-3 三優ビルB1F',
    '03-3360-3377',
    'https://bazookastudio.com/rehearsal/onlinereservation',
    '4ヶ月先まで予約可能（Web予約は事前会員登録制）',
    4,
    '前日10:00よりWeb/電話にて受付開始',
    24,
    'https://bazookastudio.com/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    'd64be2f3-e217-4b65-a665-3d6564048420',
    'サウンドスタジオノア 池袋店',
    'SOUND STUDIO NOAH',
    '池袋',
    '東京都',
    '池袋駅 徒歩5分',
    '東京都豊島区東池袋2-63-1',
    '03-5951-8400',
    'https://www.studionoah.jp/ikebukuro/',
    '3ヶ月前の1日よりWEB予約可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
    'https://www.studionoah.jp/ikebukuro/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    'ab7adc75-bb09-464d-a2ca-b66cc896e445',
    'ベースオントップ 池袋西口店',
    'BASS ON TOP',
    '池袋',
    '東京都',
    '池袋駅 西口 徒歩3分',
    '東京都豊島区西池袋1-10-1 ISOビルB1F',
    '03-5992-7720',
    'https://studi-ol.com/shop/2355',
    'WEBにて随時予約受付可能',
    3,
    '前日よりWEB/電話にて受付開始 (1名700円/h)',
    24,
    'https://www.bassontop.co.jp/band/ikebukuro-nishiguchi/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '55deb729-4bdf-4970-ad31-63704c10cd27',
    'スタジオペンタ池袋店',
    'STUDIO PENTA',
    '池袋',
    '東京都',
    'JR池袋駅 東口 徒歩5分',
    '東京都豊島区南池袋2-47-8',
    '03-3981-5540',
    'https://studiopenta.jp/rehearsal/ikebukuro/',
    '電話または店頭にて受付（オンライン予約非対応）',
    2,
    '前日営業開始（10:00）より電話にて受付開始',
    38,
    'https://studiopenta.jp/rehearsal/ikebukuro/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '627a2921-6850-4d58-a487-3790e8638110',
    'スタジオペンタ池袋ハンズサイド',
    'STUDIO PENTA',
    '池袋',
    '東京都',
    'JR池袋駅 東口 徒歩5分',
    '東京都豊島区東池袋1-26-4',
    '03-3981-4436',
    'https://studiopenta.jp/rehearsal/hands/',
    '電話・LINE・店頭にて受付（オンライン予約非対応）',
    2,
    '前日営業開始（10:00）より電話にて受付開始',
    38,
    'https://studiopenta.jp/rehearsal/hands/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '0ab8fe7c-85c8-4027-a6e5-9828e8ee6753',
    'Vivo Sound Studio',
    'Vivo Sound Studio',
    '池袋',
    '東京都',
    '池袋駅 西口 徒歩2分',
    '東京都豊島区池袋2-47-3 キウレイコンビルB1',
    '03-5391-3411',
    'https://vivo-studio.jp/',
    '電話・LINE・メールフォームにて受付（オンライン予約は要会員登録・非対応）',
    2,
    '電話・LINEにて随時受付',
    24,
    'https://vivo-studio.jp/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    'ゲートウェイスタジオ 池袋北口店',
    'GATEWAY STUDIO',
    '池袋',
    '東京都',
    '池袋駅 北口 徒歩2分',
    '東京都豊島区西池袋1-43-7 福住ビル5F・6F',
    '03-5396-1119',
    'https://www.reserve1.jp/studio/member/VisitorLogin.php?lc=tlsccmeco&mn=3&gr=1',
    '2ヶ月前よりWEB/電話にて予約可能',
    2,
    '前日のオープン（10:00）よりWEB/電話受付開始 (1名700円/h、2名1,100円/h)',
    24,
    'https://www.gw-studio.com/studios/studio_iken/index'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'サウンドスタジオノア 下北沢店',
    'SOUND STUDIO NOAH',
    '下北沢',
    '東京都',
    '下北沢駅 徒歩5分',
    '東京都世田谷区北沢3-20-17',
    '03-3466-0058',
    'https://www.studionoah.jp/shimokita/',
    '3ヶ月前の1日よりWEB予約可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
    'https://www.studionoah.jp/shimokita/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '197b9abc-d04e-497f-ac8e-56506f803820',
    'ANDY''S STUDIO',
    'ANDY''S STUDIO',
    '下北沢',
    '東京都',
    '下北沢駅 徒歩5分',
    '東京都世田谷区代沢5-29-15 SYビル2F',
    '03-5432-3805',
    'https://studi-ol.com/shop/587',
    'WEBにて随時予約受付可能',
    3,
    '個人練習はWEB予約不可・当日お電話のみ',
    24,
    'http://www.andys.jp/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '981ba110-6088-4e76-a751-4b967908fcee',
    'STANDBY MUSIC STUDIO',
    'STANDBY MUSIC STUDIO',
    '下北沢',
    '東京都',
    '下北沢駅 徒歩1分',
    '東京都世田谷区北沢2丁目12-10 SSビル1階',
    '03-5481-7433',
    'https://studi-ol.com/shop/767',
    'WEBにて随時予約受付可能',
    3,
    '前日21:00よりWEB/電話にて受付開始',
    27,
    'https://standby-studio.com/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '5d10f671-c987-445c-ac32-255be8447757',
    'ガードアイランドスタジオ 下北沢ウエスト店',
    'Gourdisland Studio',
    '下北沢',
    '東京都',
    '下北沢駅 西口 徒歩0分',
    '東京都世田谷区北沢2-23-10',
    '03-5430-3334',
    'https://studi-ol.com/shop/539',
    'WEBにて随時予約受付可能',
    3,
    '前日10:00よりWEB/電話にて受付開始',
    14,
    'http://gourdisland-music.jp/shimokitawest/'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
  VALUES (
    '2b19aa48-0aa9-4107-a69e-5587d0ab58a6',
    'ガードアイランドスタジオ 下北沢南口店',
    'Gourdisland Studio',
    '下北沢',
    '東京都',
    '下北沢駅 徒歩2分',
    '東京都世田谷区北沢2-13-6 3F',
    '03-3414-9833',
    'https://studi-ol.com/shop/591',
    'WEBにて随時予約受付可能',
    3,
    '前日10:00よりWEB/電話にて受付開始',
    14,
    'http://gourdisland-music.jp/shimokitazawa/'
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. 部屋マスター (330部屋)
  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '712a2eb2-2c0e-4a6c-ac92-7be381e080c2',
    'd5bbbdd3-34f8-4496-a964-4ae6df2de8f4',
    '1st (17帖)',
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
    14,
    6,
    3080,
    2530,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '45648a63-b781-4d06-a439-72b13663f3b7',
    'fbea3867-f708-406e-a267-f0f5e3a5eca1',
    '306st (8帖)',
    '',
    8,
    5,
    2420,
    1980,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '61a61365-429d-41c5-aa89-02e9324ef527',
    'aa891b1f-d51f-4800-a73c-a4082becad19',
    'Aスタジオ (6帖)',
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
    50,
    30,
    10640,
    7700,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '37004b0a-c16e-472f-a623-b12b6422d05f',
    '73fef806-5c35-4b06-a41b-e0b22c47d973',
    '1st (15帖)',
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '',
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
    '7d0f2e6f-dc50-437f-aec2-7621abb86272',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'A1st (7帖)',
    'B1F-4F',
    7,
    3,
    2970,
    1760,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '254e17bd-0fa0-4b36-abab-7c1c1495c291',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'A2st (7帖)',
    'B1F-4F',
    7,
    3,
    2970,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e96c8ac9-232a-4aac-a038-0f603861b3de',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'B1st (16帖)',
    'B1F-4F',
    16,
    7,
    4290,
    2970,
    990,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8425f42e-1ce8-402a-a94e-4ebcebc586fd',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'B2st (15帖)',
    'B1F-4F',
    15,
    6,
    4070,
    2750,
    990,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '0149a7b4-d635-4dee-acba-2d8af5d9e919',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'B3st (15帖)',
    'B1F-4F',
    15,
    6,
    4070,
    2750,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '66903210-c071-41f9-ab2a-502ae2fac96e',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'B4st (14帖)',
    'B1F-4F',
    14,
    6,
    3960,
    2640,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd2898a5c-b9b3-4b07-a9e9-74e333b4361c',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'Cst (27帖)',
    'B1F-4F',
    27,
    10,
    5500,
    3850,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'da60b5c8-6d96-4097-af3d-960d6e22a1ad',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'G1st (12帖)',
    'B1F-4F',
    12,
    5,
    3410,
    2310,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e424232e-5239-43fd-abb1-71e757450360',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'G2st (10帖)',
    'B1F-4F',
    10,
    4,
    3300,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a2820c89-889b-45b3-af28-068e58c5d9f3',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'G3st (11帖)',
    'B1F-4F',
    11,
    5,
    3300,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd0030609-378e-4f04-a7aa-866248f8e7ad',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'Sst (6帖)',
    'B1F-4F',
    6,
    2,
    2750,
    1540,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b2b11b70-d643-4e1a-a024-42626ee6c1a4',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'DJ Booth1 (4帖)',
    'B1F-4F',
    4,
    2,
    1870,
    1870,
    1870,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b8b6fbd2-7b90-487a-aac9-1e27554f0cc7',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'Booth2 (4.5帖)',
    'B1F-4F',
    5,
    2,
    770,
    770,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '5eb85076-fa63-436d-ad2c-44331dbb00ab',
    'edf663f7-6e46-46f2-a44a-d6b28cc68c6a',
    'REC STUDIO (4.5帖)',
    'B1F-4F',
    5,
    2,
    2310,
    1870,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b0606ba9-a0a6-4293-a1b4-1439f89995d0',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'A1st (9帖)',
    'B1F-4F',
    9,
    4,
    2860,
    1650,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6213987c-af79-4dc6-af31-953d3c2eae59',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'A2st (10帖)',
    'B1F-4F',
    10,
    4,
    2970,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9a870c6a-d15a-4d38-a048-c02f64c6b3ac',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'A3st (8帖)',
    'B1F-4F',
    8,
    3,
    2750,
    1540,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'fd1535e3-e1fd-410a-ac89-387a36452a5c',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'A5st (10帖)',
    'B1F-4F',
    10,
    4,
    2970,
    1760,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b1b739c4-c3d1-4a5e-a16f-6a7c95b761f9',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'B1st (12帖)',
    'B1F-4F',
    12,
    5,
    3300,
    2090,
    880,
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
    3300,
    2090,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9292692b-63fb-4a07-aa76-b3abd080afa0',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'B3st (14帖)',
    'B1F-4F',
    14,
    6,
    3520,
    2310,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e5f1a378-f589-4a23-abbe-c2312506a404',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'B5st (11帖)',
    'B1F-4F',
    11,
    5,
    3300,
    1980,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '3234cb26-8d2a-458f-af77-fc01c5ad7640',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'E1st (16帖)',
    'B1F-4F',
    16,
    7,
    3850,
    2530,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '45ce0638-8a6e-4490-a8e5-efe73d71de94',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'E2st+Sub (17帖)',
    'B1F-4F',
    17,
    7,
    3960,
    2750,
    990,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '50ca3504-77e5-4f90-a91d-4ef30b1891ef',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'Vo.Booth (3帖)',
    'B1F-4F',
    3,
    2,
    770,
    770,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '3eda195a-3536-43e4-a4a1-baf53978538c',
    '77470cad-194b-4203-ad8d-ed00d3959820',
    'R/P STUDIO (6帖)',
    'B1F-4F',
    6,
    2,
    2420,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1c06ae8b-d763-4c30-acd8-14e1a23db13f',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'Sst (7帖)',
    'B1F-4F',
    7,
    3,
    2530,
    1650,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f19dd1d5-fcc5-4dae-ab11-b53dfa24b413',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'A1st (8帖)',
    'B1F-4F',
    8,
    3,
    2860,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '686c9882-4f6d-4cb2-a90e-ed30de33c322',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'A2st (8帖)',
    'B1F-4F',
    8,
    3,
    2860,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1595267d-dc24-451b-a420-c559a74807f9',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'A3st (8帖)',
    'B1F-4F',
    8,
    3,
    2860,
    1760,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '23c6e4c0-2570-4e2e-a714-9339a664351c',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'G1st (10帖)',
    'B1F-4F',
    10,
    4,
    3190,
    2090,
    880,
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
    3190,
    2090,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '968c2952-f674-4855-acee-6a24d982ea77',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'G3st (11帖)',
    'B1F-4F',
    11,
    5,
    3300,
    2200,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'fb4f53e8-ca1b-4da4-a6b6-226934bbfcce',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'B1st (13帖)',
    'B1F-4F',
    13,
    5,
    3740,
    2530,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '923d95f7-eb66-4c3c-a5dc-e19bfd30d355',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'B2st (14帖)',
    'B1F-4F',
    14,
    6,
    3850,
    2640,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'dae16e59-070c-46c6-a4ce-424acd42c722',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'B3st (14帖)',
    'B1F-4F',
    14,
    6,
    3850,
    2640,
    990,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '0bcc7d80-1a57-4982-ab67-c65a82ecc2d6',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'E1st (16帖)',
    'B1F-4F',
    16,
    7,
    4180,
    2860,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8364d67d-6de8-4c1b-a70d-9d6e89bef490',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'E2st (16帖)',
    'B1F-4F',
    16,
    7,
    4180,
    2860,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '94354240-95e7-46e7-a3aa-b9e89906cec2',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'Cst (22帖)',
    'B1F-4F',
    22,
    10,
    5060,
    3520,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'da2435c5-6c82-4b1a-a3fc-844f4411b222',
    '6629e62e-92db-432c-abe8-fc561094ed83',
    'Vo.Booth (3帖)',
    'B1F-4F',
    3,
    2,
    770,
    770,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6fc0c3f6-e13b-40da-ad6f-e1cdc5bfa0cc',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'A1st (8帖)',
    'B1F-4F',
    8,
    3,
    2970,
    1760,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '05bcdee6-c576-4178-ad69-ad489206f105',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'A2st (8帖)',
    'B1F-4F',
    8,
    3,
    2970,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '65a89f10-6570-4946-a763-4a0786313ae0',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'A3st (8帖)',
    'B1F-4F',
    8,
    3,
    2970,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9251ac9c-22e3-42f8-ad8f-20ee6e2baf64',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'A4st (8帖)',
    'B1F-4F',
    8,
    3,
    2970,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd38aaabb-ddc3-4ddb-afc2-e22947cc7aab',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'Cst (22帖)',
    'B1F-4F',
    22,
    10,
    5280,
    3740,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f037846b-f9bf-402e-adef-52b53259d265',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'Est (15帖)',
    'B1F-4F',
    15,
    6,
    3960,
    2640,
    990,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c1b260d5-e440-4f20-a2d7-06c9c1600e49',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'DJ1st (3.5帖)',
    'B1F-4F',
    4,
    2,
    1980,
    1980,
    1980,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'faecd22f-6a76-4513-a4b6-f81c191b237f',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'DJ2st (3.5帖)',
    'B1F-4F',
    4,
    2,
    1980,
    1980,
    1980,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e0d4de61-dcda-4638-a0fa-d6eab179084a',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'DJ3st (8帖)',
    'B1F-4F',
    8,
    3,
    3630,
    2860,
    2200,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '573b9772-4b4a-420b-aa84-fe0c52b11a05',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'Booth1 (3.5帖)',
    'B1F-4F',
    4,
    2,
    880,
    880,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '43ec5944-f044-4be7-a746-146d806677be',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'Booth2 (3.5帖)',
    'B1F-4F',
    4,
    2,
    880,
    880,
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
    880,
    880,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a74efd97-b868-4eb6-a4dc-663637e70ad5',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'Booth4 (3.5帖)',
    'B1F-4F',
    4,
    2,
    880,
    880,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd768deaf-a1ca-46e5-ac30-45d73b277fcc',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'Rec.booth (4帖)',
    'B1F-4F',
    4,
    2,
    2310,
    1870,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd6280852-4816-4a0e-a5a0-762ce8eafd3a',
    '8305bf22-0927-4678-ace9-58be7dbbf602',
    'REC STUDIO (11帖)',
    'B1F-4F',
    11,
    5,
    2640,
    2200,
    1650,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6533019b-fd2b-4d8a-aebd-b56ab224e6c9',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'S1st (7帖)',
    'B1F-4F',
    7,
    3,
    2640,
    1870,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '54b0db7f-be43-4ec5-a5ba-ef2af688e6e4',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'S2st (7帖)',
    'B1F-4F',
    7,
    3,
    2530,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '22555425-4419-4377-a622-18ee665619b0',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'S3st (7帖)',
    'B1F-4F',
    7,
    3,
    2530,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '3980a7b0-3b56-4f66-a67c-ee7178704557',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'A1st (9帖)',
    'B1F-4F',
    9,
    4,
    3080,
    1980,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'ab6343c8-63ac-4a91-a14f-fc13000d7787',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'A2st (10帖)',
    'B1F-4F',
    10,
    4,
    3190,
    2090,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '2ba2719c-85f6-4f57-a7e2-0186912d1e72',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'A3st (10帖)',
    'B1F-4F',
    10,
    4,
    3190,
    2090,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '4561b432-5fed-410e-ad62-66975be1d700',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'A5st (10帖)',
    'B1F-4F',
    10,
    4,
    3190,
    2090,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '020848cf-8bc0-4949-a864-136f7c0c8958',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'A6st (9帖)',
    'B1F-4F',
    9,
    4,
    3080,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '21728d58-0a2f-4098-a168-3399f7df950e',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'A7st (9帖)',
    'B1F-4F',
    9,
    4,
    3080,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '15eb1f23-6c10-4f75-ae71-7b6fd2c73b70',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'G1st (11帖)',
    'B1F-4F',
    11,
    5,
    3300,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6d150cc0-3fbd-4758-a9db-f841ecbd0a6f',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'G2st (11帖)',
    'B1F-4F',
    11,
    5,
    3300,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '66c3c1b7-23d8-4ebd-a2e3-73eadbbaefb1',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'G3st (11帖)',
    'B1F-4F',
    11,
    5,
    3300,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6f48a19d-ea14-4ecf-a6b2-8a53e52b1a57',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'B1st (12帖)',
    'B1F-4F',
    12,
    5,
    3520,
    2310,
    990,
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
    3520,
    2310,
    990,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a7e05898-4164-4676-ab35-f1e025b787dd',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'B3st (13帖)',
    'B1F-4F',
    13,
    5,
    3630,
    2420,
    990,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '59dfe699-342c-4134-a593-e6d1b1746667',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'E1st (18帖)',
    'B1F-4F',
    18,
    8,
    4510,
    3300,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '3305287e-91a8-404e-af5f-cc780dd476b8',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'E2st (15帖)',
    'B1F-4F',
    15,
    6,
    4070,
    2860,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1cb23559-e4ba-4ffe-a3d4-77bfa3df9d35',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'E3st (16帖)',
    'B1F-4F',
    16,
    7,
    4180,
    2970,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '139685cd-4f49-408c-ac1e-a792c7ac4eda',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'CSst+Sub (30帖)',
    'B1F-4F',
    30,
    10,
    6380,
    4400,
    1320,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f569322e-230e-40a6-af4a-8558fe281de8',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'Fst (14帖)',
    'B1F-4F',
    14,
    6,
    3960,
    2750,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1b7ca359-8081-412d-a8e0-9d5723ac3b9c',
    '3f69a610-bb51-4607-ada3-72de92ee2c33',
    'REC STUDIO (6帖)',
    'B1F-4F',
    6,
    2,
    2200,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '85224de3-98a2-43e7-a1b3-ae7119dd9565',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'A1st (8帖)',
    'B1F-4F',
    8,
    3,
    2970,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '491a3591-821c-446f-a500-4530309a49e4',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'A2st (8帖)',
    'B1F-4F',
    8,
    3,
    2970,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '0934ca19-30e4-4dcf-ae96-9156af433141',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'A3st (9帖)',
    'B1F-4F',
    9,
    4,
    3080,
    1870,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8e7b899c-8131-4585-a4f4-2cc978999701',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'G1st (12帖)',
    'B1F-4F',
    12,
    5,
    3410,
    2310,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9cc060a8-c688-40c7-ac55-875f83532f5a',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'G2st (9.5帖)',
    'B1F-4F',
    10,
    4,
    3190,
    1980,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c25faf74-4481-414b-ad48-e8e28957775a',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'GSst (10帖)',
    'B1F-4F',
    10,
    4,
    3190,
    2090,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '2050b4cd-ac53-4a73-ae44-1e938eb4f771',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'REC.booth (5帖)',
    'B1F-4F',
    5,
    2,
    1650,
    1430,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '61408f39-68ef-499d-a19b-040bba32b3ee',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'B1st (14帖)',
    'B1F-4F',
    14,
    6,
    3850,
    2640,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '43614990-1111-43b9-a6b2-59e3abc32259',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'B2st (13帖)',
    'B1F-4F',
    13,
    5,
    3740,
    2530,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd34b0dc8-2fd8-4e06-a199-dfe00605d145',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'E1st (21帖)',
    'B1F-4F',
    21,
    9,
    4510,
    3300,
    990,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '027254a9-94a6-4958-a18f-816257f362e1',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'E2st (20帖)',
    'B1F-4F',
    20,
    9,
    4510,
    3300,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '5d5bba86-7db2-49df-add9-f27f222d7e8e',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'Cst+Sub (24帖)',
    'B1F-4F',
    24,
    10,
    5720,
    4070,
    1210,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b1a5bbb0-9ba2-4e67-afad-d8fdf0d02c70',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'Booth1 (3帖)',
    'B1F-4F',
    3,
    2,
    770,
    770,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b04149a9-81aa-48f4-aa13-b04959c9d204',
    'c75e1f38-0849-4ac7-a21c-d15c50fca4e8',
    'Booth2 (3帖)',
    'B1F-4F',
    3,
    2,
    770,
    770,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd236c685-eb13-4bf0-a2e7-f20a8fcddcc8',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'Booth (4帖)',
    'B1F-4F',
    4,
    2,
    880,
    880,
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
    2970,
    1870,
    770,
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
    2970,
    1870,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'ce717ec8-2b6b-4dff-a718-6a992b502c72',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'A3st (8.5帖)',
    'B1F-4F',
    9,
    4,
    2970,
    1870,
    770,
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
    2970,
    1870,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8013d52f-98a6-492a-a6ee-f4d9d33cc743',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'Gst (12帖)',
    'B1F-4F',
    12,
    5,
    3300,
    2200,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '892cfbe1-78aa-40e5-a7e1-4d81463adffc',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'Cst (18帖)',
    'B1F-4F',
    18,
    8,
    4620,
    3300,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c31796b9-7051-4051-ab84-92ca2a943e1b',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'B1st (13帖)',
    'B1F-4F',
    13,
    5,
    3740,
    2640,
    880,
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
    3850,
    2750,
    880,
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
    3850,
    2750,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'eed1ebb1-d6d4-4ea5-a4b2-2a4dca51806d',
    'e1a6b4be-8b25-4d58-a4bb-ac1bc55fd0a8',
    'Est (15帖)',
    'B1F-4F',
    15,
    6,
    4070,
    2860,
    990,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c9329040-3a56-4be7-a706-401198191263',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'A1st (8帖)',
    'B1F-4F',
    8,
    3,
    2860,
    1650,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '27b47830-c2d3-47f1-a194-c1bb0af2a278',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'A2st (9帖)',
    'B1F-4F',
    9,
    4,
    2970,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '39083a4e-f1b3-46b8-ac98-620927b73e3c',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'A3st (8帖)',
    'B1F-4F',
    8,
    3,
    2860,
    1650,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '0ff7b000-9569-46a6-ab3d-66c0f31e5e22',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'A5st (8帖)',
    'B1F-4F',
    8,
    3,
    2860,
    1650,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '427a8f19-0e81-4d25-a44d-c6641acd5a27',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'G1st (11帖)',
    'B1F-4F',
    11,
    5,
    3190,
    1870,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '56177a6b-26e3-4ac9-ab5d-116b54d6d972',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'G2st (11帖)',
    'B1F-4F',
    11,
    5,
    3190,
    1870,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e9f0e651-003c-4174-a53a-6faf6be1865e',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'B1st (14帖)',
    'B1F-4F',
    14,
    6,
    3520,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '80b00fec-f3aa-4d13-a9bf-da941b9f94f0',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'B2st (14帖)',
    'B1F-4F',
    14,
    6,
    3520,
    2200,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a08f8b67-2fc0-44fb-a81e-7ce8c838a6f5',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'B3st (14帖)',
    'B1F-4F',
    14,
    6,
    3520,
    2200,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'cdfb34bd-4679-464b-a375-6f96130f4bc4',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'Est (17帖)',
    'B1F-4F',
    17,
    7,
    3850,
    2750,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '578b98ab-ad14-46cd-acb6-76ffb655f485',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'Fst (21帖)',
    'B1F-4F',
    21,
    9,
    4290,
    3080,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'cf3fc751-27dc-4955-a570-d0650b4e4005',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'Cst+Sub (30帖+5帖)',
    'B1F-4F',
    30,
    10,
    5940,
    4180,
    1100,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '618cad0f-df5c-4d1f-ac40-844873ed3f12',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'Booth.1 (3帖)',
    'B1F-4F',
    3,
    2,
    770,
    770,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '2fca8dc8-eaed-489c-a99c-47e450734539',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'Booth.2 (4帖)',
    'B1F-4F',
    4,
    2,
    770,
    770,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'fe813993-d7ee-4e35-a786-6b5c08bf8907',
    'ab9ee9bd-f80a-4861-a1fa-7c94a4053015',
    'REC.Booth (5帖)',
    'B1F-4F',
    5,
    2,
    1760,
    1540,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8448ad49-1f4a-4178-a274-6f3a110971f0',
    'd64be2f3-e217-4b65-a665-3d6564048420',
    'Sst (6.5帖)',
    'B1F-4F',
    6.5,
    2,
    2300,
    1500,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1c336c18-6af8-406f-ae4e-1e785b1f97ba',
    'd64be2f3-e217-4b65-a665-3d6564048420',
    'A1st (8帖)',
    'B1F-4F',
    8,
    3,
    2600,
    1600,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a3f97fdc-11fe-4b69-adca-8e76596279a1',
    'd64be2f3-e217-4b65-a665-3d6564048420',
    'A2st (8帖)',
    'B1F-4F',
    8,
    3,
    2600,
    1600,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '10bd7c18-8b72-40aa-a559-7be70de17e31',
    'd64be2f3-e217-4b65-a665-3d6564048420',
    'A3st (8帖)',
    'B1F-4F',
    8,
    3,
    2600,
    1600,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '7b045186-366e-4e8a-a616-8ac01a4103b8',
    'd64be2f3-e217-4b65-a665-3d6564048420',
    'A5st (10帖)',
    'B1F-4F',
    10,
    4,
    2800,
    1700,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a86292a8-fc4a-4692-af29-36838d234e6d',
    'd64be2f3-e217-4b65-a665-3d6564048420',
    'B1st (14帖)',
    'B1F-4F',
    14,
    6,
    3300,
    2200,
    800,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '5750bb49-3927-457c-ab30-b36bad552427',
    'd64be2f3-e217-4b65-a665-3d6564048420',
    'B2st (13帖)',
    'B1F-4F',
    13,
    5,
    3200,
    2100,
    800,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c9f2fdc0-205c-4954-a43e-dc2f8bee6e26',
    'd64be2f3-e217-4b65-a665-3d6564048420',
    'E1st+Sub (20帖)',
    'B1F-4F',
    20,
    9,
    4600,
    3200,
    900,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8c901c30-5b46-4393-aeb6-07a0d2c172e8',
    'd64be2f3-e217-4b65-a665-3d6564048420',
    'E2st+Sub (16帖)',
    'B1F-4F',
    16,
    7,
    3700,
    2600,
    900,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'dd8daabe-3f50-4085-a549-31249cd6a2c8',
    'd64be2f3-e217-4b65-a665-3d6564048420',
    'Booth1 (3帖)',
    'B1F-4F',
    3,
    2,
    700,
    700,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '69dbd431-72cf-45c3-af41-b2fa33e94e60',
    'd64be2f3-e217-4b65-a665-3d6564048420',
    'Booth2 (2.5帖)',
    'B1F-4F',
    2.5,
    2,
    700,
    700,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'dea9e851-9001-42be-a2e5-ef29e7352d74',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'A1st (6帖)',
    'B1F-4F',
    6,
    2,
    2310,
    1650,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f70a5622-c863-4024-a1e5-250a6e94ffb9',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'A2st (8帖)',
    'B1F-4F',
    8,
    3,
    2530,
    1650,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '976cbfbc-60a9-4cce-a84c-08a1bbe68ff6',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'A3st (8帖)',
    'B1F-4F',
    8,
    3,
    2530,
    1650,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'fde4722e-8d30-4bfe-a1ee-ae9a6b868f24',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'G2st (10帖)',
    'B1F-4F',
    10,
    4,
    2750,
    1760,
    770,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f68dec63-4742-4092-a57f-e584595fadd1',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'G3st (12帖)',
    'B1F-4F',
    12,
    5,
    2970,
    1980,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '5691b9bf-5600-4350-aecd-e9022f5bb97c',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'B1st (15帖)',
    'B1F-4F',
    15,
    6,
    3740,
    2640,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1c345b6e-fabd-4e5d-a270-8c073857eb4e',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'B2st (15帖)',
    'B1F-4F',
    15,
    6,
    3520,
    2420,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a7642520-c1db-4c21-ab82-94e365e2d976',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'B3st (13帖)',
    'B1F-4F',
    13,
    5,
    3190,
    2200,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a885797c-8ad1-4574-a67d-7a136f5d1f7e',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'Est (17帖)',
    'B1F-4F',
    17,
    7,
    3960,
    2970,
    990,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '722c8096-761a-4ca5-aeb2-0016703b0353',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'REC.STUDIO (6帖)',
    'B1F-4F',
    6,
    2,
    2090,
    1980,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '06b1ec8e-ba16-46e7-a239-c9641b4e73e9',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'B4st (14帖)',
    'B1F-4F',
    14,
    6,
    3630,
    2530,
    880,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '38e20cf7-d5d1-4266-a922-a2c54a493719',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'Cst (24帖)',
    'B1F-4F',
    24,
    10,
    5170,
    3630,
    1100,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'adef2ce1-ab3c-45c5-aca8-1058cf82affa',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'B5st (16帖)',
    'B1F-4F',
    16,
    7,
    3850,
    2750,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'dbe12edd-c4d8-4683-a9ba-d9cba91f4c70',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'A4st (8.5帖)',
    'B1F-4F',
    9,
    4,
    2750,
    1760,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e5df97d4-4f1e-4c03-a064-4bc6b0592be2',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'A5st (7.5帖)',
    'B1F-4F',
    8,
    3,
    2640,
    1650,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '2571c031-7756-4e45-ab99-b5a054fb0e5c',
    '4d725f38-16c8-4bc1-a290-6fc6aa893279',
    'A6st (8帖)',
    'B1F-4F',
    8,
    3,
    2750,
    1760,
    770,
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
    '891be1b4-b586-44ac-aa55-ca8d032a4d4d',
    '55deb729-4bdf-4970-ad31-63704c10cd27',
    '1st SMALL (9帖)',
    'B1F',
    9,
    4,
    2500,
    1700,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '780a0afe-81de-4056-ae0d-04780e70adc3',
    '55deb729-4bdf-4970-ad31-63704c10cd27',
    '2st SMALL (9帖)',
    'B1F',
    9,
    4,
    2500,
    1700,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '07e3c14a-f2fb-4af5-ad82-a2dd07bbf1b2',
    '55deb729-4bdf-4970-ad31-63704c10cd27',
    '3st LARGE (12帖)',
    'B1F',
    12,
    5,
    2650,
    1900,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '48f03499-7a3c-474c-a2b6-83c11999aa6a',
    '55deb729-4bdf-4970-ad31-63704c10cd27',
    '4st LARGE (12帖)',
    'B1F',
    12,
    5,
    2650,
    1900,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e3a8f578-8bad-40bc-ab54-4b3c023cb186',
    '55deb729-4bdf-4970-ad31-63704c10cd27',
    '5st LARGE (12帖)',
    'B1F',
    12,
    5,
    2650,
    1900,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '7255fe72-7a00-4634-ac5f-269fb13b64c6',
    '627a2921-6850-4d58-a487-3790e8638110',
    '#1 SMALL (11帖)',
    'B1F',
    11,
    5,
    2420,
    1650,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '2d150912-4661-46d6-afd3-b86d7416b979',
    '627a2921-6850-4d58-a487-3790e8638110',
    '#2 LARGE (20帖)',
    'B1F',
    20,
    8,
    3630,
    2750,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f2998e41-1fff-4e78-a5fc-667502b8fb92',
    '627a2921-6850-4d58-a487-3790e8638110',
    '#3 MEDIUM (14帖)',
    'B1F',
    14,
    6,
    2750,
    2090,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '458301e3-47c8-40d2-a5d5-e3a7fd149b31',
    '627a2921-6850-4d58-a487-3790e8638110',
    '#4 MEDIUM (14帖)',
    'B1F',
    14,
    6,
    2750,
    2090,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '88e64e2b-dba7-4255-a0db-16fe77a277a4',
    '627a2921-6850-4d58-a487-3790e8638110',
    '#5 MEDIUM (14帖)',
    'B1F',
    14,
    6,
    2750,
    2090,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8ac9bf93-4e29-4179-ad29-1286da87de87',
    '627a2921-6850-4d58-a487-3790e8638110',
    '#6 SMALL (11帖)',
    'B1F',
    11,
    5,
    2420,
    1650,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f0c04919-448b-4bdc-a8be-2a9ba9815755',
    '627a2921-6850-4d58-a487-3790e8638110',
    '#7 MEDIUM Plus (15帖)',
    'B1F',
    15,
    6,
    3190,
    2420,
    880,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '7aed46d0-53ab-42f4-ab61-b51d76577195',
    '627a2921-6850-4d58-a487-3790e8638110',
    '#8 MEDIUM (14帖)',
    'B1F',
    14,
    6,
    2750,
    2090,
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

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '441a66c2-22bf-4f6b-a773-cd5c6075616e',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '2B (10帖)',
    '',
    10,
    5,
    2530,
    1375,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1fd6e83f-c063-4e60-ae4c-0eabeb8216cc',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '2D (14帖)',
    '',
    14,
    7,
    2860,
    1870,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd2d9448d-2151-451c-a09d-16f3b4c2e01d',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '3B (10帖)',
    '',
    10,
    5,
    2530,
    1375,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd798daf8-81a9-4916-ad1b-4ce64be3a149',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '3D (14帖)',
    '',
    14,
    7,
    2860,
    1870,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f9e60039-90fe-45b9-a2f8-e29f635de867',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '2A (12帖)',
    '',
    12,
    6,
    2750,
    1650,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'ff907a5e-1a43-4fd4-a6f4-08a3d90a9693',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '2C (10帖)',
    '',
    10,
    5,
    2530,
    1375,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '97cf33d3-ab0d-47e6-a5bb-c4c8909fb0cb',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '3A (12帖)',
    '',
    12,
    6,
    2750,
    1650,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '22c74358-17d1-4e9e-a387-764a09d3ee45',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '3C (10帖)',
    '',
    10,
    5,
    2530,
    1375,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6e309a3a-bbde-497c-a464-8bafa97082d1',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '1A (12帖)',
    '',
    12,
    6,
    2750,
    1650,
    700,
    15
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9d396b46-3ad8-4d20-a22e-7a100ee9ba73',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '4A (16帖)',
    '',
    16,
    8,
    2970,
    2090,
    700,
    15
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'eac29b9b-5dea-405e-a063-896701c3f4c3',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '4C (16帖)',
    '',
    16,
    8,
    2970,
    2090,
    700,
    15
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '427b52b3-e851-4b10-a93b-d117b357ba8b',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '5B (16帖・ダンス兼用)',
    '',
    16,
    8,
    2970,
    2090,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b5455e2a-6258-4d06-a190-9586f9718a54',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '4B (16帖)',
    '',
    16,
    8,
    2970,
    2090,
    700,
    45
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'df1b85d0-89a3-41ff-a814-d836432af031',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '5A (16帖)',
    '',
    16,
    8,
    2970,
    2090,
    700,
    45
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1e75e474-5fbe-49f4-a46b-d789dd9b6ee4',
    '8bafb28e-bb18-4a96-a0ef-5cef1e937e21',
    '5C (16帖・ツインドラム)',
    '',
    16,
    8,
    2970,
    2090,
    700,
    45
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '4d407ed2-b5bc-42d1-a4f4-e44665bf4bfe',
    '04e20b77-8376-447a-ab65-17a94338009d',
    'Break (7帖)',
    'B1F',
    7,
    3,
    2860,
    1760,
    790,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c6f4565f-959e-4ea7-a70a-c6d1b2e853ca',
    '04e20b77-8376-447a-ab65-17a94338009d',
    'Conect (7帖・30分スタート)',
    'B1F',
    7,
    3,
    2860,
    1760,
    790,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c626c4f3-1707-490b-a39b-f9b52c2e947c',
    '04e20b77-8376-447a-ab65-17a94338009d',
    'Digi (11帖)',
    'B1F',
    11,
    5,
    3560,
    2360,
    790,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '042a11ed-d19d-4fd0-a254-555252748d3a',
    '04e20b77-8376-447a-ab65-17a94338009d',
    'Elegy (13帖)',
    'B1F',
    13,
    6,
    3930,
    2640,
    790,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '2dda6640-d4a3-4ccb-ae98-26a2022a0064',
    '04e20b77-8376-447a-ab65-17a94338009d',
    'Flash (14帖)',
    'B1F',
    14,
    7,
    4180,
    2860,
    790,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9c6b8ef9-791b-4554-ace2-4aa1d43bad19',
    '04e20b77-8376-447a-ab65-17a94338009d',
    'Grosso (15帖)',
    'B1F',
    15,
    8,
    4400,
    3080,
    790,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'ba9a8722-ff0c-4953-aa4a-3dcfadadb19d',
    '1bcbf9a7-fb8b-46d0-a2f7-4a100b8366db',
    '501 (11帖)',
    '4F',
    11,
    5,
    3100,
    2300,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '67a4fdba-fbac-4767-a4d1-57e10bf79b85',
    '1bcbf9a7-fb8b-46d0-a2f7-4a100b8366db',
    '502 (11帖)',
    '4F',
    11,
    5,
    3100,
    2300,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '4ae8aca7-31c1-4810-a900-a646a7a20659',
    '1bcbf9a7-fb8b-46d0-a2f7-4a100b8366db',
    '503 (11帖)',
    '4F',
    11,
    5,
    3100,
    2300,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '3aa411be-16f2-4ed2-aea6-6f33ebbd46d0',
    '1bcbf9a7-fb8b-46d0-a2f7-4a100b8366db',
    '504 (11帖)',
    '4F',
    11,
    5,
    3100,
    2300,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9dd1bf39-f6c2-4437-a588-dfffcecb8a6b',
    '1bcbf9a7-fb8b-46d0-a2f7-4a100b8366db',
    '505 (15帖)',
    '4F',
    15,
    6,
    3500,
    2800,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '8bde340d-0c3d-41c2-ae21-f0aeafeff14e',
    '1bcbf9a7-fb8b-46d0-a2f7-4a100b8366db',
    '506 (15帖)',
    '4F',
    15,
    6,
    3500,
    2800,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '5a4e1d19-d970-47c3-aef3-a02012b029b5',
    '1bcbf9a7-fb8b-46d0-a2f7-4a100b8366db',
    '507 (8.5帖)',
    '4F',
    8,
    3,
    2800,
    1900,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '88bcddc4-6bdc-4cb8-ab42-7584ad39b8ba',
    '1bcbf9a7-fb8b-46d0-a2f7-4a100b8366db',
    '508 (8.5帖)',
    '4F',
    8,
    3,
    2800,
    1900,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'b9170836-8bf7-41d0-a49d-961d460699c5',
    '1bcbf9a7-fb8b-46d0-a2f7-4a100b8366db',
    '509 (9帖)',
    '4F',
    9,
    4,
    2800,
    1900,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '5ec6c52b-7e33-41f1-a54f-029085e541d8',
    '1bcbf9a7-fb8b-46d0-a2f7-4a100b8366db',
    '510 (9帖)',
    '4F',
    9,
    4,
    2800,
    1900,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a90786ba-28f9-47ad-a862-1c3735875dbf',
    '1bcbf9a7-fb8b-46d0-a2f7-4a100b8366db',
    '511 (10帖)',
    '4F',
    10,
    4,
    3100,
    2300,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd81c6ef0-abaa-4fb1-aa2d-8ff2431044da',
    '2a666add-3363-4e02-a092-bf37c7e98cc9',
    '1st',
    '',
    10,
    5,
    3300,
    2200,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '427ae57f-2c41-4772-a593-adf5b9949f85',
    '2a666add-3363-4e02-a092-bf37c7e98cc9',
    '2st',
    '',
    10,
    5,
    3300,
    2200,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '205bbe70-323b-4c07-aa3f-e679f1dea9d5',
    '2a666add-3363-4e02-a092-bf37c7e98cc9',
    '3st',
    '',
    10,
    5,
    3300,
    2200,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'be3148a0-9b1d-499f-ad63-67ba150d2412',
    '2a666add-3363-4e02-a092-bf37c7e98cc9',
    '4st',
    '',
    10,
    5,
    3300,
    2200,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'dcf9d2a1-285a-4c39-ab35-29b4d113cbaa',
    '2a666add-3363-4e02-a092-bf37c7e98cc9',
    '6st',
    '',
    10,
    5,
    3080,
    1980,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6a4d95d4-669b-4ec1-a2bf-bfe4a48980c2',
    '2a666add-3363-4e02-a092-bf37c7e98cc9',
    '7st',
    '',
    10,
    5,
    3080,
    1980,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '43c401ad-35a3-4262-ae28-b604d250ba4e',
    'ab7adc75-bb09-464d-a2ca-b66cc896e445',
    '1st (10帖)',
    'B1F',
    10,
    5,
    3200,
    2500,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'ab4bad28-a712-4d3b-af61-13293d8420e2',
    'ab7adc75-bb09-464d-a2ca-b66cc896e445',
    '2st (10帖)',
    'B1F',
    10,
    5,
    3200,
    2500,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'fc52faec-dfbe-4069-a48f-eb0460fa5811',
    'ab7adc75-bb09-464d-a2ca-b66cc896e445',
    '3st (9帖)',
    'B1F',
    9,
    4,
    3200,
    2500,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '59588ed3-05ec-4cb2-aa05-e7828720577f',
    'ab7adc75-bb09-464d-a2ca-b66cc896e445',
    '4st (16帖)',
    'B1F',
    16,
    6,
    3800,
    3100,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'eea86540-22ab-4717-aa99-015e712b5359',
    'ab7adc75-bb09-464d-a2ca-b66cc896e445',
    '5st (10帖)',
    'B1F',
    10,
    5,
    3200,
    2500,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'e6148fb5-6ead-48cf-a4c1-91f185cd3b66',
    'ab7adc75-bb09-464d-a2ca-b66cc896e445',
    '6st (9帖)',
    'B1F',
    9,
    4,
    3200,
    2500,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '2f5be13f-8a19-40cd-a409-5a48c5cdd6fc',
    'ab7adc75-bb09-464d-a2ca-b66cc896e445',
    '7st (9帖)',
    'B1F',
    9,
    4,
    3200,
    2500,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '39c6430d-d24b-46f9-a8f8-ad3b9ce2735c',
    '0ab8fe7c-85c8-4027-a6e5-9828e8ee6753',
    'Rst (15帖)',
    '',
    15,
    6,
    3050,
    2350,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6271c35f-1511-4b67-ae24-6fa57246bedc',
    '0ab8fe7c-85c8-4027-a6e5-9828e8ee6753',
    'Ast (10帖)',
    '',
    10,
    4,
    2650,
    1950,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c137266c-3289-4d01-aaf2-26249e42268e',
    '0ab8fe7c-85c8-4027-a6e5-9828e8ee6753',
    'Bst (10帖)',
    '',
    10,
    4,
    2650,
    1950,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f49e3999-6b23-4dc3-a75a-9a48b310c229',
    '0ab8fe7c-85c8-4027-a6e5-9828e8ee6753',
    'Cst (13帖)',
    '',
    13,
    5,
    2850,
    2150,
    660,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '9057ca1f-9e4b-4cb9-a97d-2cb9c25834b7',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    '1st (14帖)',
    '',
    14,
    7,
    3190,
    2090,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd3593307-64a5-44a5-ac34-c7f4061b1362',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    '2st (8帖)',
    '',
    8,
    4,
    2310,
    1320,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'bdaacf5f-c618-4fe0-ab1c-5cb2f33846cd',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    '3st (14帖)',
    '',
    14,
    7,
    3190,
    2090,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'ca3dc561-b547-4312-a5ab-d53ee3906505',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    '4st (14帖)',
    '',
    14,
    7,
    3190,
    2090,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'dbb03b32-a8aa-4885-ab81-171e9c145357',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    '5st (10帖)',
    '',
    10,
    5,
    2530,
    1540,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '4dfc306e-fd63-4b0c-a687-0f33f5601a04',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    '6st (10帖)',
    '',
    10,
    5,
    2530,
    1540,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '34a798cf-1d1b-4119-ac73-69198ddd8c23',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    '7st (18帖)',
    '',
    18,
    9,
    3740,
    2640,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '3e3dc938-0d8d-4db9-abbd-656951046e32',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    '8st (14帖)',
    '',
    14,
    7,
    3190,
    2090,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '68663902-fdfd-431e-ae15-14a39beb13f2',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    'Sub Room (3帖)',
    '',
    3,
    2,
    700,
    700,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '4f6abcb6-ccde-4528-ada5-b3c21e9c987d',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    'Ast (18帖)',
    '',
    18,
    9,
    3740,
    2640,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '034046dd-21f1-4aa2-abbf-5ca8740e9ddb',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    'Bst (14帖)',
    '',
    14,
    7,
    3190,
    2090,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c0d298fe-4316-4f05-aed6-e52e5ca7f2fe',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    'Cst (14帖)',
    '',
    14,
    7,
    3190,
    2090,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'f9cacc69-6f2c-4ad3-a457-46dc228bad15',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    'Dst (10帖)',
    '',
    10,
    5,
    2530,
    1540,
    700,
    30
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '744b9067-1528-4478-a6d4-a44e095b8fdc',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    'Est (10帖)',
    '',
    10,
    5,
    2530,
    1540,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '7af007cb-c4a4-46c2-a8ce-ab5e92c3f599',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    'Fst (18帖)',
    '',
    18,
    9,
    3740,
    2640,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '1613c26a-bf41-4034-a614-e413201ff1e5',
    'fc597bd7-0ab7-428e-aa56-96592d631cfd',
    'Gst (14帖)',
    '',
    14,
    7,
    3190,
    2090,
    700,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '52c4103c-ae0a-4fb5-a1c6-db1419ffb518',
    '197b9abc-d04e-497f-ac8e-56506f803820',
    'Bst (16帖)',
    '2F',
    16,
    10,
    1980,
    1980,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '32b7d91a-30f9-49f7-ada0-575ee323f669',
    '197b9abc-d04e-497f-ac8e-56506f803820',
    'Cst (14帖)',
    '2F',
    14,
    10,
    1980,
    1980,
    770,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '42118983-cdd7-4393-a21b-045c5c4a36fb',
    '981ba110-6088-4e76-a751-4b967908fcee',
    'Aスタジオ (14帖)',
    '1F',
    14,
    8,
    3200,
    2400,
    1000,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'd3d0fd60-998f-424a-a718-9fa4eddbeca6',
    '981ba110-6088-4e76-a751-4b967908fcee',
    'Bスタジオ (11帖)',
    '1F',
    11,
    7,
    3000,
    2200,
    1000,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c0799496-e57a-45fa-ae03-1fd919ae5271',
    '981ba110-6088-4e76-a751-4b967908fcee',
    'Cスタジオ (10帖)',
    '1F',
    10,
    5,
    2800,
    2000,
    1000,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '510296bd-f305-4a4c-aad2-1e80f9f447ae',
    '981ba110-6088-4e76-a751-4b967908fcee',
    'Dスタジオ (10帖・鏡なし)',
    '1F',
    10,
    2,
    1800,
    1800,
    1000,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'a72b7297-c94c-43be-a59e-6bcc1220e3bc',
    '5d10f671-c987-445c-ac32-255be8447757',
    '1st (12帖)',
    'B1F',
    12,
    10,
    2830,
    2100,
    570,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'c21ea8bb-4f55-4d76-a0b4-642d1224ffcb',
    '5d10f671-c987-445c-ac32-255be8447757',
    '2st (10帖)',
    'B1F',
    10,
    10,
    2620,
    1880,
    570,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '81fb67e4-5b3a-450e-af6f-8cef28eea811',
    '5d10f671-c987-445c-ac32-255be8447757',
    '3st (10帖)',
    'B1F',
    10,
    10,
    2620,
    1880,
    570,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '6bcac2ca-99eb-4051-a218-9720f47fc986',
    '5d10f671-c987-445c-ac32-255be8447757',
    '4st (12帖)',
    'B1F',
    12,
    10,
    2830,
    2100,
    570,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '38941bfb-97fa-45dc-aefd-b77a78dface3',
    '5d10f671-c987-445c-ac32-255be8447757',
    '5st (10帖)',
    'B1F',
    10,
    10,
    2100,
    1470,
    570,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '621cb559-8ebc-4f0e-a328-0ff61169e571',
    '5d10f671-c987-445c-ac32-255be8447757',
    '6st (10帖)',
    'B1F',
    10,
    10,
    2620,
    1880,
    570,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '5de06a37-3867-4571-af96-19c725c7a264',
    '2b19aa48-0aa9-4107-a69e-5587d0ab58a6',
    'Ast (9帖)',
    '3F',
    9,
    10,
    2420,
    1700,
    570,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '3a752460-3ec9-4683-a3b3-3a87a518f2c8',
    '2b19aa48-0aa9-4107-a69e-5587d0ab58a6',
    'Bst (9帖)',
    '3F',
    9,
    10,
    2420,
    1700,
    570,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '4295a522-8072-400a-af08-3ea3c015fc22',
    '2b19aa48-0aa9-4107-a69e-5587d0ab58a6',
    'Cst (12帖)',
    '3F',
    12,
    10,
    2620,
    1940,
    570,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    'dc036cdf-c19a-473b-afd5-9e60273114b0',
    '2b19aa48-0aa9-4107-a69e-5587d0ab58a6',
    'Dst (12帖)',
    '3F',
    12,
    10,
    2620,
    1940,
    570,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '70b0369c-4c8d-41a5-ab74-5ac4826441f8',
    '2b19aa48-0aa9-4107-a69e-5587d0ab58a6',
    'Est (9帖)',
    '3F',
    9,
    10,
    2420,
    1700,
    570,
    0
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, start_time_offset)
  VALUES (
    '18d11843-c380-4146-ac62-fa4c6edc64fa',
    '2b19aa48-0aa9-4107-a69e-5587d0ab58a6',
    'Fst (9帖)',
    '3F',
    9,
    10,
    2420,
    1700,
    570,
    0
  ) ON CONFLICT (id) DO NOTHING;

  -- 3. 常設機材マスター (330件)
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
    '45648a63-b781-4d06-a439-72b13663f3b7',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg / Bass Amp',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Pearl Drums'
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
    '7d0f2e6f-dc50-437f-aec2-7621abb86272',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Markbass Little Mark IV + ST104HF',
    'SONOR SQ1 Series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '254e17bd-0fa0-4b36-abab-7c1c1495c291',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg V7+ Venture VB-410',
    'Pearl MASTERS MAPLE',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e96c8ac9-232a-4aac-a038-0f603861b3de',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3PRO + SVT-810E',
    'SAKAE Evolved',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8425f42e-1ce8-402a-a94e-4ebcebc586fd',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Markbass Little Mark Vintage + ST108HR',
    'YAMAHA Recording Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '0149a7b4-d635-4dee-acba-2d8af5d9e919',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'AGUILAR TONE HAMMER 500 V2 + DB810',
    'SONOR SQ1 Series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '66903210-c071-41f9-ab2a-502ae2fac96e',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3PRO + SVT-810E',
    'SAKAE Evolved',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd2898a5c-b9b3-4b07-a9e9-74e333b4361c',
    '{"Marshall JCM900 4100+1960A","Roland JC-120","Fender ToneMaster Twin Reverb"}',
    'Ampeg SVT-3PRO + SVT-810E',
    'YAMAHA Recording Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'da60b5c8-6d96-4097-af3d-960d6e22a1ad',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3PRO + SVT-810E',
    'CANOPUS YAIBA II',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e424232e-5239-43fd-abb1-71e757450360',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg V7+ SVT-810E',
    'CANOPUS YAIBA II',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a2820c89-889b-45b3-af28-068e58c5d9f3',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Orange 4 Stroke 500 LTD + OBC810',
    'CANOPUS YAIBA II',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd0030609-378e-4f04-a7aa-866248f8e7ad',
    '{"Roland JC-120"}',
    'Markbass Little Mark IV + ST104HF',
    'CANOPUS YAIBA II',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b2b11b70-d643-4e1a-a024-42626ee6c1a4',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b8b6fbd2-7b90-487a-aac9-1e27554f0cc7',
    '{"Roland JC-120"}',
    '',
    '',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5eb85076-fa63-436d-ad2c-44331dbb00ab',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b0606ba9-a0a6-4293-a1b4-1439f89995d0',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Markbass Little Mark IV + ST104HF',
    'SAKAE The Almighty',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6213987c-af79-4dc6-af31-953d3c2eae59',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-350H',
    'Pearl MMX series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9a870c6a-d15a-4d38-a048-c02f64c6b3ac',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl MRP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'fd1535e3-e1fd-410a-ac89-387a36452a5c',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'ORANGE 4-STROKE-300 & OBC410+OBC115',
    'Pearl MCX series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b1b739c4-c3d1-4a5e-a16f-6a7c95b761f9',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-350H',
    'Pearl MSX series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e21770e9-e22d-4c98-a5c0-3e24d071df50',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3PRO',
    'Pearl MRX series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9292692b-63fb-4a07-aa76-b3abd080afa0',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl MMP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e5f1a378-f589-4a23-abbe-c2312506a404',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H',
    'SAKAE The Almighty',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3234cb26-8d2a-458f-af77-fc01c5ad7640',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl RF series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '45ce0638-8a6e-4490-a8e5-efe73d71de94',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    't.c.electronic RH750',
    'DW Collector''s series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '50ca3504-77e5-4f90-a91d-4ef30b1891ef',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3eda195a-3536-43e4-a4a1-baf53978538c',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1c06ae8b-d763-4c30-acd8-14e1a23db13f',
    '{"Marshall JCM900 4100+1960A"}',
    'MarkBass Little Mark III & STD104HF',
    'CANOPUS R.F.M SET',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f19dd1d5-fcc5-4dae-ab11-b53dfa24b413',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Markbass Little Mark IV & STD104HF',
    'Pearl MMP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '686c9882-4f6d-4cb2-a90e-ed30de33c322',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H & SVT610HLF',
    'Pearl MMP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1595267d-dc24-451b-a420-c559a74807f9',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H & SVT610HLF',
    'Pearl MCX series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '23c6e4c0-2570-4e2e-a714-9339a664351c',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg Venture V7',
    'Pearl MMP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '224e586c-39c5-460c-a283-0f4340b8469a',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H & SVT810E',
    'Pearl MMP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '968c2952-f674-4855-acee-6a24d982ea77',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H & SVT610HLF',
    'Pearl MCX series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'fb4f53e8-ca1b-4da4-a6b6-226934bbfcce',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark Vintage1000 58R & STD108HR',
    'Pearl MMP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '923d95f7-eb66-4c3c-a5dc-e19bfd30d355',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H & SVT810E',
    'Pearl MMP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'dae16e59-070c-46c6-a4ce-424acd42c722',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H & SVT810E',
    'Pearl MMP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '0bcc7d80-1a57-4982-ab67-c65a82ecc2d6',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H & SVT-810E',
    'DW Collector''s Maple Set',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8364d67d-6de8-4c1b-a70d-9d6e89bef490',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT450H & SVT810E',
    'Pearl Reference series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '94354240-95e7-46e7-a3aa-b9e89906cec2',
    '{"Marshall JCM900 4100+1960A","Roland JC-120","Fender Twin Reverb ''65"}',
    'Ampeg SVT-450H & SVT810E',
    'SONOR SQ1 Series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'da2435c5-6c82-4b1a-a3fc-844f4411b222',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6fc0c3f6-e13b-40da-ad6f-e1cdc5bfa0cc',
    '{"Positive Grid REACTOR 100"}',
    'Markbass Little Mark 58R + Standard104HR',
    'YAMAHA Live Custom Hybrid Oak',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '05bcdee6-c576-4178-ad69-ad489206f105',
    '{"Fender Hot Rod DeVille 212 IV"}',
    'Ampeg Venture V3 + SVT-410HLF',
    'Pearl Session Studio Select',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '65a89f10-6570-4946-a763-4a0786313ae0',
    '{"Positive Grid REACTOR 100"}',
    'FENDER Rumble 800 HD + RUMBLE 210 CAB',
    'SAKAE Evolved Japan Custom Drum',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9251ac9c-22e3-42f8-ad8f-20ee6e2baf64',
    '{"Fender Hot Rod DeVille 212 IV"}',
    'HARTKE LH1000 + HyDrive HL410',
    'Pearl Session Studio Select',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd38aaabb-ddc3-4ddb-afc2-e22947cc7aab',
    '{"Marshall JCM900 4100+1960A","Roland JC-120","Fender Tone Master Twin Reverb"}',
    'Ampeg SVT-3PRO + SVT-810HLF',
    'YAMAHA Recording Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f037846b-f9bf-402e-adef-52b53259d265',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'ASHDOWN RM 800 EVOIII + RM 414T EVOIII',
    'CANOPUS Birch Series Studio kit Plus',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c1b260d5-e440-4f20-a2d7-06c9c1600e49',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'faecd22f-6a76-4513-a4b6-f81c191b237f',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e0d4de61-dcda-4638-a0fa-d6eab179084a',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '573b9772-4b4a-420b-aa84-fe0c52b11a05',
    '{"Positive Grid REACTOR 50","Spark 2 + Spark CAB"}',
    '',
    '',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '43ec5944-f044-4be7-a746-146d806677be',
    '{"Positive Grid REACTOR 50","Spark 2 + Spark CAB"}',
    '',
    '',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '44eaa8c3-8612-4fd0-a662-28b07891ec5d',
    '{"Positive Grid REACTOR 50","Spark 2 + Spark CAB"}',
    '',
    '',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a74efd97-b868-4eb6-a4dc-663637e70ad5',
    '{"Positive Grid REACTOR 50","Spark 2 + Spark CAB"}',
    '',
    '',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd768deaf-a1ca-46e5-ac30-45d73b277fcc',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd6280852-4816-4a0e-a5a0-762ce8eafd3a',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6533019b-fd2b-4d8a-aebd-b56ab224e6c9',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'markbass little mark iv + Standard104HF',
    'Pearl MCX series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '54b0db7f-be43-4ec5-a5ba-ef2af688e6e4',
    '{"Marshall JCM900 4100+1960A"}',
    'DARKGLASS Microtubes900 + DG410C',
    'Pearl MMP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '22555425-4419-4377-a622-18ee665619b0',
    '{"Marshall JCM900 4100+1960A"}',
    'Markbass Little Mark Tube + Standard104HF',
    'Pearl MRP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3980a7b0-3b56-4f66-a67c-ee7178704557',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Markbass Little Mark Tube + Standard104HF',
    'Pearl RFP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'ab6343c8-63ac-4a91-a14f-fc13000d7787',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT450H + 810E',
    'Pearl MMP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '2ba2719c-85f6-4f57-a7e2-0186912d1e72',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT450H + 810E',
    'SAKAE The Almighty',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '4561b432-5fed-410e-ad62-66975be1d700',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT450H + 810E',
    'Pearl MMP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '020848cf-8bc0-4949-a864-136f7c0c8958',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT450H + 810E',
    'Pearl RFP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '21728d58-0a2f-4098-a168-3399f7df950e',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Markbass Little Mark Tube + Standard104HF',
    'Pearl MRP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '15eb1f23-6c10-4f75-ae71-7b6fd2c73b70',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Markbass Little Mark IV',
    'Pearl RFP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6d150cc0-3fbd-4758-a9db-f841ecbd0a6f',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'EBS Classic 450 + Classic 810',
    'Pearl RF series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '66c3c1b7-23d8-4ebd-a2e3-73eadbbaefb1',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'EBS Reidmar502 + ClassicLine810',
    'SAKAE The Almighty',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6f48a19d-ea14-4ecf-a6b2-8a53e52b1a57',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark Rocker 500 + Standard108HR',
    'Pearl RF series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '08e75658-60c5-428c-ad95-339733493a22',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT450H + 810E',
    'SONOR SQ1 Series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a7e05898-4164-4676-ab35-f1e025b787dd',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'aguilar TONE HAMMER500 + DB810',
    'SAKAE The Almighty',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '59dfe699-342c-4134-a593-e6d1b1746667',
    '{"Fender Twin Reverb","Marshall JCM2000 DSL100+1960A","Roland JC-120"}',
    'Ampeg SVT-3PRO + 810E',
    'DW Collector''s Set',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3305287e-91a8-404e-af5f-cc780dd476b8',
    '{"Marshall JCM2000 DSL100+1960A","Roland JC-120"}',
    'Ampeg SVT450H + 810E',
    'YAMAHA Recording Custom',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1cb23559-e4ba-4ffe-a3d4-77bfa3df9d35',
    '{"Marshall JCM2000 DSL100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark Vintage',
    'SAKAE The Almighty',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '139685cd-4f49-408c-ac1e-a792c7ac4eda',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT450H + 810E',
    'DW Collector''s Series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f569322e-230e-40a6-af4a-8558fe281de8',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Darkglass ALPHA·OMEGA 900 + DG410N',
    'SJC tour series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1b7ca359-8081-412d-a8e0-9d5723ac3b9c',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '85224de3-98a2-43e7-a1b3-ae7119dd9565',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS LMR500',
    'Pearl MRP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '491a3591-821c-446f-a500-4530309a49e4',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Hartke LX8500 + 4.5XL',
    'Pearl MMP series (12"+13"+16"+22")',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '0934ca19-30e4-4dcf-ae96-9156af433141',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark IV + Standard104HF',
    'Pearl MMP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8e7b899c-8131-4585-a4f4-2cc978999701',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark IV + 108HR',
    'SAKAE The Almighty',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9cc060a8-c688-40c7-ac55-875f83532f5a',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS LM250 + 108HR',
    'SAKAE The Almighty',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c25faf74-4481-414b-ad48-e8e28957775a',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3PRO + 810',
    'SAKAE The Almighty',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '2050b4cd-ac53-4a73-ae44-1e938eb4f771',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '61408f39-68ef-499d-a19b-040bba32b3ee',
    '{"Marshall JCM2000 DSL100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark Vintage',
    'LUDWIG Classic Maple series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '43614990-1111-43b9-a6b2-59e3abc32259',
    '{"Marshall JCM2000 DSL100+1960A","Roland JC-120"}',
    'Ampeg SVT-3PRO + 810',
    'Pearl Reference PURE series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd34b0dc8-2fd8-4e06-a199-dfe00605d145',
    '{"Marshall JCM2000 DSL100+1960A","Roland JC-120"}',
    'EBS HD360 + ProLine810',
    'Pearl RFP series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '027254a9-94a6-4958-a18f-816257f362e1',
    '{"Marshall JCM2000 DSL100+1960A","Roland JC-120"}',
    'MARKBASS LMR500 + 108HR',
    'SONOR ProLite series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5d5bba86-7db2-49df-add9-f27f222d7e8e',
    '{"Marshall JCM2000 DSL100+1960A","Roland JC-120","Fender Twin Reverb 65"}',
    'MARKBASS Vintage + 108HR',
    'DW Collector''s Maple Set',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b1a5bbb0-9ba2-4e67-afad-d8fdf0d02c70',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b04149a9-81aa-48f4-aa13-b04959c9d204',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd236c685-eb13-4bf0-a2e7-f20a8fcddcc8',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f14d626d-c1d1-407c-aaac-8b56f0adc0ea',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Aguilar Tone Hammer 500 + DB410',
    'SAKAE Evolved',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'afad3f14-8068-43e4-a8a9-96636d515d09',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Darkglass MICROTUBES 500V2 + DG410N + DG210N',
    'PEARL REFERENCE PURE',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'ce717ec8-2b6b-4dff-a718-6a992b502c72',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3PRO + PN-410HLF',
    'Gretsch Limited Edition USA Custom 5 Piece',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '7f9b520b-fe11-4dca-ac15-920787760df2',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark Vintage + STANDARD104HF',
    'CANOPUS YAIBA II',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8013d52f-98a6-492a-a6ee-f4d9d33cc743',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'PJB BP800 + 6B9T',
    'PEARL Masters Maple GUM',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '892cfbe1-78aa-40e5-a7e1-4d81463adffc',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3PRO + SVT810E',
    'DW Collector''s Maple Set',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c31796b9-7051-4051-ab84-92ca2a943e1b',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark IV + STANDARD108HR',
    'PEARL MRS',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '431b51df-8abe-4c82-a959-46e753388a3f',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3PRO + SVT810E',
    'SONOR SQ1',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3dfa9a10-d175-43ac-a57a-2c8d36a3221c',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark IV + STANDARD108HR',
    'TAMA Starclassic Maple series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'eed1ebb1-d6d4-4ea5-a4b2-2a4dca51806d',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'orange 4stroke LTD + OBC810',
    'DW Collector''s Series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c9329040-3a56-4be7-a706-401198191263',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg B2RE',
    'Pearl MSX series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '27b47830-c2d3-47f1-a194-c1bb0af2a278',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg VENTURE V3',
    'Pearl MSX series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '39083a4e-f1b3-46b8-ac98-620927b73e3c',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl MSX series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '0ff7b000-9569-46a6-ab3d-66c0f31e5e22',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark Rocker 500',
    'SAKAE The Almighty',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '427a8f19-0e81-4d25-a44d-c6641acd5a27',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl MSX series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '56177a6b-26e3-4ac9-ab5d-116b54d6d972',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark Rocker 500',
    'SAKAE The Almighty Birch (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e9f0e651-003c-4174-a53a-6faf6be1865e',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark Vintage + Standard108HR',
    'SAKAE the Almighty (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '80b00fec-f3aa-4d13-a9bf-da941b9f94f0',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'YAMAHA Recording Custom (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a08f8b67-2fc0-44fb-a81e-7ce8c838a6f5',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl MMX series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'cdfb34bd-4679-464b-a375-6f96130f4bc4',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Reference series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '578b98ab-ad14-46cd-acb6-76ffb655f485',
    '{"Marshall JCM900 4100+1960A","Fender Twin Reverb ''65","Roland JC-120"}',
    'Fender TB600 Head + 810 Cabinet',
    'SONOR SQ1 Series (10"HT+12"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'cf3fc751-27dc-4955-a570-d0650b4e4005',
    '{"Marshall JCM900 4100+1960A","Fender Twin Reverb ''65","Roland JC-120"}',
    'Ampeg SVT 450H/SVT810E',
    'DW Collector''s Maple Set (12x9,13x10,16x14,22x18)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '618cad0f-df5c-4d1f-ac40-844873ed3f12',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '2fca8dc8-eaed-489c-a99c-47e450734539',
    '{"Roland JC-120"}',
    '',
    '',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'fe813993-d7ee-4e35-a786-6b5c08bf8907',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8448ad49-1f4a-4178-a274-6f3a110971f0',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl MMX series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1c336c18-6af8-406f-ae4e-1e785b1f97ba',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg Venture V3',
    'Pearl MMX series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a3f97fdc-11fe-4b69-adca-8e76596279a1',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS BIG BANG',
    'SAKAE The Almighty (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '10bd7c18-8b72-40aa-a559-7be70de17e31',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl MMX series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '7b045186-366e-4e8a-a616-8ac01a4103b8',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'EBS Classic 450',
    'SAKAE The Almighty',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a86292a8-fc4a-4692-af29-36838d234e6d',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'YAMAHA Absolute Hybrid Maple (10"HT+12"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5750bb49-3927-457c-ab30-b36bad552427',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl MMX series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c9f2fdc0-205c-4954-a43e-dc2f8bee6e26',
    '{"Marshall JCM900 4100+1960A ×2台","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'DW Collector''s Maple Set (10"HT+12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8c901c30-5b46-4393-aeb6-07a0d2c172e8',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark IV 300',
    'Pearl Reference series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'dd8daabe-3f50-4085-a549-31249cd6a2c8',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '69dbd431-72cf-45c3-af41-b2fa33e94e60',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'dea9e851-9001-42be-a2e5-ef29e7352d74',
    '{"Roland JC-120"}',
    'Markbass Little Mark 250 + Standard 104HF',
    'CANOPUS 刃 SERIES',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f70a5622-c863-4024-a1e5-250a6e94ffb9',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro + SVT610HF',
    'Pearl MSX series',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '976cbfbc-60a9-4cce-a84c-08a1bbe68ff6',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Markbass Little Mark Vintage + Standard 104HF',
    'SAKAE The Almighty Birch',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'fde4722e-8d30-4bfe-a1ee-ae9a6b868f24',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro + SVT810E',
    'Pearl Reference series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f68dec63-4742-4092-a57f-e584595fadd1',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS Little Mark Rocker 500 + Standard 108HR',
    'Pearl Carbonply Maple series (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5691b9bf-5600-4350-aecd-e9022f5bb97c',
    '{"Fender Twin Reverb 65\"","Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT450H + SVT810E',
    'SAKAE The Almighty',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1c345b6e-fabd-4e5d-a270-8c073857eb4e',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Darkglass Electronics MICROTUBES 900 + DS-210C/DG-410C',
    'Pearl Reference Pure (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a7642520-c1db-4c21-ab82-94e365e2d976',
    '{"Fender Twin Reverb 65\"","Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT450H + SVT810E',
    'DW Collector''s Maple Set (12x9,13x10,16x14,22x18)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a885797c-8ad1-4574-a67d-7a136f5d1f7e',
    '{"Fender Twin Reverb 65\"","Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg SVT450H + SVT810E',
    'YAMAHA Recording Custom (12"HT+13"LT+16"FT+22"BD)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '722c8096-761a-4ca5-aeb2-0016703b0353',
    '{}',
    '(バンド用アンプ設備なし)',
    '(ドラムセットなし)',
    true,
    '{}',
    '※個人練習・ボーカル録音・DJ機材利用等に特化した小型ブースです。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '06b1ec8e-ba16-46e7-a239-c9641b4e73e9',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg Venture V7 + SVT-810E',
    'YAMAHA Recording Custom SOB (HT10,LO12,FT16,BD22)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '38e20cf7-d5d1-4266-a922-a2c54a493719',
    '{"Marshall JCM900 4100+1960A","Roland JC-120","Fender USA 65 Twin Reverb"}',
    'Ampeg Venture V7 + SVT-810E',
    'SONOR SQ1 GTB (HT10,LO12,FT16,BD22)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時30分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'adef2ce1-ab3c-45c5-aca8-1058cf82affa',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS LITTLE MARK IV + Standard 108',
    'TAMA Starclassic Walnut/Birch SAF (HT10,LO12,FT16,BD22)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'dbe12edd-c4d8-4683-a9ba-d9cba91f4c70',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg 3pro SVT-410HLF',
    'Pearl SESSION STUDIO SELECT (HT10,LO12,FT14,BD20)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e5df97d4-4f1e-4c03-a064-4bc6b0592be2',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'Ampeg 3pro SVT-410HLF',
    'CANOPUS Birch Series Studio kit Plus White Satin (HT10,LO12,FT14,BD20)',
    true,
    '{}',
    'サウンドスタジオノア標準高品位機材常設。開始時間: 毎時00分スタート。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '2571c031-7756-4e45-ab99-b5a054fb0e5c',
    '{"Marshall JCM900 4100+1960A","Roland JC-120"}',
    'MARKBASS LITTLE MARK IV Standard 104 HR',
    'TAMA Starclassic Walnut/Birch LPO (HT10,LO12,FT16,BD22)',
    true,
    '{}',
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
    'シティサイド最大16帖スタジオ。ヴィンテージアンプも完備。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '62d85c00-343e-419a-a20b-fc9e25736133',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Hartke HA3500 + 410XL',
    'Pearl Session Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '563db1d8-3259-4554-a794-6b3a17e7ca4c',
    '{"Roland JC-120","Marshall DSL100H"}',
    'Ampeg SVT-350',
    'TAMA Starclassic',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd07faab7-64a0-4ed2-a467-f040d67f07c6',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b184b83d-7c3d-48a7-af04-aa4a390b7e03',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e8ac9ef2-344d-4452-a211-b77e787d3d9c',
    '{"Roland JC-120","Marshall JTM45"}',
    'Fender Bassman',
    'Canopus Yaiba',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '074a0ac1-4f2a-4ded-aeab-76b534f428d4',
    '{"Roland JC-120","VOX AC15"}',
    'Hartke HD150',
    'TAMA Club-JAM',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2811）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'fa7f37ad-c3a6-4c24-a1df-30561f9feab8',
    '{"Roland JC-120","Marshall JCM2000 DSL100","Hughes & Kettner TriAmp"}',
    'Ampeg SVT-4PRO + 810E',
    'Pearl Masters Premium',
    true,
    '{}',
    'ジュークハウスのフラッグシップ。抜けの良い音響設計。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9b229f1d-8168-4b09-ab53-b3a9a7dab44f',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Hartke HA3500 + 410XL',
    'TAMA Starclassic',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'dc811606-26a9-46ed-ae15-00cf144baf68',
    '{"Roland JC-120","Marshall DSL100H"}',
    'Ampeg SVT-350',
    'Pearl Session Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '11c252f1-c358-4500-a456-659ae2ac6e8a',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '75ea60c4-a804-48cf-ad81-652b91cff742',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6a30cce5-b0f1-47fb-a330-23fff513c9b1',
    '{"Roland JC-120","Fender Blues Junior"}',
    'Hartke HD150',
    'TAMA Club-JAM',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '31c5900d-5331-4f5c-a042-30dcd529ebc8',
    '{"Roland JC-120","VOX AC15"}',
    'Hartke HD150',
    'TAMA Club-JAM',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2815）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '0ace9d72-b6f4-428d-acc4-8090853878df',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-3PRO',
    'Pearl Masters Studio',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2818）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '7d4877c1-4b44-4876-a4e3-46d0688cb26c',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Hartke HA3500',
    'Pearl Session Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2818）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '39e2172b-04f1-44d7-a78e-5d4b53c2dfa9',
    '{"Roland JC-120","Marshall DSL100H"}',
    'Ampeg SVT-350',
    'TAMA Starclassic',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2818）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '129c3f86-4245-4392-a4f2-df6fb5cb4434',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2818）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '60c2a2cd-c13f-40a2-a463-43d8c5b6d543',
    '{"Roland JC-120","Fender Pro Junior"}',
    'Hartke HD150',
    'TAMA Club-JAM',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2818）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5f779fec-e93a-4568-a045-a610c1d19687',
    '{"Roland JC-120","VOX AC15"}',
    'Hartke HD150',
    'TAMA Club-JAM',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3462-2818）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9c841b9e-dcd4-4346-a742-c42c6e5d4fe5',
    '{"Roland JC-120","Marshall JCM2000 DSL100","Mesa/Boogie Dual Rectifier"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'TAMA Starclassic Performer',
    true,
    '{}',
    'ペンタ新宿店1階の大型フラッグシップスタジオ。セルフレコ対応。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c0a04ff1-51c3-474f-a01b-e1dbdcfed810',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Ampeg SVT-350 + 410XL',
    'Pearl Masters Studio',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '56c4eafd-e586-4499-a92b-1f2c1f1d3d2e',
    '{"Roland JC-120","Marshall JVM210H"}',
    'Hartke HA3500 + 410XL',
    'Canopus Yaiba II',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e51686b1-ed5c-41ef-aa46-779fd3447f82',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Hartke HA3500',
    'Pearl Session Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'dacfb6b8-72c2-4012-ab64-bc6202f6ab17',
    '{"Roland JC-120","Marshall DSL100H"}',
    'Ampeg SVT-350',
    'TAMA Starclassic',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '4f29bafc-3c9a-4668-ae2a-d109091b411a',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Hartke HA3500',
    'Pearl Session Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd44d4a0e-1564-41bd-ab84-610477e76bd2',
    '{"Roland JC-120","Marshall DSL100H"}',
    'Ampeg SVT-350',
    'TAMA Starclassic',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b49d4732-cfe3-4f59-af7a-dcd95661a29a',
    '{"Roland JC-120","Marshall JCM900 4100"}',
    'Hartke HA3500',
    'Pearl Session Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f9828fe0-2631-4327-a839-b23614c26b42',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'be77f115-e523-4175-ac26-b0b6dd6c2ba7',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '18ce79d2-a600-4794-a034-5ef0da3c6aa8',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e971c550-259c-4101-a238-377ca9900806',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '7e1158a2-aecc-4e28-a60b-62daf7433c3a',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f8c7b055-e820-4d52-ab20-5e11548308f7',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'cbe0e853-0cef-4060-ac6f-00abd1277301',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'ba37b319-9525-468e-a11d-6c1e50bedf2b',
    '{"Roland JC-120","Marshall DSL40CR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '56125f05-a588-4289-a153-477a3c59a3bb',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '2e2b47a1-f4d2-4534-aaef-eb30ce58afc4',
    '{"Roland JC-120","Marshall DSL20HR"}',
    'Hartke HA2500',
    'Pearl Export',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '626796fb-c74a-42ed-a1c6-ec1e856640d0',
    '{"Roland JC-120","Marshall JVM210H","Fender Twin Reverb"}',
    'Ampeg SVT-4PRO',
    'Canopus Yaiba II',
    true,
    '{}',
    '5階の大型スタジオ。Fender Twin Reverb完備。セルフレコ対応。※土日祝日は空き状況をWeb公開中（平日またはご予約はお電話：03-3351-3140）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '891be1b4-b586-44ac-aa55-ca8d032a4d4d',
    '{"Marshall JVM210H+1960A","Roland JC-120","Fender Twin Reverb"}',
    'Ampeg B2-RE + SVT610HLF',
    'Pearl MX',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-5540）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '780a0afe-81de-4056-ae0d-04780e70adc3',
    '{"Marshall JVM210H+1960A","Roland JC-120","Fender Twin Reverb"}',
    'Ampeg B2-RE + SVT610HLF',
    'Pearl Masters Maple',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-5540）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '07e3c14a-f2fb-4af5-ad82-a2dd07bbf1b2',
    '{"Marshall JVM210H+1960A","Mesa/Boogie Dual Rectifier","Roland JC-120"}',
    'Ampeg SVT-450H + SVT610HLF',
    'Pearl MRX',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-5540）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '48f03499-7a3c-474c-a2b6-83c11999aa6a',
    '{"Marshall JVM210H+1960A","Mesa/Boogie Dual Rectifier","Roland JC-120"}',
    'Ampeg SVT-450H + SVT610HLF',
    'Pearl CM',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-5540）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e3a8f578-8bad-40bc-ab54-4b3c023cb186',
    '{"Marshall JVM210H+1960A","Mesa/Boogie Dual Rectifier","Roland JC-120"}',
    'Ampeg SVT-450H + SVT610HLF',
    'Pearl MRX',
    true,
    '{}',
    '池袋エリアで最も歴史のあるリハーサルスタジオ。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-5540）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '7255fe72-7a00-4634-ac5f-269fb13b64c6',
    '{"Roland JC-120","VOX AC30C2-TV-BC"}',
    'EDEN Terra Nova TN501 + Ampeg SVT-410HE/SVT-15EN',
    'Canopus NV60-M1',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-4436）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '2d150912-4661-46d6-afd3-b86d7416b979',
    '{"Marshall JVM210H","Mesa/Boogie Dual Rectifier","Roland JC-120"}',
    'Ampeg SVT-450H + SVT-810E',
    'Canopus R.F.M.',
    true,
    '{}',
    'ハンズサイド最大の20帖フラッグシップスタジオ。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-4436）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f2998e41-1fff-4e78-a5fc-667502b8fb92',
    '{"Marshall JVM210H","Roland JC-120"}',
    'Ampeg SVT-3PRO + SVT-810E',
    'Pearl Masters Premium',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-4436）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '458301e3-47c8-40d2-a5d5-e3a7fd149b31',
    '{"LINE 6 Spider Valve HD100","Roland JC-120"}',
    'Aguilar TONE HAMMER 500 + SVT-810E',
    'YAMAHA Recording Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-4436）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '88e64e2b-dba7-4255-a0db-16fe77a277a4',
    '{"Marshall JVM210H","Roland JC-120"}',
    'Ampeg SVT-3PRO + SVT-810E',
    'Pearl Masters Premium',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-4436）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8ac9bf93-4e29-4179-ad29-1286da87de87',
    '{"Roland JC-120","Blackstar Series One 100"}',
    'Ampeg B-2RE',
    'Pearl Masters Premium',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-4436）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f0c04919-448b-4bdc-a8be-2a9ba9815755',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg SVT-7PRO / SVT-AV + SVT-810E',
    'Pearl Masters Premium',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-4436）にて承ります。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '7aed46d0-53ab-42f4-ab61-b51d76577195',
    '{"Roland JC-120","Marshall JVM210H"}',
    'Ampeg SVT-3PRO + SVT-810E',
    'YAMAHA Recording Custom',
    true,
    '{}',
    'スタジオペンタ正規常設機材。※電話予約店舗のため、空き確認・ご予約はお電話（03-3981-4436）にて承ります。'
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

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '441a66c2-22bf-4f6b-a773-cd5c6075616e',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-3pro、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1fd6e83f-c063-4e60-ae4c-0eabeb8216cc',
    '{"Marshall DSL100H","Roland JC-120","HUGHES&KETTNER TRIAMP MKII"}',
    'Ampeg / Hartke Bass Amp',
    'Pearl Drums',
    true,
    '{}',
    'Marshall DSL100H、Roland JC-120、HUGHES&KETTNER TRIAMP MKII、Pearl Drums、セルフレコ対応'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd2d9448d-2151-451c-a09d-16f3b4c2e01d',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-3pro、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd798daf8-81a9-4916-ad1b-4ce64be3a149',
    '{"Marshall DSL100H","Roland JC-120","HUGHES&KETTNER TRIAMP MKII"}',
    'Ampeg / Hartke Bass Amp',
    'Pearl Drums',
    true,
    '{}',
    'Marshall DSL100H、Roland JC-120、HUGHES&KETTNER TRIAMP MKII、Pearl Drums、セルフレコ対応'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f9e60039-90fe-45b9-a2f8-e29f635de867',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg SVT-450H、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'ff907a5e-1a43-4fd4-a6f4-08a3d90a9693',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-3pro、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '97cf33d3-ab0d-47e6-a5bb-c4c8909fb0cb',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg SVT-450H、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '22c74358-17d1-4e9e-a387-764a09d3ee45',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-3pro、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6e309a3a-bbde-497c-a464-8bafa97082d1',
    '{"Marshall JCM2000","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Ampeg SVT-450H、Pearl Drums、15分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9d396b46-3ad8-4d20-a22e-7a100ee9ba73',
    '{"Marshall JVM410H","Roland JC-120","Mesa/Boogie Dual Rectifier"}',
    'Ampeg / Hartke Bass Amp',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JVM410H、Roland JC-120、Mesa/Boogie Dual Rectifier、Pearl Masters、15帖以上、15分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'eac29b9b-5dea-405e-a063-896701c3f4c3',
    '{"Marshall JVM410H","Roland JC-120","Fender Twin Reverb ''65"}',
    'Ampeg / Hartke Bass Amp',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JVM410H、Roland JC-120、Fender Twin Reverb ''65、Pearl Masters、15帖以上、15分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '427b52b3-e851-4b10-a93b-d117b357ba8b',
    '{"Marshall JVM410H","Roland JC-120"}',
    'Ampeg SVT-CL',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JVM410H、Roland JC-120、Ampeg SVT-CL、Pearl Masters、15帖以上、ダンスルーム兼用'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b5455e2a-6258-4d06-a190-9586f9718a54',
    '{"Marshall JVM410H","Roland JC-120","Mesa/Boogie Dual Rectifier"}',
    'Ampeg / Hartke Bass Amp',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JVM410H、Roland JC-120、Mesa/Boogie Dual Rectifier、Pearl Masters、15帖以上、45分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'df1b85d0-89a3-41ff-a814-d836432af031',
    '{"Marshall JVM410H","Roland JC-120","Fender Twin Reverb ''65"}',
    'Ampeg / Hartke Bass Amp',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JVM410H、Roland JC-120、Fender Twin Reverb ''65、Pearl Masters、15帖以上、45分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1e75e474-5fbe-49f4-a46b-d789dd9b6ee4',
    '{"Marshall JVM410H","Roland JC-120"}',
    'Ampeg / Hartke Bass Amp',
    'ツインドラムセット常設',
    true,
    '{}',
    'Marshall JVM410H、Roland JC-120、ツインドラムセット常設、Pearl Masters x2、15帖以上、45分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '4d407ed2-b5bc-42d1-a4f4-e44665bf4bfe',
    '{"Roland JC-120","Marshall JCM900"}',
    'Ampeg SVT-350H',
    'Pearl Standard Drum Set',
    true,
    '{}',
    'スタジオ音楽館 馬場駅前店 標準機材常設。高田馬場駅から徒歩1分。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c6f4565f-959e-4ea7-a70a-c6d1b2e853ca',
    '{"Roland JC-120","Marshall JCM900"}',
    'Ampeg SVT-350H',
    'Pearl Standard Drum Set',
    true,
    '{}',
    'スタジオ音楽館 馬場駅前店 標準機材常設。高田馬場駅から徒歩1分。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c626c4f3-1707-490b-a39b-f9b52c2e947c',
    '{"Roland JC-120","Marshall JCM2000 DSL100"}',
    'Ampeg SVT-450H + SVT-410HLF',
    'Pearl Masters Custom',
    true,
    '{}',
    'スタジオ音楽館 馬場駅前店 標準機材常設。高田馬場駅から徒歩1分。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '042a11ed-d19d-4fd0-a254-555252748d3a',
    '{"Roland JC-120","Marshall JVM210H","Fender Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Masters Custom',
    true,
    '{}',
    'スタジオ音楽館 馬場駅前店 標準機材常設。高田馬場駅から徒歩1分。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '2dda6640-d4a3-4ccb-ae98-26a2022a0064',
    '{"Roland JC-120","Marshall JVM410H","Fender Twin Reverb"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{}',
    'スタジオ音楽館 馬場駅前店 標準機材常設。高田馬場駅から徒歩1分。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9c6b8ef9-791b-4554-ace2-4aa1d43bad19',
    '{"Roland JC-120","Marshall JVM410H","Hughes & Kettner"}',
    'Ampeg SVT-4PRO + SVT-810E',
    'Pearl Reference Pure',
    true,
    '{}',
    'スタジオ音楽館 馬場駅前店 標準機材常設。高田馬場駅から徒歩1分。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'ba9a8722-ff0c-4953-aa4a-3dcfadadb19d',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-3pro、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '67a4fdba-fbac-4767-a4d1-57e10bf79b85',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-3pro、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '4ae8aca7-31c1-4810-a900-a646a7a20659',
    '{"Marshall JCM800","Roland JC-120"}',
    'Ampeg SVT-450',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM800、Roland JC-120、Ampeg SVT-450、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3aa411be-16f2-4ed2-aea6-6f33ebbd46d0',
    '{"Marshall JVM210H","Roland JC-120"}',
    'Hartke HA5500',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JVM210H、Roland JC-120、Hartke HA5500、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9dd1bf39-f6c2-4437-a588-dfffcecb8a6b',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450',
    'dw CL series Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450、dw CL series Drums、15帖以上、独立モニター完備'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '8bde340d-0c3d-41c2-ae21-f0aeafeff14e',
    '{"Marshall JCM2000","Roland JC-120","Fender Twin Reverb"}',
    'Ampeg / Hartke Bass Amp',
    'dw CL series Drums',
    true,
    '{}',
    'Marshall JCM2000、Roland JC-120、Fender Twin Reverb、dw CL series Drums、15帖以上、独立モニター完備'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5a4e1d19-d970-47c3-aef3-a02012b029b5',
    '{"Marshall JCM900","Roland JC-120"}',
    'Hartke HA5500',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Hartke HA5500、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '88bcddc4-6bdc-4cb8-ab42-7584ad39b8ba',
    '{"Marshall DSL40CR","Roland JC-120"}',
    'Hartke HA5500',
    'Pearl Drums',
    true,
    '{}',
    'Marshall DSL40CR、Roland JC-120、Hartke HA5500、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'b9170836-8bf7-41d0-a49d-961d460699c5',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-3pro、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5ec6c52b-7e33-41f1-a54f-029085e541d8',
    '{"Marshall JCM800","Roland JC-120"}',
    'Ampeg SVT-450',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM800、Roland JC-120、Ampeg SVT-450、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a90786ba-28f9-47ad-a862-1c3735875dbf',
    '{"Marshall JVM210H","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JVM210H、Roland JC-120、Ampeg SVT-3pro、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd81c6ef0-abaa-4fb1-aa2d-8ff2431044da',
    '{"Marshall JVM410H+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro + SVT810E',
    'NATAL Maple',
    true,
    '{}',
    'NATAL Mapleドラムセット常設。シンバルはPAISTE PST7 Heavy各種。Web予約は要事前会員登録（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから予約状況をご確認ください）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '427ae57f-2c41-4772-a593-adf5b9949f85',
    '{"Marshall JVM410H+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro + SVT810E',
    'NATAL Birch',
    true,
    '{}',
    'NATAL Birchドラムセット常設。シンバルはPAISTE PST7 Heavy各種。Web予約は要事前会員登録（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから予約状況をご確認ください）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '205bbe70-323b-4c07-aa3f-e679f1dea9d5',
    '{"Marshall JVM410H+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro + SVT810AV',
    'NATAL Ash',
    true,
    '{}',
    'NATAL Ashドラムセット常設。シンバルはPAISTE PST7 Heavy各種。Web予約は要事前会員登録（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから予約状況をご確認ください）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'be3148a0-9b1d-499f-ad63-67ba150d2412',
    '{"Marshall JVM410H+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro + SVT810AV',
    'NATAL Birch',
    true,
    '{}',
    'NATAL Birchドラムセット常設。シンバルはPAISTE PST7 Heavy各種。Web予約は要事前会員登録（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから予約状況をご確認ください）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'dcf9d2a1-285a-4c39-ab35-29b4d113cbaa',
    '{"Marshall JVM410H+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro + SVT810E',
    'CANOPUS Birch',
    true,
    '{}',
    'CANOPUS Birchドラムセット常設。シンバルはPAISTE PST7 Heavy各種。Web予約は要事前会員登録（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから予約状況をご確認ください）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6a4d95d4-669b-4ec1-a2bf-bfe4a48980c2',
    '{"Marshall JVM410H+1960A","Roland JC-120"}',
    'Ampeg SVT-3pro + SVT810E',
    'NATAL Maple',
    true,
    '{}',
    'NATAL Mapleドラムセット常設。シンバルはPAISTE PST7 Heavy各種。Web予約は要事前会員登録（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから予約状況をご確認ください）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '43c401ad-35a3-4262-ae28-b604d250ba4e',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-3pro、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'ab4bad28-a712-4d3b-af61-13293d8420e2',
    '{"Marshall JCM800","Roland JC-120"}',
    'Ampeg SVT-450',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM800、Roland JC-120、Ampeg SVT-450、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'fc52faec-dfbe-4069-a48f-eb0460fa5811',
    '{"Marshall JVM210H","Roland JC-120"}',
    'Hartke HA5500',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JVM210H、Roland JC-120、Hartke HA5500、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '59588ed3-05ec-4cb2-aa05-e7828720577f',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'dw CL series Drums',
    true,
    '{"キーボード2台常設"}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-3pro、dw CL series Drums、キーボード2台常設、15帖以上'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'eea86540-22ab-4717-aa99-015e712b5359',
    '{"Marshall DSL100H","Roland JC-120"}',
    'Ampeg SVT-3pro',
    'Pearl Drums',
    true,
    '{}',
    'Marshall DSL100H、Roland JC-120、Ampeg SVT-3pro、Pearl Drums'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'e6148fb5-6ead-48cf-a4c1-91f185cd3b66',
    '{"Marshall JCM900","Roland JC-120"}',
    'Hartke HA5500',
    'Pearl Drums',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Hartke HA5500、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '2f5be13f-8a19-40cd-a409-5a48c5cdd6fc',
    '{"Marshall DSL40CR","Roland JC-120"}',
    'Ampeg SVT-450',
    'Pearl Drums',
    true,
    '{}',
    'Marshall DSL40CR、Roland JC-120、Ampeg SVT-450、Pearl Drums、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '39c6430d-d24b-46f9-a8f8-ad3b9ce2735c',
    '{"YAMAHA THR100HD + THRC212"}',
    'EDEN Bass Amp',
    'Gretsch Drums (コーテッドヘッド標準装備)',
    true,
    '{}',
    'グランドピアノ常設。ウッドベース・コントラバスのレンタルやオーディオインターフェースの用意あり。予約はお電話・LINE・メールフォームにて（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから空き状況をご確認ください）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6271c35f-1511-4b67-ae24-6fa57246bedc',
    '{"YAMAHA THR100HD + THRC212"}',
    'EDEN Bass Amp',
    'スタンダードドラムセット',
    true,
    '{}',
    'ウッドベース・コントラバスのレンタルやオーディオインターフェースの用意あり。予約はお電話・LINE・メールフォームにて（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから空き状況をご確認ください）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c137266c-3289-4d01-aaf2-26249e42268e',
    '{"YAMAHA THR100HD + THRC212"}',
    'EDEN Bass Amp',
    'Drummer''s Base New Custom Jazz Set',
    true,
    '{}',
    'アップライトピアノ常設。ウッドベース・コントラバスのレンタルやオーディオインターフェースの用意あり。予約はお電話・LINE・メールフォームにて（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから空き状況をご確認ください）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f49e3999-6b23-4dc3-a75a-9a48b310c229',
    '{"YAMAHA THR100HD + THRC212"}',
    'EDEN Bass Amp',
    'スタンダードドラムセット',
    true,
    '{}',
    'ウッドベース・コントラバスのレンタルやオーディオインターフェースの用意あり。予約はお電話・LINE・メールフォームにて（ゲスト閲覧不可のためリアルタイム空き状況は非対応、公式サイトから空き状況をご確認ください）。'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '9057ca1f-9e4b-4cb9-a97d-2cb9c25834b7',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Masters Premium',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Masters Premium'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd3593307-64a5-44a5-ac34-c7f4061b1362',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Masters Premium',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Masters Premium、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'bdaacf5f-c618-4fe0-ab1c-5cb2f33846cd',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Masters Premium',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Masters Premium、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'ca3dc561-b547-4312-a5ab-d53ee3906505',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Masters Premium',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Masters Premium、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'dbb03b32-a8aa-4885-ab81-171e9c145357',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Masters Premium',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Masters Premium、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '4dfc306e-fd63-4b0c-a687-0f33f5601a04',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Masters Premium',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Masters Premium'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '34a798cf-1d1b-4119-ac73-69198ddd8c23',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Masters Premium',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Masters Premium、音反応LEDフラッシュライト設置'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3e3dc938-0d8d-4db9-abbd-656951046e32',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Reference',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Reference、Subルーム併設'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '68663902-fdfd-431e-ae15-14a39beb13f2',
    '{}',
    '',
    '',
    true,
    '{}',
    'DTM用モニタースピーカー、ミニミキサー、セルフレコーディング対応、個人練習/マンツーマンレッスン向け'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '4f6abcb6-ccde-4528-ada5-b3c21e9c987d',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Reference',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Reference'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '034046dd-21f1-4aa2-abbf-5ca8740e9ddb',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Masters Premium',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Masters Premium、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c0d298fe-4316-4f05-aed6-e52e5ca7f2fe',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Masters Premium',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Masters Premium、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'f9cacc69-6f2c-4ad3-a457-46dc228bad15',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Masters Premium',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Masters Premium、30分スタート'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '744b9067-1528-4478-a6d4-a44e095b8fdc',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Masters Premium',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Masters Premium'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '7af007cb-c4a4-46c2-a8ce-ab5e92c3f599',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Reference',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Reference'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '1613c26a-bf41-4034-a614-e413201ff1e5',
    '{"Marshall JCM900","Roland JC-120"}',
    'Ampeg SVT-450H',
    'Pearl Masters Premium',
    true,
    '{}',
    'Marshall JCM900、Roland JC-120、Ampeg SVT-450H、Pearl Masters Premium'
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '52c4103c-ae0a-4fb5-a1c6-db1419ffb518',
    '{"Marshall JCM2000 DSL-100/1960","Fender TwinAmp","Roland JC120"}',
    'Ampeg SWR750x/Megoliath',
    'YAMAHA Maple Custom Absolute',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '32b7d91a-30f9-49f7-ada0-575ee323f669',
    '{"Marshall JCM2000 DSL-100/1960","Fender TwinAmp","Roland JC120"}',
    'Ampeg SVT-4PRO/SVT810E',
    'YAMAHA Maple Custom Absolute',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '42118983-cdd7-4393-a21b-045c5c4a36fb',
    '{"Marshall JCM900","Roland JC120"}',
    'Ampeg SVT-4PRO+810',
    'Pearl BN series(12"13"16"22") / MEINL CUSTOM DARK series',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'd3d0fd60-998f-424a-a718-9fa4eddbeca6',
    '{"Marshall JCM900","Roland JC120"}',
    'GALLIEN-KRUEGER 1001RB-II / Ampeg SVT-810E',
    'Pearl BN series(12"13"16"22") / Paiste PST-7',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c0799496-e57a-45fa-ae03-1fd919ae5271',
    '{"Marshall JCM900","Roland JC120"}',
    'Acoustic SET',
    'Pearl Vision series(12"13"16"22") / Paiste PST-5',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '510296bd-f305-4a4c-aad2-1e80f9f447ae',
    '{"Dr.Z CarmenGhia Xotic Mod.(レコーディング用)"}',
    'Ampeg SVT-4PRO+810 / SUNN Vintage Cabinet(レコーディング用)',
    'TAMA DRUM SET / Pearl DRUM SET(レコーディング用)',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'a72b7297-c94c-43be-a59e-6bcc1220e3bc',
    '{"Marshall","Roland JC-120","Fender"}',
    'Ampeg',
    'Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'c21ea8bb-4f55-4d76-a0b4-642d1224ffcb',
    '{"Marshall","Roland JC-120"}',
    'ALBIT B-280',
    'Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '81fb67e4-5b3a-450e-af6f-8cef28eea811',
    '{"Marshall","Roland JC-120"}',
    'GALLIEN-KRUEGER 400RB III',
    'Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '6bcac2ca-99eb-4051-a218-9720f47fc986',
    '{"Marshall","Roland JC-120","Fender"}',
    'Ampeg',
    'Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '38941bfb-97fa-45dc-aefd-b77a78dface3',
    '{"Marshall","Roland JC-120"}',
    'Trace Elliot GP12 AH400',
    'Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '621cb559-8ebc-4f0e-a328-0ff61169e571',
    '{"Marshall","Roland JC-120"}',
    'Ampeg',
    'Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '5de06a37-3867-4571-af96-19c725c7a264',
    '{"Marshall","Roland JC-120"}',
    'Trace Elliot AH300',
    'Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '3a752460-3ec9-4683-a3b3-3a87a518f2c8',
    '{"Marshall","Roland JC-120"}',
    'PEAVEY Session Bass',
    'Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '4295a522-8072-400a-af08-3ea3c015fc22',
    '{"Marshall","Roland JC-120","Fender"}',
    'Ampeg',
    'Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    'dc036cdf-c19a-473b-afd5-9e60273114b0',
    '{"Marshall","Roland JC-120","Fender"}',
    'Ampeg',
    'Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '70b0369c-4c8d-41a5-ab74-5ac4826441f8',
    '{"Marshall","Roland JC-120"}',
    'Trace Elliot AH300SMC',
    'Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

  INSERT INTO room_equipments (room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, keyboards, additional_notes)
  VALUES (
    '18d11843-c380-4146-ac62-fa4c6edc64fa',
    '{"Marshall","Roland JC-120"}',
    'Ampeg',
    'Pearl Standard Maple(BD22"/FT16"/TT13"&12") / Sabian AA Rock',
    true,
    '{}',
    ''
  ) ON CONFLICT (room_id) DO NOTHING;

END $$;
