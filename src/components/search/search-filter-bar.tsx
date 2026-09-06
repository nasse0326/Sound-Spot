'use client';

import React from 'react';
import { SearchFilterParams, BookingType } from '@/types/studio';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User, 
  SlidersHorizontal, 
  Disc3, 
  Mic2, 
  Volume2, 
  CheckSquare,
  Sparkles
} from 'lucide-react';

interface SearchFilterBarProps {
  filters: SearchFilterParams;
  onChange: (filters: SearchFilterParams) => void;
  availableAreas: string[];
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filters,
  onChange,
  availableAreas,
}) => {
  const handleBookingTypeChange = (type: BookingType) => {
    onChange({ ...filters, bookingType: type });
  };

  // 開始時間変更時に自動的に1時間後を終了時間に設定
  const handleStartTimeChange = (newStartTime: string) => {
    const [hStr, mStr] = newStartTime.split(':');
    const startH = parseInt(hStr, 10);
    const startM = parseInt(mStr, 10);
    const endH = Math.min(24, startH + 1);
    const newEndTime = `${String(endH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
    onChange({
      ...filters,
      startTime: newStartTime,
      endTime: newEndTime,
    });
  };

  const startHourMin = filters.showEarlyMorning ? 6 : 9;
  const hourCount = 24 - startHourMin;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-2xl backdrop-blur-md">
      {/* 上段: バンド練習 vs 個人練習 タブ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 sm:pb-4 mb-3 sm:mb-4 gap-2.5">
        <div className="grid grid-cols-2 sm:flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => handleBookingTypeChange('band')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              filters.bookingType === 'band'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>バンド練習（貸切）</span>
          </button>
          <button
            onClick={() => handleBookingTypeChange('solo')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              filters.bookingType === 'solo'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>個人練習（1〜2名）</span>
          </button>
        </div>

        {filters.bookingType === 'solo' && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 w-fit">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>個人練習は「前日21時解禁」などのルールが適用されます</span>
          </div>
        )}
      </div>

      {/* 中段: 主要検索条件（日付・時間・エリア・広さ） */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 日付 */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            利用日
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onChange({ ...filters, date: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 sm:py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors [color-scheme:dark]"
          />
        </div>

        {/* 時間範囲 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              希望時間帯
            </label>
            {/* 早朝枠表示チェックボックス */}
            <label className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.showEarlyMorning}
                onChange={(e) => {
                  const checked = e.target.checked;
                  let nextStart = filters.startTime;
                  if (!checked && parseInt(nextStart.split(':')[0], 10) < 9) {
                    nextStart = '09:00';
                  }
                  onChange({
                    ...filters,
                    showEarlyMorning: checked,
                    startTime: nextStart,
                    endTime: !checked && parseInt(filters.endTime.split(':')[0], 10) <= 9 ? '10:00' : filters.endTime,
                  });
                }}
                className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-emerald-500"
              />
              <span>🌅 早朝(6〜9時)</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={filters.startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {Array.from({ length: hourCount }).map((_, i) => {
                const hour = String(startHourMin + i).padStart(2, '0');
                return (
                  <React.Fragment key={hour}>
                    <option value={`${hour}:00`}>{hour}:00</option>
                    <option value={`${hour}:30`}>{hour}:30</option>
                  </React.Fragment>
                );
              })}
            </select>
            <select
              value={filters.endTime}
              onChange={(e) => onChange({ ...filters, endTime: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {Array.from({ length: hourCount }).map((_, i) => {
                const hour = String(startHourMin + 1 + i).padStart(2, '0');
                if (parseInt(hour, 10) > 24) return null;
                return (
                  <React.Fragment key={hour}>
                    <option value={`${hour}:00`}>{hour}:00</option>
                    {hour !== '24' && <option value={`${hour}:30`}>{hour}:30</option>}
                  </React.Fragment>
                );
              })}
            </select>
          </div>
          {/* 前後30分の枠も含める（±30分）チェックボックス */}
          <div className="mt-1.5 flex items-center justify-between">
            <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.allowAdjacent30Min}
                onChange={(e) => onChange({ ...filters, allowAdjacent30Min: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-emerald-500"
              />
              <span className={filters.allowAdjacent30Min ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                前後30分の枠も含める (±30分)
              </span>
            </label>
            {filters.allowAdjacent30Min && (
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                ※30分開始スタジオも網羅
              </span>
            )}
          </div>
        </div>

        {/* エリア */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            エリア・主要駅
          </label>
          <select
            value={filters.area}
            onChange={(e) => onChange({ ...filters, area: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">すべてのエリア（東京・千葉）</option>
            {availableAreas.map((area) => (
              <option key={area} value={area}>
                {area} エリア
              </option>
            ))}
          </select>
        </div>

        {/* 部屋の広さ（畳数） */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            最低の広さ（畳数）
          </label>
          <select
            value={filters.minTatami}
            onChange={(e) => onChange({ ...filters, minTatami: Number(e.target.value) })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            <option value={0}>広さ指定なし</option>
            <option value={10}>10帖以上（3〜4人）</option>
            <option value={12}>12帖以上（4〜5人）</option>
            <option value={15}>15帖以上（5〜6人・広々）</option>
            <option value={18}>18帖以上（大編成 / REC）</option>
          </select>
        </div>
      </div>

      {/* 下段: 機材・条件こだわりフィルター（横スクロール/ラップ対応） */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5" />
          絞り込み:
        </span>

        <button
          type="button"
          onClick={() => onChange({ ...filters, requireJc120: !filters.requireJc120 })}
          className={`shrink-0 flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
            filters.requireJc120
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-medium'
              : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          <CheckSquare className={`w-3.5 h-3.5 ${filters.requireJc120 ? 'text-emerald-400' : 'text-slate-600'}`} />
          JC-120必須
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...filters, requireMarshall: !filters.requireMarshall })}
          className={`shrink-0 flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
            filters.requireMarshall
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-medium'
              : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          <CheckSquare className={`w-3.5 h-3.5 ${filters.requireMarshall ? 'text-emerald-400' : 'text-slate-600'}`} />
          Marshall必須
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...filters, requireRecording: !filters.requireRecording })}
          className={`shrink-0 flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
            filters.requireRecording
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-medium'
              : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Mic2 className={`w-3.5 h-3.5 ${filters.requireRecording ? 'text-emerald-400' : 'text-slate-600'}`} />
          セルフレコ対応
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...filters, requireLongHours: !filters.requireLongHours })}
          className={`shrink-0 flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
            filters.requireLongHours
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-medium shadow-sm shadow-cyan-500/20'
              : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${filters.requireLongHours ? 'text-cyan-400' : 'text-slate-600'}`} />
          24h・長時間営業
        </button>
      </div>
    </div>
  );
};
