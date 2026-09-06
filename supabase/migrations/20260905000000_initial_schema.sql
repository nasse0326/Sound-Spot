-- ==========================================
-- 音楽スタジオ横断空き枠検索アプリ（MVP）
-- 初期データベーススキーマ定義
-- ==========================================

-- UUID拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. スタジオ店舗テーブル (studios)
CREATE TABLE IF NOT EXISTS studios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    chain_name TEXT NOT NULL,                -- 'SOUND STUDIO NOAH', 'STUDIO PENTA' 等
    area TEXT NOT NULL,                      -- '渋谷', '新宿', '吉祥寺', '柏', '千葉'
    prefecture TEXT NOT NULL,                -- '東京都', '千葉県'
    nearest_station TEXT NOT NULL,          -- '渋谷駅 ハチ公口 徒歩5分'
    address TEXT NOT NULL,
    tel TEXT,
    booking_url TEXT NOT NULL,               -- 各スタジオ公式WEB予約ページURL
    group_booking_rule TEXT,                 -- バンド予約ルール説明（例: '3ヶ月前の1日よりWEB予約受付開始'）
    group_booking_lead_months INT DEFAULT 3, -- バンド予約可能な月数
    solo_booking_rule TEXT,                  -- 個人練習ルール説明（例: '前日21:00よりWEB/電話受付'）
    solo_booking_lead_hours INT DEFAULT 27,  -- 個人練習受付開始（利用開始何時間前か）
    website_url TEXT,                        -- 公式店舗HP
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 部屋テーブル (rooms)
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    name TEXT NOT NULL,                      -- 'Ast', 'E2st', 'Booth' 等
    floor TEXT,                              -- 'B1F', '2F' 等
    size_tatami NUMERIC(4, 1) NOT NULL,      -- 畳数 (例: 14.5)
    capacity INT NOT NULL DEFAULT 5,         -- 推奨定員 (名)
    price_per_hour_regular INT NOT NULL,     -- バンド通常料金(平日夜/土日祝) 円/h
    price_per_hour_daytime INT NOT NULL,     -- バンド平日昼料金 円/h
    price_per_hour_solo INT NOT NULL,        -- 個人練習1名あたりの料金 円/h
    has_mirror BOOLEAN NOT NULL DEFAULT true,-- 全面鏡の有無
    has_recording BOOLEAN NOT NULL DEFAULT false, -- セルフREC設備有無
    start_time_offset INT NOT NULL DEFAULT 0 CHECK (start_time_offset IN (0, 30)), -- 0: 00分開始, 30: 30分開始
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 常設機材テーブル (room_equipments)
CREATE TABLE IF NOT EXISTS room_equipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL UNIQUE REFERENCES rooms(id) ON DELETE CASCADE,
    guitar_amps TEXT[] NOT NULL DEFAULT '{}', -- 例: ['Roland JC-120', 'Marshall JCM2000 DSL100']
    bass_amp TEXT NOT NULL,                   -- 例: 'Ampeg SVT-3PRO + SVT-810E'
    drum_set TEXT NOT NULL,                   -- 例: 'Pearl Masters Studio (BD22, TT12, TT13, FT16)'
    is_twin_pedal_allowed BOOLEAN NOT NULL DEFAULT true, -- ツインペダル利用可否
    pa_system TEXT,                           -- PA卓 / スピーカー
    keyboards TEXT[] NOT NULL DEFAULT '{}',   -- 常設または優先レンタルキーボード
    cymbals_detail TEXT,                      -- シンバル類
    additional_notes TEXT,                    -- その他備考
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. 空き枠・予約状況キャッシュテーブル (availability_slots)
CREATE TABLE IF NOT EXISTS availability_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'booked', 'unopened', 'maintenance')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_room_slot UNIQUE (room_id, start_time, end_time)
);

-- ==========================================
-- インデックス設計
-- ==========================================

-- スタジオ検索の高速化
CREATE INDEX IF NOT EXISTS idx_studios_area ON studios(area);
CREATE INDEX IF NOT EXISTS idx_studios_prefecture ON studios(prefecture);
CREATE INDEX IF NOT EXISTS idx_studios_chain ON studios(chain_name);

-- 部屋検索の高速化
CREATE INDEX IF NOT EXISTS idx_rooms_studio_id ON rooms(studio_id);
CREATE INDEX IF NOT EXISTS idx_rooms_size_tatami ON rooms(size_tatami);

-- 機材検索の高速化（GINインデックスで配列内のアンプ名を即時検索）
CREATE INDEX IF NOT EXISTS idx_room_equipments_guitar_amps ON room_equipments USING GIN (guitar_amps);
CREATE INDEX IF NOT EXISTS idx_room_equipments_keyboards ON room_equipments USING GIN (keyboards);

-- 空き枠検索（日時レンジ・ステータスによる絞り込み）
CREATE INDEX IF NOT EXISTS idx_availability_slots_lookup 
    ON availability_slots(room_id, start_time, end_time, status);
CREATE INDEX IF NOT EXISTS idx_availability_slots_time 
    ON availability_slots(start_time, status);

-- ==========================================
-- 行レベルセキュリティ (RLS: Row Level Security)
-- ==========================================

ALTER TABLE studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

-- 検索アプリ閲覧者（匿名ユーザー含む）に対する参照許可ポリシー
CREATE POLICY "Allow public read access on studios"
    ON studios FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access on rooms"
    ON rooms FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access on room_equipments"
    ON room_equipments FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access on availability_slots"
    ON availability_slots FOR SELECT
    TO public
    USING (true);

-- ==========================================
-- 自動更新日時トリガー関数
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_studios_updated_at
    BEFORE UPDATE ON studios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
