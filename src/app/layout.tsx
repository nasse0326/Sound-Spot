import type { Metadata } from 'next';
import './globals.css';
import { Music, Radio } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SoundSpot - 音楽スタジオ横断空き枠検索',
  description: 'ノア・ペンタ・音楽館など複数リハーサルスタジオの空き枠・広さ・常設機材を一括検索比較',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-[#0b0f17] text-slate-100 min-h-screen flex flex-col">
        {/* ヘッダーナビゲーション */}
        <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 font-black">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white">
                    SoundSpot
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    MVP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  音楽リハーサルスタジオ 横断空き状況・機材比較
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">稼働状況:</span>
                <span className="font-semibold text-emerald-400">都内 6店舗 / 62部屋 実データ稼働中</span>
              </div>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>

        {/* フッター */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <p>© 2026 SoundSpot - 音楽スタジオ横断空き枠検索アプリ (MVP)</p>
          <p className="mt-1 text-slate-600">
            ※空き状況はスタジオ公式サイトの情報を元に同期しています。予約完了は各スタジオの公式WEBサイトにて行ってください。
          </p>
        </footer>
      </body>
    </html>
  );
}
