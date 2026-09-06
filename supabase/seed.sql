-- ==========================================
-- 音楽スタジオ横断空き枠検索アプリ（MVP）
-- シードデータ: 東京・千葉 5店舗 & 部屋 & 機材 & 空き枠
-- ==========================================

DO $$
DECLARE
    -- スタジオID
    sid_noah_shibuya UUID := 'a0000000-0000-0000-0000-000000000001';
    sid_penta_shinjuku UUID := 'a0000000-0000-0000-0000-000000000002';
    sid_noah_kichijoji UUID := 'a0000000-0000-0000-0000-000000000003';
    sid_penta_chiba UUID := 'a0000000-0000-0000-0000-000000000004';
    sid_ongakukan_kashiwa UUID := 'a0000000-0000-0000-0000-000000000005';

    -- 部屋ID
    -- 渋谷ノア
    rid_noah_shibuya_g UUID := 'b0000000-0000-0000-0000-000000000011';
    rid_noah_shibuya_e UUID := 'b0000000-0000-0000-0000-000000000012';
    rid_noah_shibuya_b UUID := 'b0000000-0000-0000-0000-000000000013';

    -- 新宿ペンタ
    rid_penta_shinjuku_1 UUID := 'b0000000-0000-0000-0000-000000000021';
    rid_penta_shinjuku_2 UUID := 'b0000000-0000-0000-0000-000000000022';

    -- 吉祥寺ノア
    rid_noah_kichi_cs UUID := 'b0000000-0000-0000-0000-000000000031';
    rid_noah_kichi_a UUID := 'b0000000-0000-0000-0000-000000000032';

    -- 千葉ペンタ
    rid_penta_chiba_a UUID := 'b0000000-0000-0000-0000-000000000041';
    rid_penta_chiba_b UUID := 'b0000000-0000-0000-0000-000000000042';

    -- 柏音楽館
    rid_ongaku_kashiwa_a UUID := 'b0000000-0000-0000-0000-000000000051';
    rid_ongaku_kashiwa_b UUID := 'b0000000-0000-0000-0000-000000000052';

    -- ループ処理用
    target_d DATE;
    h INT;
    room_rec RECORD;
    status_val TEXT;
    s_time TIMESTAMPTZ;
    e_time TIMESTAMPTZ;
    hash_val INT;
