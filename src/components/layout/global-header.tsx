'use client';

import React, { useState, useEffect } from 'react';
import { Music, Radio, ChevronRight, Store, SlidersHorizontal } from 'lucide-react';
import { SupportedStudiosModal } from '@/components/studio/supported-studios-modal';
import { SUPPORTED_STUDIOS } from '@/config/supported-studios';
import { ThemeToggle } from './theme-toggle';
import { sendGAEvent } from '@/lib/gtag';

export const GlobalHeader: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialArea, setInitialArea] = useState<string>('all');
  const studioCount = SUPPORTED_STUDIOS.length;
  const roomCount = SUPPORTED_STUDIOS.reduce((acc, st) => acc + st.roomCount, 0);

  // グローバルイベントによるモーダル開閉対応（Topページ内のボタン等からも開けるようにする）
  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ area?: string }>;
      if (customEvent.detail?.area) {
        setInitialArea(customEvent.detail.area);
      } else {
        setInitialArea('all');
      }
      setIsModalOpen(true);
    };

    window.addEventListener('soundspot:open-studios-modal', handleOpenEvent);
    return () => window.removeEventListener('soundspot:open-studios-modal', handleOpenEvent);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-stone-200 dark:border-slate-800 px-4 lg:px-8 py-3.5">
        {/* ロゴ側と稼働状況ピルの合計幅が狭いスマホ幅では収まりきらないため、
            はみ出た場合は画面外に切れず2段目に折り返すようflex-wrapを付ける */}
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-y-2">
          {/* ロゴ・サービス名 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 font-black">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Sound Spot
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                音楽リハーサルスタジオ 横断空き状況・機材比較
              </p>
            </div>
          </div>

          {/* 稼働状況ボタン（クリックで対応スタジオ一覧モーダル表示）＆テーマ切り替え */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* 稼働状況ピル（対応スタジオ一覧モーダルを開く）。スマホ幅では下の検索条件設定
                ボタンに右上のスペースを譲り、ロゴ下の「対応スタジオ一覧を見る」ボタンから
                開けるようにする（機能自体はそちらで引き続き提供）。 */}
            <button
              type="button"
              onClick={() => {
                sendGAEvent({ action: 'open_studios_modal', category: 'ui_engagement', label: 'header_pill' });
                setInitialArea('all');
                setIsModalOpen(true);
              }}
              className="hidden sm:flex group items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-slate-800/90 hover:bg-stone-200 dark:hover:bg-slate-700/90 border border-stone-200 dark:border-slate-700/80 hover:border-emerald-400 dark:hover:border-emerald-500/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm hover:shadow-emerald-950/10 dark:hover:shadow-emerald-950/40 cursor-pointer text-left"
              title={`クリックして現在対応している${studioCount}店舗・${roomCount}部屋のスタジオ一覧を表示`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse group-hover:scale-110 transition-transform flex-shrink-0" />
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-slate-500 dark:text-slate-400 hidden md:inline">稼働状況:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  首都圏 {studioCount}店舗 / {roomCount}部屋 稼働中
                </span>
                <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 pl-1.5 border-l border-stone-300 dark:border-slate-700">
                  <span>一覧を見る</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </button>
            {/* 検索条件設定ボタン（スマホ専用。押すとpage.tsx側のボトムシートが開く。
                スクロール位置に関係なく常にここから開けるよう、ヘッダー内に固定配置する。
                アイコンのみだと押した先が分かりにくいという指摘を受け、文字表示にした） */}
            <button
              type="button"
              onClick={() => {
                sendGAEvent({ action: 'open_filter_modal', category: 'ui_engagement', label: 'header_button' });
                window.dispatchEvent(new CustomEvent('soundspot:open-filter-modal'));
              }}
              className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 font-semibold cursor-pointer flex-shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">検索条件設定</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* 対応スタジオ一覧モーダル */}
      <SupportedStudiosModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialArea={initialArea}
      />
    </>
  );
};
