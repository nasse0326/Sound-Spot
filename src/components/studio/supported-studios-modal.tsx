'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Search, 
  ExternalLink, 
  Phone, 
  Clock, 
  MapPin, 
  Radio, 
  ShieldCheck, 
  Zap, 
  Layers, 
  CheckCircle2,
  Building2,
  Sparkles
} from 'lucide-react';
import { SUPPORTED_STUDIOS, SupportedStudio } from '@/config/supported-studios';

interface SupportedStudiosModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialArea?: string;
}

export const SupportedStudiosModal: React.FC<SupportedStudiosModalProps> = ({
  isOpen,
  onClose,
  initialArea = 'all',
}) => {
  const [selectedArea, setSelectedArea] = useState<string>(initialArea);
  const [selectedSyncType, setSelectedSyncType] = useState<'all' | 'web' | 'phone'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // キーボードEscapeで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // initialAreaが変わったら反映
  useEffect(() => {
    if (isOpen && initialArea !== 'all') {
      setSelectedArea(initialArea);
    }
  }, [isOpen, initialArea]);

  // フィルタリング処理
  const filteredStudios = useMemo(() => {
    return SUPPORTED_STUDIOS.filter((st) => {
      // エリアフィルター
      if (selectedArea !== 'all' && st.area !== selectedArea) {
        return false;
      }
      // 予約同期種別フィルター
      if (selectedSyncType === 'web' && st.syncType === 'phone') {
        return false;
      }
      if (selectedSyncType === 'phone' && st.syncType !== 'phone') {
        return false;
      }
      // キーワード検索（スタジオ名、チェーン名、最寄り駅、住所）
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = st.name.toLowerCase().includes(q);
        const matchChain = st.chainName.toLowerCase().includes(q);
        const matchStation = st.nearestStation.toLowerCase().includes(q);
        const matchArea = st.area.toLowerCase().includes(q);
        const matchFeatures = st.features.some(f => f.toLowerCase().includes(q));
        if (!matchName && !matchChain && !matchStation && !matchArea && !matchFeatures) {
          return false;
        }
      }
      return true;
    });
  }, [selectedArea, selectedSyncType, searchQuery]);

  // エリアごとの店舗数
  const areaCounts = useMemo(() => {
    const counts = { all: SUPPORTED_STUDIOS.length, '渋谷': 0, '新宿': 0, '秋葉原': 0 };
    SUPPORTED_STUDIOS.forEach((st) => {
      if (st.area in counts) {
        counts[st.area as keyof typeof counts]++;
      }
    });
    return counts;
  }, []);

  // 総部屋数
  const totalRooms = useMemo(() => {
    return SUPPORTED_STUDIOS.reduce((acc, st) => acc + st.roomCount, 0);
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* モーダルヘッダー */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-950/60 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                  稼働中スタジオ
                </span>
                <span className="text-xs text-slate-400">
                  都内3大エリア・計16店舗 / {totalRooms}部屋 実データ対応
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                SoundSpot 対応スタジオ一覧
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                各スタジオの公式予約システムおよびカレンダーと連携し、リアルタイム空き状況・常設機材・料金を横断比較できます。
              </p>
            </div>

            {/* 閉じるボタン */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition flex-shrink-0 cursor-pointer"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* サマリーカード */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-center">
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5">
              <span className="text-[11px] text-slate-400 font-medium">対応エリア</span>
              <p className="text-base font-extrabold text-white mt-0.5">3 エリア</p>
              <span className="text-[10px] text-slate-500">渋谷・新宿・秋葉原</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5">
              <span className="text-[11px] text-slate-400 font-medium">対応スタジオ数</span>
              <p className="text-base font-extrabold text-emerald-400 mt-0.5">16 店舗</p>
              <span className="text-[10px] text-slate-500">渋 8 / 新 4 / 秋 4</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5">
              <span className="text-[11px] text-slate-400 font-medium">対応部屋総数</span>
              <p className="text-base font-extrabold text-teal-300 mt-0.5">{totalRooms} 部屋</p>
              <span className="text-[10px] text-slate-500">8〜50帖・ゲネプロ対応</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5">
              <span className="text-[11px] text-slate-400 font-medium">予約連携仕様</span>
              <p className="text-base font-extrabold text-cyan-300 mt-0.5">10店 Web / 6店 電話</p>
              <span className="text-[10px] text-slate-500">公式API・公開枠・tel:</span>
            </div>
          </div>

          {/* フィルター＆検索バー */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
            {/* エリアタブ */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedArea('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                  selectedArea === 'all'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                すべて ({areaCounts.all})
              </button>
              <button
                type="button"
                onClick={() => setSelectedArea('渋谷')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                  selectedArea === '渋谷'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                渋谷 ({areaCounts['渋谷']})
              </button>
              <button
                type="button"
                onClick={() => setSelectedArea('新宿')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                  selectedArea === '新宿'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                新宿 ({areaCounts['新宿']})
              </button>
              <button
                type="button"
                onClick={() => setSelectedArea('秋葉原')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                  selectedArea === '秋葉原'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                秋葉原 ({areaCounts['秋葉原']})
              </button>
            </div>

            {/* 検索入力 */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="店舗名・駅・アンプで絞り込み..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/70"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* スタジオ一覧スクロールエリア */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {filteredStudios.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Building2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">該当するスタジオが見つかりませんでした。</p>
              <button
                onClick={() => { setSelectedArea('all'); setSelectedSyncType('all'); setSearchQuery(''); }}
                className="mt-3 text-xs text-emerald-400 hover:underline"
              >
                条件をリセットする
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredStudios.map((studio) => (
                <div 
                  key={studio.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 transition-all hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    {/* 上段バッジ群 */}
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-slate-800 text-slate-300 border border-slate-700/60">
                          {studio.chainName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800/80 text-emerald-400 border border-emerald-800/40">
                          {studio.area}
                        </span>
                        {studio.is24Hours && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                            24h
                          </span>
                        )}
                      </div>

                      {/* 同期ステータスバッジ */}
                      {studio.syncType === 'phone' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800/60 flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          電話予約
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-emerald-400" />
                          リアルタイムWeb同期
                        </span>
                      )}
                    </div>

                    {/* スタジオ名 */}
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {studio.name}
                    </h3>

                    {/* 最寄り駅・部屋数 */}
                    <div className="mt-2 space-y-1 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span>{studio.nearestStation}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span className="font-medium text-slate-300">全 {studio.roomCount} 部屋</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-400">{studio.systemName}</span>
                      </div>
                    </div>

                    {/* 特徴タグ */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {studio.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">
                      {studio.businessHours}
                    </span>
                    <div className="flex items-center gap-2">
                      {studio.syncType === 'phone' ? (
                        <a
                          href={`tel:${studio.tel}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
                        >
                          <Phone className="w-3 h-3" />
                          電話予約
                        </a>
                      ) : null}
                      <a
                        href={studio.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                      >
                        公式HP
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* モーダルフッター（安心・同期ポリシー説明） */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <p className="leading-snug">
              各スタジオ公式システムと定時自動巡回（深夜完全睡眠・Jitter安全制御）で連携。予約確定は公式Webまたは電話で行われます。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer flex-shrink-0"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
