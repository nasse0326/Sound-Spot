'use client';

import React, { useEffect, useState } from 'react';
import { HORIZONTAL_BANNER_ADS } from '@/config/banner-ads';
import { HorizontalBannerAd } from '@/components/common/horizontal-banner-ad';

/** スマホのタイムライン表示下部に置く横長バナー。手動タブ切り替えUIは持たず、
 *  一定間隔で自動的に次の広告へ切り替わるだけのシンプルな表示にする
 *  （利用者がわざわざ手動で広告を切り替えることはしないため）。 */
export const MobileHorizontalAdBanner: React.FC = () => {
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

  return <HorizontalBannerAd ad={ad} />;
};
