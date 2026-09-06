# SoundSpot - 音楽スタジオ横断空き枠検索アプリ (MVP)

複数の音楽リハーサルスタジオ（SOUND STUDIO NOAH、STUDIO PENTA、スタジオ音楽館など）の予約状況を横断検索し、空き枠・部屋の広さ・常設機材を一括比較できるWebアプリケーションです。

> 📘 **アーキテクチャ・運用ルール・スクレイピング方針**:
> 詳細なシステム設計やBAN回避（人間化）ロジック、キャッシュ運用ルールは [docs/SYSTEM_DESIGN_AND_SPECS.md](docs/SYSTEM_DESIGN_AND_SPECS.md) にまとめてあります。


---

## 主な機能 & 業界特有の仕様対応

1. **「00分スタート」と「30分スタート」の横断比較**
   - ロビー混雑緩和のため部屋ごとに分かれている開始刻み（例: 14:00開始部屋と14:30開始部屋）をタイムラインおよびカードビューで並列表示。
2. **バンド練習（部屋貸切） vs 個人練習（1〜2名）モード**
   - 料金計算の切り替え（室料 vs 人数割）。
   - 「前日21時開放」「2日前開放」などの開放ルール表示。
3. **機材・スペックこだわり検索**
   - JC-120必須、Marshall必須、ツインペダル利用可否、セルフレコ対応、部屋の最低畳数によるフィルタリング。
4. **各スタジオ公式予約ページへの直リンク**
   - 目的のスタジオ・枠が決まったら、ワンクリックで該当スタジオの公式WEB予約ページへ遷移。

---

## ディレクトリ構成

```text
.
├── supabase/
│   ├── migrations/
│   │   └── 20260905000000_initial_schema.sql  # テーブル定義、インデックス、RLS
│   └── seed.sql                               # サンプル店舗（5店舗）、部屋、機材、動的空き枠データ
├── src/
│   ├── app/
│   │   ├── api/studios/route.ts               # スタジオ検索API（Supabase & モック自動切り替え）
│   │   ├── globals.css                        # グローバルスタイル (Tailwind CSS)
│   │   ├── layout.tsx                         # 共通レイアウト・ヘッダー
│   │   └── page.tsx                           # メイン検索・カード/タイムライン画面
│   ├── components/
│   │   ├── search/
│   │   │   ├── search-filter-bar.tsx          # 日時・エリア・用途・機材フィルターバー
│   │   │   └── studio-card.tsx                # スタジオ・部屋別空き枠カード
│   │   ├── timeline/
│   │   │   └── studio-timeline-view.tsx       # タイムライン形式の空き枠バー表示
│   │   └── studio/
│   │       └── room-detail-modal.tsx          # 部屋詳細・常設機材・予約直リンクモーダル
│   ├── lib/
│   │   ├── mock-data.ts                       # モックデータ & 動的スロット生成ロジック
│   │   ├── utils.ts                           # Tailwindクラスマージユーティリティ
│   │   └── supabase/
│   │       └── client.ts                      # Supabaseクライアント
│   └── types/
│       └── studio.ts                          # TypeScript型定義
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 起動方法 (ローカル開発)

### 1. 依存関係のインストール (完了済み)
```bash
npm install
```

### 2. 開発サーバーの起動
```bash
npm run dev
```
ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。
※Supabaseの接続設定がなくても、リッチなモックデータ（東京・千葉の5店舗・11部屋・全機材・リアルタイム枠）により全機能がそのまま動作します。

---

## Supabaseのセットアップ手順

1. [Supabase](https://supabase.com) で新規プロジェクトを作成します。
2. Supabase管理画面の **SQL Editor** を開きます。
3. `supabase/migrations/20260905000000_initial_schema.sql` の内容を貼り付けて実行（Run）します。
4. 続いて `supabase/seed.sql` の内容を貼り付けて実行（Run）します。
5. プロジェクトの `.env.local` を作成し、Project Settings > API から取得したURLとanon keyを設定します：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
