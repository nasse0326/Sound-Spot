'use client';

import React, { useState, useMemo } from 'react';
import { SearchFilterBar } from '@/components/search/search-filter-bar';
import { StudioCard } from '@/components/search/studio-card';
import { StudioTimelineView } from '@/components/timeline/studio-timeline-view';
import { RoomDetailModal } from '@/components/studio/room-detail-modal';
import { NativeAdCard } from '@/components/search/native-ad-card';
import { NativeAdBanner } from '@/components/timeline/native-ad-banner';
import { NATIVE_ADS } from '@/config/native-ads';
import { getMockRoomsWithSlots, MOCK_STUDIOS } from '@/lib/mock-data';
import { SearchFilterParams, RoomWithSlots } from '@/types/studio';
import { checkRoomAvailability } from '@/lib/slot-utils';
import { format, addDays, nextSaturday, nextSunday } from 'date-fns';
import { 
  LayoutGrid, 
  AlignLeft, 
  Sparkles, 
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  FilterX
} from 'lucide-react';

export default function HomePage() {
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => format(today, 'yyyy-MM-dd'), [today]);
  const maxDateStr = useMemo(() => format(addDays(today, 21), 'yyyy-MM-dd'), [today]);

  // 検索フィルター状態
  const [filters, setFilters] = useState<SearchFilterParams>({
    date: todayStr,
    startTime: '14:00',
    endTime: '15:00',
    bookingType: 'band',
    area: '秋葉原',
    minTatami: 0,
    tatamiRanges: [],
    requireJc120: false,
    requireMarshall: false,
    requireRecording: false,
    showEarlyMorning: false, // デフォルト: 9:00〜24:00表示（早朝OFF）
    requireLongHours: false, // 24時間・長時間営業のみ
    allowAdjacent30Min: true, // 前後30分の枠も含めて検索（デフォルトON）
  });

  const handleFiltersChange = (newFilters: SearchFilterParams) => {
    let date = newFilters.date;
    if (date < todayStr) date = todayStr;
    if (date > maxDateStr) date = maxDateStr;
    setFilters({ ...newFilters, date });
  };

  // ビューモード: 'card' または 'timeline'
  const [viewMode, setViewMode] = useState<'card' | 'timeline'>('card');
  // 満室の部屋を非表示にするか（デフォルト: true）
  const [hideFullyBooked, setHideFullyBooked] = useState<boolean>(true);
  // ソート順: 'standard' | 'availability' | 'priceAsc' | 'sizeDesc'
  const [sortBy, setSortBy] = useState<'standard' | 'availability' | 'priceAsc' | 'sizeDesc'>('standard');

  // 詳細モーダル用
  const [selectedRoom, setSelectedRoom] = useState<RoomWithSlots | null>(null);

  // 利用可能なエリア一覧
  const availableAreas = useMemo(() => {
    return Array.from(new Set(MOCK_STUDIOS.map((s) => s.area)));
  }, []);

  // 選択日時のスロット付き部屋データ
  const allRooms = useMemo(() => {
    return getMockRoomsWithSlots(filters.date);
  }, [filters.date]);

  // フィルタリング処理
  const filteredRooms = useMemo(() => {
    const targetStartH = parseInt(filters.startTime.split(':')[0], 10);
    const targetEndH = parseInt(filters.endTime.split(':')[0], 10);

    return allRooms.filter((room) => {
      // エリア
      if (filters.area !== 'all' && room.studio.area !== filters.area) {
        return false;
      }

      // 広さ（畳数）チェックボックス絞り込み
      if (filters.tatamiRanges && filters.tatamiRanges.length > 0) {
        const matchesRange = filters.tatamiRanges.some((range) => {
          if (range === 'under9') return room.sizeTatami <= 9;
          if (range === '10to12') return room.sizeTatami >= 10 && room.sizeTatami <= 12;
          if (range === '13to15') return room.sizeTatami >= 13 && room.sizeTatami <= 15;
          if (range === '16plus') return room.sizeTatami >= 16;
          return false;
        });
        if (!matchesRange) return false;
      } else if (filters.minTatami > 0 && room.sizeTatami < filters.minTatami) {
        return false;
      }

      // JC-120 必須
      if (filters.requireJc120) {
        const hasJc = room.equipment.guitarAmps.some((amp) => amp.includes('JC-120'));
        if (!hasJc) return false;
      }

      // Marshall 必須
      if (filters.requireMarshall) {
        const hasMarshall = room.equipment.guitarAmps.some((amp) => amp.includes('Marshall'));
        if (!hasMarshall) return false;
      }

      // レコーディング設備
      if (filters.requireRecording && !room.hasRecording) {
        return false;
      }

      // 24時間・長時間営業のみ
      if (filters.requireLongHours) {
        const isLong = room.studio.is24Hours || 
          room.studio.name.includes('ノア') || 
          room.studio.name.includes('ベースオントップ') || 
          room.studio.name.includes('音楽館');
        if (!isLong) return false;
      }

      // 満室の部屋を非表示（確定で満室の部屋のみ除外。未取得や電話受付は表示を維持）
      if (hideFullyBooked) {
        const avail = checkRoomAvailability(room, filters.startTime, filters.endTime, filters.allowAdjacent30Min);
        if (avail.matchType === 'none') {
          return false;
        }
      }

      return true;
    });
  }, [allRooms, filters, hideFullyBooked]);

  // ソート処理
  const sortedRooms = useMemo(() => {
    const list = [...filteredRooms];
    const targetStartH = parseInt(filters.startTime.split(':')[0], 10);
    const dateObj = new Date(filters.date);
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isDaytime = !isWeekend && targetStartH < 18;

    return list.sort((a, b) => {
      // 共通のスタジオ・部屋標準順比較（公式の部屋番号・アルファベット・フロア順）
      const naturalOrder = (a.orderIndex ?? 999) - (b.orderIndex ?? 999);

      if (sortBy === 'standard') {
        return naturalOrder;
      }

      if (sortBy === 'priceAsc') {
        const getEffectivePrice = (room: RoomWithSlots) => {
          if (filters.bookingType === 'solo') return room.pricePerHourSolo;
          return isDaytime ? room.pricePerHourDaytime : room.pricePerHourRegular;
        };
        const diff = getEffectivePrice(a) - getEffectivePrice(b);
        return diff !== 0 ? diff : naturalOrder;
      }

      if (sortBy === 'sizeDesc') {
        const diff = b.sizeTatami - a.sizeTatami;
        return diff !== 0 ? diff : naturalOrder;
      }

      // 'availability': 空き枠優先 (完全一致 > ±30分ズレ > 電話受付 > 未取得 > 満室)
      const aAvail = checkRoomAvailability(a, filters.startTime, filters.endTime, filters.allowAdjacent30Min);
      const bAvail = checkRoomAvailability(b, filters.startTime, filters.endTime, filters.allowAdjacent30Min);

      const getAvailScore = (res: typeof aAvail) => {
        if (res.matchType === 'exact') return 4;
        if (res.matchType === 'early30' || res.matchType === 'late30') return 3;
        if (res.matchType === 'phone_only') return 2;
        if (res.matchType === 'unfetched') return 1;
        return 0; // none (満室)
      };

      const scoreDiff = getAvailScore(bAvail) - getAvailScore(aAvail);
      if (scoreDiff !== 0) return scoreDiff;

      // 空き状況が同じ場合は各スタジオの標準部屋順（1st, 2st... / A, B, C... / 201, 202...）
      return naturalOrder;
    });
  }, [filteredRooms, sortBy, filters.startTime, filters.endTime, filters.bookingType, filters.allowAdjacent30Min]);

  // スタジオ単位で部屋をグループ化（案1: 1スタジオ＝1カード）
  const studioGroups = useMemo(() => {
    const map = new Map<string, { studio: any; rooms: RoomWithSlots[] }>();

    for (const room of sortedRooms) {
      const sId = room.studio.id;
      if (!map.has(sId)) {
        map.set(sId, { studio: room.studio, rooms: [] });
      }
      map.get(sId)!.rooms.push(room);
    }

    return Array.from(map.values());
  }, [sortedRooms]);

  // クイック日付プリセット
  const handleQuickDate = (type: 'today' | 'tomorrow' | 'sat' | 'sun') => {
    const now = new Date();
    let targetDate = now;
    if (type === 'tomorrow') {
      targetDate = addDays(now, 1);
    } else if (type === 'sat') {
      targetDate = nextSaturday(now);
    } else if (type === 'sun') {
      targetDate = nextSunday(now);
    }
    setFilters({ ...filters, date: format(targetDate, 'yyyy-MM-dd') });
  };

  // 対応スタジオ一覧モーダル表示イベント発火
  const handleOpenSupportedStudios = (area?: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('soundspot:open-studios-modal', { detail: { area } }));
    }
  };

  return (
    <div className="space-y-6">
      {/* ヒーローセクション */}
      <div className="text-center sm:text-left py-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          スタジオ空き枠を横断検索
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          指定の日時・エリア・部屋の広さ・常設アンプから、今すぐ予約可能なスタジオを一括比較できます。
        </p>

        {/* クイック日程ボタン & 対応スタジオショートカット */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-medium">ショートカット:</span>
            <button
              onClick={() => handleQuickDate('today')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              今日
            </button>
            <button
              onClick={() => handleQuickDate('tomorrow')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              明日
            </button>
            <button
              onClick={() => handleQuickDate('sat')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              今週末（土）
            </button>
            <button
              onClick={() => handleQuickDate('sun')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              今週末（日）
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenSupportedStudios()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/60 transition cursor-pointer text-xs font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>対応スタジオ一覧 (16店舗) を見る</span>
            <span className="text-[10px] text-emerald-500">↗</span>
          </button>
        </div>
      </div>

      {/* 検索・条件指定バー */}
      <SearchFilterBar
        filters={filters}
        onChange={handleFiltersChange}
        availableAreas={availableAreas}
      />

      {/* 表示切替 & 検索結果数 & ソートバー */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-slate-200">
            検索結果:
          </span>
          <span className="text-base font-extrabold text-emerald-400">
            {sortedRooms.length}
          </span>
          <span className="text-xs text-slate-400">
            部屋が該当（{filters.area === 'all' ? '全エリア' : `${filters.area}エリア`} / {filters.date} {filters.startTime}〜{filters.endTime}
            {hideFullyBooked && ' • 満室除外'}）
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* 満室の部屋を非表示トグル */}
          <button
            type="button"
            onClick={() => setHideFullyBooked(!hideFullyBooked)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              hideFullyBooked
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/80 shadow-sm shadow-emerald-950/40 hover:bg-emerald-900/60'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="指定した時間帯に空きが1つもない部屋の表示・非表示を切り替えます"
          >
            <span className={`w-2 h-2 rounded-full ${hideFullyBooked ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span>{hideFullyBooked ? '満室を非表示中' : '満室も表示中'}</span>
          </button>

          {/* ソートセレクタ */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="standard" className="bg-slate-900">スタジオ・部屋順（公式）</option>
              <option value="availability" className="bg-slate-900">空き枠優先</option>
              <option value="priceAsc" className="bg-slate-900">料金が安い順</option>
              <option value="sizeDesc" className="bg-slate-900">部屋が広い順</option>
            </select>
          </div>

          {/* カード vs タイムライン 切り替え */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'card'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              カード
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              タイムライン
            </button>
          </div>
        </div>
      </div>

      {/* 検索結果コンテンツ */}
      {sortedRooms.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center">
          <FilterX className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">条件に合致するスタジオが見つかりませんでした</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            エリアの絞り込みを解除するか、機材条件（JC-120、Marshall等）の指定を緩めて再度お試しください。
          </p>
          <button
            onClick={() => setFilters({
              ...filters,
              area: 'all',
              minTatami: 0,
              requireJc120: false,
              requireMarshall: false,
              requireRecording: false,
            })}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            フィルター条件をリセット
          </button>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {studioGroups.map((group, index) => (
            <React.Fragment key={group.studio.id}>
              <StudioCard
                studioGroup={group}
                bookingType={filters.bookingType}
                targetDate={filters.date}
                targetStartTime={filters.startTime}
                targetEndTime={filters.endTime}
                allowAdjacent30Min={filters.allowAdjacent30Min}
                onOpenDetail={setSelectedRoom}
              />
              {/* 4スタジオごとにネイティブPRカードを自然に挿入 */}
              {(index + 1) % 4 === 0 && (
                <NativeAdCard ad={NATIVE_ADS[Math.floor(index / 4) % NATIVE_ADS.length]} />
              )}
            </React.Fragment>
          ))}
          {/* スタジオ数が4件未満の場合でも、末尾に1つ自然に提案 */}
          {studioGroups.length > 0 && studioGroups.length < 4 && (
            <NativeAdCard ad={NATIVE_ADS[0]} />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <StudioTimelineView
            rooms={sortedRooms}
            bookingType={filters.bookingType}
            showEarlyMorning={filters.showEarlyMorning}
            onToggleEarlyMorning={(show) => setFilters({ ...filters, showEarlyMorning: show })}
            targetStartTime={filters.startTime}
            targetEndTime={filters.endTime}
            allowAdjacent30Min={filters.allowAdjacent30Min}
            onSelectTime={(startTime, endTime) => setFilters({ ...filters, startTime, endTime })}
            onOpenDetail={setSelectedRoom}
          />
          <NativeAdBanner />
        </div>
      )}

      {/* 部屋詳細モーダル */}
      <RoomDetailModal
        room={selectedRoom}
        bookingType={filters.bookingType}
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  );
}