BEGIN
    -- 1. スタジオデータの登録
    INSERT INTO studios (id, name, chain_name, area, prefecture, nearest_station, address, tel, booking_url, group_booking_rule, group_booking_lead_months, solo_booking_rule, solo_booking_lead_hours, website_url)
    VALUES
    (
        sid_noah_shibuya,
        'SOUND STUDIO NOAH 渋谷2号店',
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
    ),
    (
        sid_penta_shinjuku,
        'STUDIO PENTA 新宿店',
        'STUDIO PENTA',
        '新宿',
        '東京都',
        '新宿駅 東口 徒歩3分 / 新宿三丁目駅 徒歩2分',
        '東京都新宿区新宿3-11-6 エビスビルB1F',
        '03-3351-3140',
        'https://www.studiopenta.net/rehearsal/shinjuku.html',
        '2ヶ月前の1日よりWEB予約可能',
        2,
        '前日営業開始（10:00）より受付開始',
        38,
        'https://www.studiopenta.net/rehearsal/shinjuku.html'
    ),
    (
        sid_noah_kichijoji,
        'SOUND STUDIO NOAH 吉祥寺店',
        'SOUND STUDIO NOAH',
        '吉祥寺',
        '東京都',
        '吉祥寺駅 北口 徒歩4分',
        '東京都武蔵野市吉祥寺本町2-5-10 B1F',
        '0422-23-1774',
        'https://www.studionoah.jp/kichijoji/',
        '3ヶ月前の1日よりWEB予約可能',
        3,
        '前日21:00よりWEB/電話にて受付開始',
        27,
        'https://www.studionoah.jp/kichijoji/'
    ),
    (
        sid_penta_chiba,
        'STUDIO PENTA 千葉駅前店',
        'STUDIO PENTA',
        '千葉',
        '千葉県',
        'JR千葉駅 東口 徒歩4分 / 京成千葉駅 徒歩3分',
        '千葉県千葉市中央区富士見2-8-14 エスカイヤ登戸ビル3F',
        '043-224-6014',
        'https://www.studiopenta.net/rehearsal/chiba.html',
        '2ヶ月前の1日よりWEB予約可能',
        2,
        '前日営業開始より受付開始',
        38,
        'https://www.studiopenta.net/rehearsal/chiba.html'
    ),
    (
        sid_ongakukan_kashiwa,
        'スタジオ音楽館 柏店',
        'スタジオ音楽館',
        '柏',
        '千葉県',
        'JR柏駅 東口 徒歩4分',
        '千葉県柏市柏2-5-9 岡田屋ビル2F',
        '04-7164-3200',
        'https://www.studiocan.co.jp/kashiwa/',
        '2ヶ月前の同日より予約受付',
        2,
        '前日および当日電話受付のみ',
        24,
        'https://www.studiocan.co.jp/kashiwa/'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 2. 部屋データの登録 (00分開始 / 30分開始をリアルに配置)
    INSERT INTO rooms (id, studio_id, name, floor, size_tatami, capacity, price_per_hour_regular, price_per_hour_daytime, price_per_hour_solo, has_mirror, has_recording, start_time_offset, image_url)
    VALUES
    -- 渋谷ノア
    (rid_noah_shibuya_g, sid_noah_shibuya, 'Gst (15帖)', 'B1F', 15.0, 6, 3520, 2420, 990, true, true, 0, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop'),
    (rid_noah_shibuya_e, sid_noah_shibuya, 'Est (12帖)', 'B1F', 12.0, 5, 2970, 1980, 880, true, false, 30, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop'),
    (rid_noah_shibuya_b, sid_noah_shibuya, 'Booth (6帖・個人練習専用)', 'B1F', 6.0, 2, 1650, 1320, 770, true, true, 0, 'https://images.unsplash.com/photo-1520523839898-507127053e14?w=600&auto=format&fit=crop'),

    -- 新宿ペンタ
    (rid_penta_shinjuku_1, sid_penta_shinjuku, '1st (16帖)', 'B1F', 16.0, 6, 3600, 2200, 900, true, true, 0, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop'),
    (rid_penta_shinjuku_2, sid_penta_shinjuku, '2st (13帖)', 'B1F', 13.0, 5, 3100, 1900, 800, true, false, 30, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop'),

    -- 吉祥寺ノア
    (rid_noah_kichi_cs, sid_noah_kichijoji, 'CSst (18帖・セルフレコ対応)', 'B1F', 18.0, 7, 4180, 2860, 1100, true, true, 0, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop'),
    (rid_noah_kichi_a, sid_noah_kichijoji, 'Ast (14帖)', 'B1F', 14.0, 5, 3300, 2200, 900, true, false, 30, 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop'),

    -- 千葉ペンタ
    (rid_penta_chiba_a, sid_penta_chiba, 'Ast (15帖)', '3F', 15.0, 6, 3300, 2000, 800, true, false, 0, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop'),
    (rid_penta_chiba_b, sid_penta_chiba, 'Bst (11帖)', '3F', 11.0, 4, 2800, 1700, 750, true, false, 30, 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop'),

    -- 柏音楽館
    (rid_ongaku_kashiwa_a, sid_ongakukan_kashiwa, 'Aスタジオ (14帖)', '2F', 14.0, 5, 2900, 1800, 700, true, false, 0, 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?w=600&auto=format&fit=crop'),
    (rid_ongaku_kashiwa_b, sid_ongakukan_kashiwa, 'Bスタジオ (10帖)', '2F', 10.0, 4, 2500, 1500, 650, true, false, 30, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop')
    ON CONFLICT (id) DO NOTHING;

    -- 3. 機材データの登録
    INSERT INTO room_equipments (id, room_id, guitar_amps, bass_amp, drum_set, is_twin_pedal_allowed, pa_system, keyboards, cymbals_detail, additional_notes)
    VALUES
    (
        gen_random_uuid(),
        rid_noah_shibuya_g,
        ARRAY['Roland JC-120', 'Marshall JCM2000 DSL100', 'Hughes & Kettner GrandMeister 36'],
        'Ampeg SVT-3PRO + SVT-810E',
        'Pearl Masters Maple Complete (BD22, TT10, TT12, FT16)',
        true,
        'YAMAHA TF1 (デジタルミキサー)',
        ARRAY['Roland RD-88', 'YAMAHA CP4 STAGE'],
        'PAISTE 2002 Crash 16/18, Ride 20, HiHat 14',
        '全面ミラー有、常設3アンプ仕様で3ピース〜ツインギター編成まで快適です。'
    ),
    (
        gen_random_uuid(),
        rid_noah_shibuya_e,
        ARRAY['Roland JC-120', 'Marshall DSL100H'],
        'Ampeg SVT-450H + SVT-410HLF',
        'CANOPUS Yaiba II (BD22, TT10, TT12, FT16)',
        true,
        'YAMAHA EMX5016CF',
        ARRAY['Roland RD-88'],
        'Zildjian A Custom Crash 16/18, Ride 20',
        '30分スタート枠。タイトで音の回りが少なくモニタリングしやすい環境。'
    ),
    (
        gen_random_uuid(),
        rid_noah_shibuya_b,
        ARRAY['Roland JC-120', 'Fender '65 Twin Reverb'],
        'Hartke HA3500 + 4.5XL',
        'YAMAHA Stage Custom Bop-Kit (BD18, TT12, FT14)',
        true,
        'Mackie 1402-VLZ4',
        ARRAY['Nord Electro 6D'],
        'SABIAN AA Regular Hats 14, Crash 16',
        '個人練習・レコーディング・ボーカルレッスン専用ブース。'
    ),
    (
        gen_random_uuid(),
        rid_penta_shinjuku_1,
        ARRAY['Roland JC-120', 'Marshall JCM900 4100', 'Mesa/Boogie Dual Rectifier'],
        'Ampeg SVT-3PRO + SVT-810E',
        'TAMA Starclassic Performer (BD22, TT12, TT13, FT16)',
        true,
        'YAMAHA EMX5016CF',
        ARRAY['KORG KROSS2-88'],
        'SABIAN AA Series Rock Crash 16/18, Ride 20',
        'ペンタ名物トリプルアンプ部屋！ラウド系・パンク系バンドに大人気。'
    ),
    (
        gen_random_uuid(),
        rid_penta_shinjuku_2,
        ARRAY['Roland JC-120', 'Marshall JCM2000 DSL100'],
        'Hartke HA3500 + 410XL',
        'Pearl Session Studio Classic',
        true,
        'YAMAHA EMX512SC',
        ARRAY['Roland Juno-DS61'],
        'Zildjian New Beat Hats 14, Medium Thin Crash 16/18',
        '30分スタート枠。程よいデッド感で合わせやすいスタジオ。'
    ),
    (
        gen_random_uuid(),
        rid_noah_kichi_cs,
        ARRAY['Roland JC-120', 'Marshall JVM410H', 'Fender Bassman 100'],
        'Ampeg SVT-VR + SVT-810AV',
        'YAMAHA Absolute Hybrid Maple',
        true,
        'PreSonus StudioLive 32SC (マルチトラック録音対応)',
        ARRAY['Roland RD-2000', 'YAMAHA MONTAGE8'],
        'Zildjian K Custom Special Dry',
        '大型18帖スタジオ。配信・セルフレコーディング用マルチマイク常設。'
    ),
    (
        gen_random_uuid(),
        rid_noah_kichi_a,
        ARRAY['Roland JC-120', 'Marshall DSL100H'],
        'Markbass Little Mark III + Standard 104HR',
        'Pearl Masters Studio',
        true,
        'YAMAHA EMX5016CF',
        ARRAY['Roland RD-88'],
        'PAISTE Signature Full Crash',
        '30分スタート枠。温かみのあるアンビエンスで長時間の練習でも疲れません。'
    ),
    (
        gen_random_uuid(),
        rid_penta_chiba_a,
        ARRAY['Roland JC-120', 'Marshall JCM2000 DSL100'],
        'Ampeg SVT-450H + SVT-810E',
        'TAMA Imperialstar',
        true,
        'YAMAHA EMX512SC',
        ARRAY['Roland Juno-DS'],
        'SABIAN AA Series',
        '千葉の定番スタジオ。ツインペダル持ち込み可、音抜け良好。'
    ),
    (
        gen_random_uuid(),
        rid_penta_chiba_b,
        ARRAY['Roland JC-120', 'Marshall MG100HFX'],
        'Hartke 3500 + 410XL',
        'Pearl Export',
        false,
        'YAMAHA EMX312SC',
        ARRAY[]::TEXT[],
        'Zildjian ZBT Series',
        '少人数バンド向けリーズナブル枠。'
    ),
    (
        gen_random_uuid(),
        rid_ongaku_kashiwa_a,
        ARRAY['Roland JC-120', 'Marshall JCM900 4100'],
        'Ampeg SVT-3PRO + SVT-410HLF',
        'Pearl Masters Custom',
        true,
        'YAMAHA EMX5014C',
        ARRAY['Roland RD-700NX'],
        'PAISTE 2002',
        '柏駅前すぐ。広いコントロールスペースと鏡張り。'
    ),
    (
        gen_random_uuid(),
        rid_ongaku_kashiwa_b,
        ARRAY['Roland JC-120', 'Marshall DSL40CR'],
        'EDEN WT800 + D410XLT',
        'YAMAHA Tour Custom',
        true,
        'YAMAHA EMX212S',
        ARRAY[]::TEXT[],
        'SABIAN B8X',
        '30分スタート枠。コスパ抜群の練習室。'
    )
    ON CONFLICT (room_id) DO NOTHING;

    -- 4. 空き枠スロットデータの動的生成（本日〜7日先まで、10:00〜23:00）
    FOR target_d IN 
        SELECT (CURRENT_DATE + i)::DATE FROM generate_series(0, 7) AS i
    LOOP
        FOR room_rec IN SELECT id, start_time_offset FROM rooms LOOP
            -- 10時から23時まで1時間刻み（部屋のオフセット0分または30分に準拠）
            FOR h IN 10..22 LOOP
                IF room_rec.start_time_offset = 0 THEN
                    s_time := (target_d + make_interval(hours => h));
                    e_time := (target_d + make_interval(hours => h + 1));
                ELSE
                    s_time := (target_d + make_interval(hours => h, mins => 30));
                    e_time := (target_d + make_interval(hours => h + 1, mins => 30));
                END IF;

                -- 疑似ランダムなステータス生成（ハッシュ値ベースで決定）
                hash_val := abs(hashtext(room_rec.id::text || s_time::text)) % 100;

                -- 平日夜(18時以降)や土日は予約多め、昼は空き多め
                IF EXTRACT(ISODOW FROM target_d) IN (6, 7) THEN
                    -- 土日
                    IF hash_val < 65 THEN
                        status_val := 'booked';
                    ELSIF hash_val < 95 THEN
                        status_val := 'available';
                    ELSE
                        status_val := 'maintenance';
                    END IF;
                ELSE
                    -- 平日
                    IF h >= 18 THEN
                        IF hash_val < 70 THEN
                            status_val := 'booked';
                        ELSE
                            status_val := 'available';
                        END IF;
                    ELSE
                        IF hash_val < 35 THEN
                            status_val := 'booked';
                        ELSE
                            status_val := 'available';
                        END IF;
                    END IF;
                END IF;

                INSERT INTO availability_slots (room_id, start_time, end_time, status, updated_at)
                VALUES (room_rec.id, s_time, e_time, status_val, now())
                ON CONFLICT (room_id, start_time, end_time) 
                DO UPDATE SET status = EXCLUDED.status, updated_at = now();
            END LOOP;
        END LOOP;
    END LOOP;

END $$;
