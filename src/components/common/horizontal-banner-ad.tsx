'use client';

import React from 'react';
import { BannerAdItem } from '@/config/banner-ads';

const getBadgeClasses = (color: BannerAdItem['accentColor']) => {
  switch (color) {
    case 'cyan':
      return 'bg-cyan-50 text-cyan-700 border-cyan-300 dark:bg-cyan-950/90 dark:text-cyan-300 dark:border-cyan-700/70';
    case 'purple':
      return 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/90 dark:text-purple-300 dark:border-purple-800/70';
    case 'emerald':
      return 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-700/70';
    case 'amber':
    default:
      return 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/90 dark:text-amber-300 dark:border-amber-800/70';
  }
};

interface HorizontalBannerAdProps {
  ad: BannerAdItem;
}

/** 横長（468x60・320x50等）の画像バナー1点を表示専用で描画する。ローテーション等の
 *  状態は持たず、呼び出し側（固定表示のフィード挿入 / 自動切替のタイムライン枠）が
 *  どの広告を渡すかを決める。 */
export const HorizontalBannerAd: React.FC<HorizontalBannerAdProps> = ({ ad }) => {
  return (
    <div className="bg-white border border-stone-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md dark:shadow-xl">
      <div className="px-3.5 py-2 border-b border-stone-200 dark:border-slate-800/80 bg-stone-50 dark:bg-slate-950/40 flex items-center gap-1.5 min-w-0">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded border shrink-0 ${getBadgeClasses(ad.accentColor)}`}>
          {ad.badge}
        </span>
        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 truncate">{ad.advertiserName}</span>
      </div>

      <div className="flex items-center justify-center bg-stone-100 dark:bg-slate-950/30 p-2">
        <a href={ad.clickUrl} target="_blank" rel="noopener noreferrer sponsored">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ad.imageUrl}
            width={ad.width}
            height={ad.height}
            alt={ad.advertiserName}
            className="rounded-md ring-1 ring-black/10 max-w-full h-auto"
          />
        </a>
      </div>

      <div className="px-3.5 py-1.5">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">広告</span>
      </div>

      {ad.trackingPixel && (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={ad.id} src={ad.trackingPixel} width={1} height={1} alt="" className="hidden" />
      )}
    </div>
  );
};
