'use client';

import React from 'react';
import { NativeAdItem } from '@/config/native-ads';
import { ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

interface NativeAdCardProps {
  ad: NativeAdItem;
}

export const NativeAdCard: React.FC<NativeAdCardProps> = ({ ad }) => {
  const getThemeClasses = () => {
    switch (ad.accentColor) {
      case 'cyan':
        return {
          border: 'border-cyan-300 hover:border-cyan-400 dark:border-cyan-800/60 dark:hover:border-cyan-600/80',
          badge: 'bg-cyan-50 text-cyan-700 border-cyan-300 dark:bg-cyan-950/90 dark:text-cyan-300 dark:border-cyan-700/70',
          dot: 'text-cyan-600 dark:text-cyan-400',
          button: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 shadow-cyan-500/10',
        };
      case 'purple':
        return {
          border: 'border-purple-300 hover:border-purple-400 dark:border-purple-800/60 dark:hover:border-purple-600/80',
          badge: 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/90 dark:text-purple-300 dark:border-purple-800/70',
          dot: 'text-purple-600 dark:text-purple-400',
          button: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-purple-500/10',
        };
      case 'emerald':
        return {
          border: 'border-emerald-300 hover:border-emerald-400 dark:border-emerald-800/60 dark:hover:border-emerald-600/80',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-700/70',
          dot: 'text-emerald-600 dark:text-emerald-400',
          button: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-emerald-500/10',
        };
      case 'amber':
      default:
        return {
          border: 'border-amber-300 hover:border-amber-400 dark:border-amber-800/60 dark:hover:border-amber-600/80',
          badge: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/90 dark:text-amber-300 dark:border-amber-800/70',
          dot: 'text-amber-600 dark:text-amber-400',
          button: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/10',
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className={`bg-white dark:bg-slate-900 border ${theme.border} rounded-2xl shadow-md dark:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between group`}>
      {/* 1. ヘッダー（PRバッジ ＆ 提供元 ＆ タイトル） */}
      <div className="p-3.5 sm:p-5 pb-3 sm:pb-4 border-b border-stone-200 dark:border-slate-800/80 bg-stone-50 dark:bg-slate-950/40">
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded border flex items-center gap-1 shadow-sm ${theme.badge}`}>
                <Sparkles className="w-2.5 h-2.5" />
                <span>{ad.badge}</span>
              </span>

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-stone-300 dark:bg-slate-800/90 dark:text-slate-300 dark:border-slate-700">
                {ad.categoryName}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
              {ad.title}
            </h3>

            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              {ad.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 特徴リスト（StudioCardの部屋行と同じコンパクト行デザイン） */}
      <div className="p-3 sm:p-4 divide-y divide-stone-200 dark:divide-slate-800/50 flex-1 bg-white dark:bg-slate-950/20">
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2.5 leading-relaxed">
          {ad.description}
        </p>

        <div className="space-y-2 pt-2">
          {ad.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${theme.dot}`} />
              <div className="min-w-0 flex-1">
                <span className="font-bold text-slate-700 dark:text-slate-200 mr-1.5 text-[11px] sm:text-xs">
                  {feat.label}:
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs">
                  {feat.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 最下部CTAボタン（親指でタップしやすいh-11） */}
      <div className="p-2.5 sm:p-3 bg-stone-50 dark:bg-slate-950/60 border-t border-stone-200 dark:border-slate-800/80">
        <a
          href={ad.ctaUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`w-full h-11 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer ${theme.button}`}
        >
          <span>{ad.ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        {ad.trackingPixel && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.trackingPixel}
            width={1}
            height={1}
            alt=""
            className="hidden"
          />
        )}
      </div>
    </div>
  );
};
