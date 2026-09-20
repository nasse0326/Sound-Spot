import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { GlobalHeader } from '@/components/layout/global-header';
import { FixedBottomAdBanner } from '@/components/common/fixed-bottom-ad-banner';
import { GA_MEASUREMENT_ID } from '@/lib/gtag';

export const metadata: Metadata = {
  title: 'Sound Spot - 音楽スタジオ横断空き枠検索',
  description: 'ノア・ペンタ・音楽館など複数リハーサルスタジオの空き枠・広さ・常設機材を一括検索比較',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* ライト/ダーク切り替え: localStorageの保存値（無ければダーク＝現行デフォルト）を
            ペイント前に<html>へ同期する。next/scriptは非同期のためチラつき防止には使えず、
            素の<script>で最速に実行する必要がある。 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var isDark=t?t==='dark':true;document.documentElement.classList.toggle('dark',isDark);}catch(e){}})();`,
          }}
        />
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
      <body className="bg-[#F6F5F1] dark:bg-[#0b0f17] text-slate-800 dark:text-slate-100 min-h-screen flex flex-col">
        {/* ヘッダーナビゲーション（稼働状況クリックで対応スタジオ一覧表示） */}
        <GlobalHeader />

        {/* メインコンテンツ（スマホは下部固定バナーの高さ分、余白を確保して隠れないようにする。
            PCはバナーを出さないので元のpadding-bottomのまま） */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>

        {/* フッター */}
        <footer className="border-t border-stone-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-6 text-center text-xs text-slate-500 dark:text-slate-500 pb-20 lg:pb-6">
          <p>© 2026 Sound Spot - 音楽スタジオ横断空き枠検索アプリ</p>
          <p className="mt-1 text-slate-400 dark:text-slate-600">
            ※空き状況はスタジオ公式サイトの情報を元に定期取得・更新しています。予約完了は各スタジオの公式WEBサイトにて行ってください。
          </p>
        </footer>

        {/* 画面下部に常時固定表示する横長バナー広告（スマホ専用。PCは右サイドバーの
            バナーに一本化するため、ここはlg以上で非表示にする） */}
        <FixedBottomAdBanner />
      </body>
    </html>
  );
}
