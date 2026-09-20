'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, SlidersHorizontal, CheckCircle2, ExternalLink, X } from 'lucide-react';

const DISMISS_KEY = 'howToUseDismissed';

const STEPS = [
  {
    icon: Calendar,
    title: '日時を選ぶ',
    desc: '利用日・時間帯・バンド練習/個人練習を指定',
  },
  {
    icon: SlidersHorizontal,
    title: 'エリア・条件を絞る',
    desc: 'エリアや広さ、JC-120/Marshall常設などで絞り込み',
  },
  {
    icon: CheckCircle2,
    title: '空き状況を見比べる',
    desc: '緑=ぴったり空き、青=前後30分ズレの候補',
  },
  {
    icon: ExternalLink,
    title: '公式サイトで予約',
    desc: '気になる部屋をクリックし、公式WEB予約や電話で確定',
  },
];

/**
 * トップの使い方ガイド。一度閉じたらlocalStorageに記憶し、再訪時は出さない
 * （毎回情報過多にならないようにするため）。
 */
export const HowToUseGuide: React.FC = () => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === 'true');
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      // localStorageが使えない環境では単に非表示にするだけ
    }
  };

  if (dismissed) return null;

  return (
    <div className="relative bg-white border border-stone-200 dark:bg-slate-900/70 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="使い方ガイドを閉じる"
        className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-stone-100 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 pr-6">
        SoundSpotの使い方
      </p>
      <p className="text-[11px] text-slate-500 dark:text-slate-500 mb-2.5">
        今日から約3週間先までの空き状況をまとめて比較できます。
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="flex items-start gap-2">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[11px] font-extrabold border border-emerald-200 dark:border-emerald-800">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-200">
                  <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{step.title}</span>
                </div>
                <p className="text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
