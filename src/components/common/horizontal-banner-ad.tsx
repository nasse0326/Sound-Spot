'use client';

import React from 'react';
import { BannerAdItem } from '@/config/banner-ads';

interface HorizontalBannerAdProps {
  ad: BannerAdItem;
}

/** 横長（468x60・320x50等）の画像バナー1点を表示専用で描画する。ローテーション等の
 *  状態は持たず、呼び出し側（下部固定バー）がどの広告を渡すかを決める。
 *  ヘッダー・フッターのテキスト行は持たず、画像自体の左上に小さく「PR」表記を
 *  重ねるだけのミニマルな見た目にする（景品表示法上の広告表示は維持しつつ、
 *  常時表示でも邪魔にならない見た目にするため）。 */
export const HorizontalBannerAd: React.FC<HorizontalBannerAdProps> = ({ ad }) => {
  return (
    <div className="relative inline-flex leading-none">
      <a href={ad.clickUrl} target="_blank" rel="noopener noreferrer sponsored">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.imageUrl}
          width={ad.width}
          height={ad.height}
          alt={ad.advertiserName}
          className="block max-w-full h-auto"
        />
      </a>
      <span className="pointer-events-none absolute top-0.5 left-0.5 text-[8px] font-bold leading-none px-1 py-0.5 rounded bg-black/55 text-white tracking-wide">
        PR
      </span>

      {ad.trackingPixel && (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={ad.id} src={ad.trackingPixel} width={1} height={1} alt="" className="hidden" />
      )}
    </div>
  );
};
