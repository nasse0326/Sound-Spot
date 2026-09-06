'use client';

import React, { useState, useEffect } from 'react';
import { Music, Radio, ChevronRight, Store } from 'lucide-react';
import { SupportedStudiosModal } from '@/components/studio/supported-studios-modal';

export const GlobalHeader: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialArea, setInitialArea] = useState<string>('all');

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
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* ロゴ・サービス名 */}
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

          {/* 稼働状況ボタン（クリックで対応スタジオ一覧モーダル表示） */}
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => {
                setInitialArea('all');
                setIsModalOpen(true);
              }}
              className="group flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 hover:border-emerald-500/60 text-slate-300 hover:text-white transition-all shadow-sm hover:shadow-emerald-950/40 cursor-pointer text-left"
              title="クリックして現在対応している16店舗・169部屋のスタジオ一覧を表示"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse group-hover:scale-110 transition-transform flex-shrink-0" />
              <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                <span className="text-slate-400 hidden md:inline">稼働状況:</span>
                <span className="font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                  都内 16店舗 / 169部屋 稼働中
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 group-hover:text-emerald-300 pl-1.5 border-l border-slate-700">
                  <span>一覧を見る</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </button>
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
