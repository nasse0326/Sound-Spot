'use client';

import React from 'react';
import { BannerAdItem } from '@/config/banner-ads';

const getBadgeClasses = (color: BannerAdItem['accentColor']) => {
  switch (color) {
    case 'cyan':
      return 'bg-cyan-950/90 text-cyan-300 border-cyan-700/70';
    case 'purple':
      return 'bg-purple-950/90 text-purple-300 border-purple-800/70';
    case 'emerald':
      return 'bg-emerald-950/90 text-emerald-300 border-emerald-700/70';
    case 'amber':
    default:
      return 'bg-amber-950/90 text-amber-300 border-amber-800/70';
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="px-3.5 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 min-w-0">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded border shrink-0 ${getBadgeClasses(ad.accentColor)}`}>
          {ad.badge}
        </span>
        <span className="text-[10px] font-semibold text-slate-300 truncate">{ad.advertiserName}</span>
      </div>

      <div className="flex items-center justify-center bg-slate-950/30 p-2">
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
        <span className="text-[10px] text-slate-500">広告</span>
      </div>

      {ad.trackingPixel && (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={ad.id} src={ad.trackingPixel} width={1} height={1} alt="" className="hidden" />
      )}
    </div>
  );
};
