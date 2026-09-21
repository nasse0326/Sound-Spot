'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { SearchFilterBar } from '@/components/search/search-filter-bar';
import { StudioCard } from '@/components/search/studio-card';
import { StudioTimelineView } from '@/components/timeline/studio-timeline-view';
import { RoomDetailModal } from '@/components/studio/room-detail-modal';
import { SidebarBannerAd } from '@/components/search/sidebar-banner-ad';
import { HowToUseGuide } from '@/components/common/how-to-use-guide';
import { SUPPORTED_STUDIOS } from '@/config/supported-studios';
import { SearchFilterParams, RoomWithSlots } from '@/types/studio';
import { checkRoomAvailability, naturalCompareRoomNames, isPhoneOnlyStudio, AREA_DISPLAY_ORDER } from '@/lib/slot-utils';
import { CRAWL_DAY_COUNT } from '@/config/crawl-schedule';
import { TEMP_HIDDEN_STUDIO_NAMES } from '@/config/hidden-studios';
import { format, addDays, nextSaturday, nextSunday } from 'date-fns';
import {
  AlignLeft,
  List,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  FilterX
} from 'lucide-react';

export default function HomePage() {
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => format(today, 'yyyy-MM-dd'), [today]);
  // CRAWL_DAY_COUNTは「今日を含めてN日分」を表す（クローラーは今日〜今日+(N-1)日目を取得）。
  // ピッカーの上限は実際にクロールされる最終日と一致させる必要があるためN-1日後とする。
  const maxDateStr = useMemo(() => format(addDays(today, CRAWL_DAY_COUNT - 1), 'yyyy-MM-dd'), [today]);

  // 検索フィルター状態
  const [filters, setFilters] = useState<SearchFilterParams>({
    date: todayStr,
    startTime: '14:00',
    endTime: '15:00',
    bookingType: 'band',
    area: '秋葉原',
    areas: ['秋葉原'],
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
    return Array.from(new Set(SUPPORTED_STUDIOS.map((s) => s.area)));
  }, []);

  // 選択日時のスロット付き部屋データ。ローカルJSONフォールバック層は撤去済み
  // （2026-09-21）で、Supabaseが唯一のデータソース。/api/studiosのフェッチが
  // 完了するまでは空のまま。
  const [liveRooms, setLiveRooms] = useState<RoomWithSlots[]>([]);
  // 初回フェッチ未完了か（「0件ヒット」表示と区別するためのローディング表示用）
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  // /api/studios (Supabase) から空き枠データを取得
  useEffect(() => {
    let isMounted = true;
    const fetchLiveRooms = async () => {
      try {
        const res = await fetch(`/api/studios?date=${encodeURIComponent(filters.date)}&area=all`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.data && Array.isArray(json.data)) {
            setLiveRooms(json.data);
          }
        }
      } catch (e) {
        // 取得失敗時は空のまま（UI側で「0件」と区別できるようisLoadingRoomsで制御）
      } finally {
        if (isMounted) setIsLoadingRooms(false);
      }
    };
    fetchLiveRooms();
    return () => {
      isMounted = false;
    };
  }, [filters.date]);

  // 会員登録待ち等で一時非表示にしたいスタジオを、データソース（モック初期描画/
  // Supabase取得後どちらでも）問わずここで一律に除外する
  const allRooms = useMemo(
    () => liveRooms.filter((room) => !TEMP_HIDDEN_STUDIO_NAMES.includes(room.studio.name)),
    [liveRooms]
  );

  // フィルタリング処理
  const filteredRooms = useMemo(() => {
    const targetStartH = parseInt(filters.startTime.split(':')[0], 10);
    const targetEndH = parseInt(filters.endTime.split(':')[0], 10);

    return allRooms.filter((room) => {
      // エリア（複数選択チェックボックス対応）
      if (filters.areas && filters.areas.length > 0) {
        if (!filters.areas.includes(room.studio.area)) {
          return false;
        }
      } else if (filters.area && filters.area !== 'all' && room.studio.area !== filters.area) {
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
      // 共通のスタジオ・部屋標準順比較（部屋名のA~Z・0~9を自然順ソート。
      // 各店舗の命名規則はバラバラだが、公式サイト上の掲載順もアルファベット・数字の
      // 昇順であることが多いため、orderIndex（登録順の連番）ではなく部屋名自体を比較する）
      const naturalOrder = naturalCompareRoomNames(a.name, b.name) || ((a.orderIndex ?? 999) - (b.orderIndex ?? 999));

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

  // スタジオごとの部屋総数（現在の絞り込み条件に左右されないよう、日付以外の
  // フィルタを適用する前のallRoomsから算出。サイズ/機材/満室非表示等の絞り込みで
  // カードの並び順がガタガタ変わらないようにするため）
  const studioRoomCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const room of allRooms) {
      counts.set(room.studio.id, (counts.get(room.studio.id) ?? 0) + 1);
    }
    return counts;
  }, [allRooms]);

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

    const groups = Array.from(map.values());

    // 標準順（sortBy === 'standard'）の時だけ、エリア→そのエリア内の部屋数が多い順に
    // スタジオカードを並べ替える。価格・広さ・空き枠優先ソートの時は、部屋単位の
    // 並び替え結果をそのままスタジオの並びにも反映させたいので触らない。
    if (sortBy === 'standard') {
      groups.sort((a, b) => {
        const areaDiff = AREA_DISPLAY_ORDER.indexOf(a.studio.area) - AREA_DISPLAY_ORDER.indexOf(b.studio.area);
        if (areaDiff !== 0) return areaDiff;
        // 電話予約のみでリアルタイム空き状況を取得できない店舗（ペンタ系等）は、
        // そのエリア内では常に一番下に沈める（一覧の主目的である「空き状況比較」に
        // 寄与しないため、実際に比較できる店舗を優先して見せたいという要望）
        const aPhoneOnly = isPhoneOnlyStudio(a.studio) ? 1 : 0;
        const bPhoneOnly = isPhoneOnlyStudio(b.studio) ? 1 : 0;
        if (aPhoneOnly !== bPhoneOnly) return aPhoneOnly - bPhoneOnly;
        const countDiff = (studioRoomCounts.get(b.studio.id) ?? 0) - (studioRoomCounts.get(a.studio.id) ?? 0);
        if (countDiff !== 0) return countDiff;
        return a.studio.id.localeCompare(b.studio.id);
      });
    }

    return groups;
  }, [sortedRooms, sortBy, studioRoomCounts]);

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
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          スタジオ空き枠を横断検索
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          指定の日時・エリア・部屋の広さ・常設アンプから、今すぐ予約可能なスタジオを一括比較できます。
        </p>

        {/* クイック日程ボタン & 対応スタジオショートカット */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 dark:text-slate-500 font-medium">ショートカット:</span>
            <button
              onClick={() => handleQuickDate('today')}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            >
              今日
            </button>
            <button
              onClick={() => handleQuickDate('tomorrow')}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            >
              明日
            </button>
            <button
              onClick={() => handleQuickDate('sat')}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            >
              今週末（土）
            </button>
            <button
              onClick={() => handleQuickDate('sun')}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            >
              今週末（日）
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenSupportedStudios()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 transition cursor-pointer text-xs font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            <span>対応スタジオ一覧 ({SUPPORTED_STUDIOS.length}店舗) を見る</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-500">↗</span>
          </button>
        </div>
      </div>

      {/* 使い方ガイド（一度閉じると再訪時は非表示） */}
      <HowToUseGuide />

      {/* 検索・条件指定バー */}
      <SearchFilterBar
        filters={filters}
        onChange={handleFiltersChange}
        availableAreas={availableAreas}
      />

      {/* 表示切替 & 検索結果数 & ソートバー */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            検索結果:
          </span>
          <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
            {sortedRooms.length}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
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
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm hover:bg-emerald-100 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-700/80 dark:shadow-emerald-950/40 dark:hover:bg-emerald-900/60'
                : 'bg-white text-slate-500 border-stone-200 hover:text-slate-700 hover:border-stone-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:text-slate-200 dark:hover:border-slate-700'
            }`}
            title="指定した時間帯に空きが1つもない部屋の表示・非表示を切り替えます"
          >
            <span className={`w-2 h-2 rounded-full ${hideFullyBooked ? 'bg-emerald-600 dark:bg-emerald-400 animate-pulse' : 'bg-stone-300 dark:bg-slate-600'}`} />
            <span>{hideFullyBooked ? '満室を非表示中' : '満室も表示中'}</span>
          </button>

          {/* ソートセレクタ */}
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="standard" className="bg-white dark:bg-slate-900">スタジオ・部屋順（公式）</option>
              <option value="availability" className="bg-white dark:bg-slate-900">空き枠優先</option>
              <option value="priceAsc" className="bg-white dark:bg-slate-900">料金が安い順</option>
              <option value="sizeDesc" className="bg-white dark:bg-slate-900">部屋が広い順</option>
            </select>
          </div>

          {/* リスト vs タイムライン 切り替え */}
          <div className="flex bg-white p-1 rounded-xl border border-stone-200 dark:bg-slate-900 dark:border-slate-800">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'card'
                  ? 'bg-stone-100 text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              リスト
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-stone-100 text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              タイムライン
            </button>
          </div>
        </div>
      </div>

      {/* 検索結果コンテンツ */}
      {isLoadingRooms && sortedRooms.length === 0 ? (
        <div className="bg-white/70 border border-stone-200 dark:bg-slate-900/50 dark:border-slate-800/80 rounded-2xl p-12 text-center">
          <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">空き状況を取得中です…</h3>
        </div>
      ) : sortedRooms.length === 0 ? (
        <div className="bg-white/70 border border-stone-200 dark:bg-slate-900/50 dark:border-slate-800/80 rounded-2xl p-12 text-center">
          <FilterX className="w-12 h-12 text-stone-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">条件に合致するスタジオが見つかりませんでした</h3>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1 max-w-md mx-auto">
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
            className="mt-4 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            フィルター条件をリセット
          </button>
        </div>
      ) : viewMode === 'card' ? (
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* スタジオごとに部屋数が大きく異なる（4〜21室）ため、2カラムで隣同士の高さを
              揃えようとすると常にどちらかが間延びして見えていた。1カラムの縦積みに統一。
              PC(lg+)ではバナー広告レールを右端に固定し、リスト側はmax-w-noneでその手前まで
              目一杯広げる（モバイル/タブレットはサイドバーが無いのでmax-w-2xlのまま維持）。 */}
          <div className="flex-1 min-w-0 w-full max-w-2xl lg:max-w-none mx-auto lg:mx-0 space-y-4">
            {studioGroups.map((group) => (
              <StudioCard
                key={group.studio.id}
                studioGroup={group}
                bookingType={filters.bookingType}
                targetDate={filters.date}
                targetStartTime={filters.startTime}
                targetEndTime={filters.endTime}
                allowAdjacent30Min={filters.allowAdjacent30Min}
                onOpenDetail={setSelectedRoom}
              />
            ))}
          </div>

          {/* PCのみ: 余った横幅にバナー広告レール2枠（スクロール追従・それぞれ独立ローテーション） */}
          <aside className="hidden lg:block w-[320px] shrink-0 sticky top-6 space-y-4">
            <SidebarBannerAd startIndex={0} />
            <SidebarBannerAd startIndex={1} />
          </aside>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* リスト表示と同様、PC(lg+)では右端にバナー広告レールを固定する */}
          <div className="flex-1 min-w-0 w-full space-y-4">
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
          </div>

          {/* PCのみ: リスト表示と同じバナー広告レール2枠 */}
          <aside className="hidden lg:block w-[320px] shrink-0 sticky top-6 space-y-4">
            <SidebarBannerAd startIndex={0} />
            <SidebarBannerAd startIndex={1} />
          </aside>
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
