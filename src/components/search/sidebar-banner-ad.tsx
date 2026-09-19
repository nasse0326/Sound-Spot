'use client';

import React, { useEffect, useState } from 'react';
import { SIDEBAR_ROTATION_ADS, BannerAdItem } from '@/config/banner-ads';

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

interface SidebarBannerAdProps {
  /** ローテーション開始位置。複数枠を並べる際にずらして渡すことで同時に同じ広告主が
   *  重複表示されないようにする。 */
  startIndex?: number;
}

export const SidebarBannerAd: React.FC<SidebarBannerAdProps> = ({ startIndex = 0 }) => {
  const [activeIdx, setActiveIdx] = useState(startIndex);
  const ad = SIDEBAR_ROTATION_ADS[activeIdx] || SIDEBAR_ROTATION_ADS[0];

  // 8秒おきに次の広告主へ自動ローテーション
  useEffect(() => {
    if (SIDEBAR_ROTATION_ADS.length < 2) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SIDEBAR_ROTATION_ADS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  if (!ad) return null;

  return (
    <div className="bg-white border border-stone-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md dark:shadow-xl">
      <div className="px-3.5 py-2.5 border-b border-stone-200 dark:border-slate-800/80 bg-stone-50 dark:bg-slate-950/40 flex items-center gap-1.5 min-w-0">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded border shrink-0 ${getBadgeClasses(ad.accentColor)}`}>
          {ad.badge}
        </span>
        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 truncate">{ad.advertiserName}</span>
      </div>

      <div className="flex items-center justify-center bg-stone-100 dark:bg-slate-950/30 p-3">
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

      <div className="px-3.5 py-2 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">広告</span>
        {SIDEBAR_ROTATION_ADS.length > 1 && (
          <div className="flex items-center gap-1">
            {SIDEBAR_ROTATION_ADS.map((a, idx) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                aria-label={a.advertiserName}
                className={`w-1.5 h-1.5 rounded-full transition cursor-pointer ${
                  idx === activeIdx ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-stone-300 hover:bg-stone-400 dark:bg-slate-700 dark:hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {ad.trackingPixel && (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={ad.id} src={ad.trackingPixel} width={1} height={1} alt="" className="hidden" />
      )}
    </div>
  );
};
