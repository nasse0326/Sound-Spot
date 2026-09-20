'use client';

import React, { useEffect, useState } from 'react';
import { HORIZONTAL_BANNER_ADS } from '@/config/banner-ads';
import { HorizontalBannerAd } from './horizontal-banner-ad';

/** 画面下部に常時固定表示する横長バナー広告（スマホ専用）。PCは右サイドバーの
 *  バナー2枠に一本化するため、ここはlg以上の画面幅では表示しない。
 *  フィード内やタイムライン下部の個別広告枠は持たず、8秒おきに自動で
 *  広告主を切り替える（手動切り替えUIは持たない）。 */
export const FixedBottomAdBanner: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (HORIZONTAL_BANNER_ADS.length < 2) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HORIZONTAL_BANNER_ADS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const ad = HORIZONTAL_BANNER_ADS[activeIdx] || HORIZONTAL_BANNER_ADS[0];
  if (!ad) return null;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-stone-200 dark:border-slate-800 py-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.45)]">
      <HorizontalBannerAd ad={ad} />
    </div>
  );
};
