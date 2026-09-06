'use client';

import React, { useState } from 'react';
import { NATIVE_ADS, NativeAdItem } from '@/config/native-ads';
import { ExternalLink, Sparkles } from 'lucide-react';

export const NativeAdBanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const currentAd = NATIVE_ADS[activeTab] || NATIVE_ADS[0];

  const getBorderColor = (color: NativeAdItem['accentColor']) => {
    switch (color) {
      case 'cyan': return 'border-cyan-800/60 hover:border-cyan-600/80';
      case 'purple': return 'border-purple-800/60 hover:border-purple-600/80';
      case 'emerald': return 'border-emerald-800/60 hover:border-emerald-600/80';
      case 'amber':
      default: return 'border-amber-800/60 hover:border-amber-600/80';
    }
  };

  const getBadgeColor = (color: NativeAdItem['accentColor']) => {
    switch (color) {
      case 'cyan': return 'bg-cyan-950/90 text-cyan-300 border-cyan-700/60';
      case 'purple': return 'bg-purple-950/90 text-purple-300 border-purple-800/60';
      case 'emerald': return 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60';
      case 'amber':
      default: return 'bg-amber-950/90 text-amber-300 border-amber-800/60';
    }
  };

  const getButtonColor = (color: NativeAdItem['accentColor']) => {
    switch (color) {
      case 'cyan': return 'bg-cyan-500 hover:bg-cyan-400 text-slate-950';
      case 'purple': return 'bg-purple-600 hover:bg-purple-500 text-white';
      case 'emerald': return 'bg-emerald-500 hover:bg-emerald-400 text-slate-950';
      case 'amber':
      default: return 'bg-amber-500 hover:bg-amber-400 text-slate-950';
    }
  };

  return (
    <div className={`bg-slate-900/90 border ${getBorderColor(currentAd.accentColor)} rounded-2xl p-3.5 sm:p-4 transition-all duration-200 shadow-xl overflow-hidden`}>
      {/* 4つのテーマをタブ切り替えできるヘッダー */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-black px-2 py-0.5 rounded border flex items-center gap-1 ${getBadgeColor(currentAd.accentColor)}`}>
            <Sparkles className="w-2.5 h-2.5" />
            <span>{currentAd.badge}</span>
          </span>
          <span className="text-xs font-bold text-slate-300">
            スタジオ利用者向けお役立ちサービス
          </span>
        </div>

        {/* テーマ切り替えピル */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          {NATIVE_ADS.map((ad, idx) => (
            <button
              key={ad.id}
              onClick={() => setActiveTab(idx)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                activeTab === idx
                  ? 'bg-slate-800 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ad.categoryName.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* バナー本文 ＆ CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {currentAd.title}
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1 sm:line-clamp-none">
            {currentAd.tagline}
          </p>
        </div>

        <a
          href={currentAd.ctaUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`h-9 px-4 shrink-0 flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer ${getButtonColor(currentAd.accentColor)}`}
        >
          <span>{currentAd.ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        {currentAd.trackingPixel && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={currentAd.id}
            src={currentAd.trackingPixel}
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
