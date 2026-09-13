import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { GlobalHeader } from '@/components/layout/global-header';
import { GA_MEASUREMENT_ID } from '@/lib/gtag';

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
      <head>
        {/* Google tag (gtag.js) */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="bg-[#0b0f17] text-slate-100 min-h-screen flex flex-col">
        {/* ヘッダーナビゲーション（稼働状況クリックで対応スタジオ一覧表示） */}
        <GlobalHeader />

        {/* メインコンテンツ */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>

        {/* フッター */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <p>© 2026 SoundSpot - 音楽スタジオ横断空き枠検索アプリ (MVP)</p>
          <p className="mt-1 text-slate-600">
            ※空き状況はスタジオ公式サイトの情報を元に定期取得・更新しています。予約完了は各スタジオの公式WEBサイトにて行ってください。
          </p>
        </footer>
      </body>
    </html>
  );
}
