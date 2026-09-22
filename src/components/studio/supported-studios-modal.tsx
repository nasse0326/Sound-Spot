'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Building2,
  ChevronDown,
  ChevronUp,
  Music,
  Disc3,
  Volume2,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { SUPPORTED_STUDIOS, SupportedStudio } from '@/config/supported-studios';
import { RoomWithSlots } from '@/types/studio';
import { RoomDetailModal } from './room-detail-modal';
import { format } from 'date-fns';

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
  // 展開中のスタジオIDセット（アコーディオン）
  const [expandedStudioIds, setExpandedStudioIds] = useState<Set<string>>(new Set());
  // 詳細表示する部屋
  const [detailRoom, setDetailRoom] = useState<RoomWithSlots | null>(null);

  // エリアタブの横スクロール発見性向上用（下北沢等が画面外にあることに気づけないため、
  // まだ続きがある側にだけフェードを出す）
  const areaTabsRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateAreaTabsFade = () => {
    const el = areaTabsRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 4);
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  // 本日の日付基準で全店舗の部屋・機材スペックを取得。ローカルJSONフォールバック層は
  // 撤去済み（2026-09-21）で、Supabaseが唯一のデータソース。常時マウントされる
  // グローバルヘッダーの一部のため、このモーダルが実際に開かれたタイミングでのみ
  // /api/studiosをフェッチする（開くたびの再フェッチは避け、初回のみ取得）。
  const todayStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  const [allRooms, setAllRooms] = useState<RoomWithSlots[]>([]);
  const hasFetchedRoomsRef = useRef(false);
  useEffect(() => {
    if (!isOpen || hasFetchedRoomsRef.current) return;
    hasFetchedRoomsRef.current = true;
    let isMounted = true;
    fetch(`/api/studios?date=${encodeURIComponent(todayStr)}&area=all`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (isMounted && json?.data && Array.isArray(json.data)) {
          setAllRooms(json.data);
        }
      })
      .catch(() => {
        hasFetchedRoomsRef.current = false; // 失敗時は次に開いた時に再試行できるようにする
      });
    return () => {
      isMounted = false;
    };
  }, [isOpen, todayStr]);

  // スタジオ名ごとの部屋マッピング。/api/studios（Supabase）が返すstudio.idは
  // toUUID(slug)済みのUUIDである一方、SUPPORTED_STUDIOSのidは元のslugのままで
  // 直接は一致しないため、両者に共通するstudio名をキーにする。
  const roomsByStudioId = useMemo(() => {
    const map = new Map<string, RoomWithSlots[]>();
    for (const room of allRooms) {
      const sId = room.studio.name;
      if (!map.has(sId)) {
        map.set(sId, []);
      }
      map.get(sId)!.push(room);
    }
    return map;
  }, [allRooms]);

  // キーボードEscapeで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (detailRoom) {
          setDetailRoom(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, detailRoom]);

  // initialAreaが変わったら反映
  useEffect(() => {
    if (isOpen && initialArea !== 'all') {
      setSelectedArea(initialArea);
    }
  }, [isOpen, initialArea]);

  // モーダルを開いた直後・リサイズ時にエリアタブのフェード表示を再計算
  useEffect(() => {
    if (!isOpen) return;
    // モーダルのマウント直後はまだレイアウト確定前のことがあるため次フレームで計測
    const raf = requestAnimationFrame(updateAreaTabsFade);
    window.addEventListener('resize', updateAreaTabsFade);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateAreaTabsFade);
    };
  }, [isOpen]);

  // フィルタリング処理（店舗名・駅名・エリア・常設機材名での検索に対応）
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
      // キーワード検索（スタジオ名、チェーン名、最寄り駅、住所、特徴、および常設機材名）
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = st.name.toLowerCase().includes(q);
        const matchChain = st.chainName.toLowerCase().includes(q);
        const matchStation = st.nearestStation.toLowerCase().includes(q);
        const matchArea = st.area.toLowerCase().includes(q);
        const matchFeatures = st.features.some(f => f.toLowerCase().includes(q));

        // 所属部屋の機材（JC-120, Marshall, Ampeg, ドラム等）にヒットするか判定
        const rooms = roomsByStudioId.get(st.name) || [];
        const matchEquipment = rooms.some(r => {
          const roomNameMatch = r.name.toLowerCase().includes(q);
          const eq = r.equipment;
          if (!eq) return roomNameMatch;
          const guitarMatch = eq.guitarAmps.some(a => a.toLowerCase().includes(q));
          const bassMatch = eq.bassAmp?.toLowerCase().includes(q);
          const drumMatch = eq.drumSet?.toLowerCase().includes(q);
          const keyMatch = eq.keyboards?.some(k => k.toLowerCase().includes(q));
          return roomNameMatch || guitarMatch || bassMatch || drumMatch || keyMatch;
        });

        if (!matchName && !matchChain && !matchStation && !matchArea && !matchFeatures && !matchEquipment) {
          return false;
        }
      }
      return true;
    });
  }, [selectedArea, selectedSyncType, searchQuery, roomsByStudioId]);

  // エリアごとの店舗数
  const areaCounts = useMemo(() => {
    const counts = { all: SUPPORTED_STUDIOS.length, '渋谷': 0, '新宿': 0, '秋葉原・上野': 0, '高田馬場': 0, '池袋': 0, '下北沢': 0, '吉祥寺': 0, '高円寺': 0, '船橋': 0, '横浜': 0, '亀戸・小岩': 0, '松戸・柏': 0, '町田': 0 };
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

  // 予約連携仕様の内訳（Web連携 vs 電話予約）
  const webSyncCount = useMemo(() => SUPPORTED_STUDIOS.filter((st) => st.syncType !== 'phone').length, []);
  const phoneSyncCount = SUPPORTED_STUDIOS.length - webSyncCount;

  // アコーディオンのトグル
  const toggleExpand = (studioId: string) => {
    setExpandedStudioIds(prev => {
      const next = new Set(prev);
      if (next.has(studioId)) {
        next.delete(studioId);
      } else {
        next.add(studioId);
      }
      return next;
    });
  };

  // すべて開く / すべて閉じる
  const toggleExpandAll = () => {
    if (expandedStudioIds.size > 0) {
      setExpandedStudioIds(new Set());
    } else {
      setExpandedStudioIds(new Set(filteredStudios.map(s => s.id)));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-4xl h-[94vh] sm:h-auto sm:max-h-[92vh] flex flex-col bg-white border border-stone-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* モーダルヘッダー（スマホではスリム化し、不要なカード固定を完全排除） */}
          <div className="p-3.5 sm:p-5 border-b border-stone-200 dark:border-slate-800/80 bg-stone-50 dark:bg-slate-950/70 flex-shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/80 shrink-0">
                    <Radio className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse text-emerald-600 dark:text-emerald-400" />
                    稼働中スタジオ
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                    首都圏13エリア・{areaCounts.all}店舗 / {totalRooms}部屋 実データ対応
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-black tracking-tight text-slate-900 dark:text-white mt-1 truncate">
                  Sound Spot 対応スタジオ・部屋機材一覧
                </h2>
              </div>

              {/* 閉じるボタン */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 dark:text-slate-400 dark:hover:text-white rounded-full dark:bg-slate-800/80 dark:hover:bg-slate-700 transition flex-shrink-0 cursor-pointer"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* フィルター＆検索バー（コンパクト） */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-3">
              {/* エリアタブ（下北沢等が横スクロールしないと見えないことに気づきにくいため、
                  続きがある側にだけ薄いフェードを重ねてスクロール可能なことを示す） */}
              <div className="relative min-w-0">
              <div
                ref={areaTabsRef}
                onScroll={updateAreaTabsFade}
                className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none"
              >
                <button
                  type="button"
                  onClick={() => setSelectedArea('all')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === 'all'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  すべて ({areaCounts.all})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('渋谷')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '渋谷'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  渋谷 ({areaCounts['渋谷']})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('新宿')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '新宿'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  新宿 ({areaCounts['新宿']})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('秋葉原・上野')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '秋葉原・上野'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  秋葉原・上野 ({areaCounts['秋葉原・上野']})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('高田馬場')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '高田馬場'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  高田馬場 ({areaCounts['高田馬場']})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('池袋')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '池袋'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  池袋 ({areaCounts['池袋']})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('下北沢')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '下北沢'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  下北沢 ({areaCounts['下北沢']})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('吉祥寺')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '吉祥寺'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  吉祥寺 ({areaCounts['吉祥寺']})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('高円寺')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '高円寺'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  高円寺 ({areaCounts['高円寺']})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('船橋')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '船橋'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  船橋 ({areaCounts['船橋']})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('横浜')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '横浜'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  横浜 ({areaCounts['横浜']})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('亀戸・小岩')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '亀戸・小岩'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  亀戸・小岩 ({areaCounts['亀戸・小岩']})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('松戸・柏')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '松戸・柏'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  松戸・柏 ({areaCounts['松戸・柏']})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArea('町田')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '町田'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  町田 ({areaCounts['町田']})
                </button>
              </div>
              {showLeftFade && (
                <div className="pointer-events-none absolute left-0 top-0 bottom-0.5 sm:bottom-0 w-6 bg-gradient-to-r from-stone-50 dark:from-slate-950/90 to-transparent" />
              )}
              {showRightFade && (
                <div className="pointer-events-none absolute right-0 top-0 bottom-0.5 sm:bottom-0 w-6 bg-gradient-to-l from-stone-50 dark:from-slate-950/90 to-transparent" />
              )}
              </div>

              {/* 検索入力（機材名・アンプ検索にも対応） */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="店舗名・機材名 (Marshall/JC-120等)..."
                  className="w-full bg-white border border-stone-300 dark:bg-slate-950 dark:border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/70"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* スタジオ一覧スクロールエリア（サマリーカードはここに配置され、スマホでも下にスライド可能） */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4">
            {/* サマリーカード（スクロール可能エリアに配置し、スマホの画面を圧迫しないよう改善） */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-stone-50 border border-stone-200 dark:bg-slate-950/60 dark:border-slate-800/80 rounded-xl p-2 sm:p-2.5">
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">対応エリア</span>
                <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">13 エリア</p>
                <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">渋谷・新宿・秋葉原・上野・高田馬場・池袋・下北沢・吉祥寺・高円寺・船橋・横浜・亀戸・小岩・松戸・柏・町田</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 dark:bg-slate-950/60 dark:border-slate-800/80 rounded-xl p-2 sm:p-2.5">
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">対応スタジオ数</span>
                <p className="text-sm sm:text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">{areaCounts.all} 店舗</p>
                <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">
                  渋{areaCounts['渋谷']} / 新{areaCounts['新宿']} / 秋{areaCounts['秋葉原・上野']} / 馬{areaCounts['高田馬場']} / 池{areaCounts['池袋']} / 下{areaCounts['下北沢']} / 吉{areaCounts['吉祥寺']} / 高{areaCounts['高円寺']} / 船{areaCounts['船橋']} / 横{areaCounts['横浜']} / 亀{areaCounts['亀戸・小岩']} / 松{areaCounts['松戸・柏']} / 町{areaCounts['町田']}
                </span>
              </div>
              <div className="bg-stone-50 border border-stone-200 dark:bg-slate-950/60 dark:border-slate-800/80 rounded-xl p-2 sm:p-2.5">
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">対応部屋総数</span>
                <p className="text-sm sm:text-base font-extrabold text-teal-700 dark:text-teal-300 mt-0.5">{totalRooms} 部屋</p>
                <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">8〜50帖・ゲネプロ対応</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 dark:bg-slate-950/60 dark:border-slate-800/80 rounded-xl p-2 sm:p-2.5">
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">予約連携仕様</span>
                <p className="text-sm sm:text-base font-extrabold text-cyan-700 dark:text-cyan-300 mt-0.5">{webSyncCount}店 Web / {phoneSyncCount}店 電話</p>
                <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">定期更新</span>
              </div>
            </div>

            {/* 一括開閉トグルボタン & ヒント */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="text-[11px]">
                {filteredStudios.length} 店舗中 {filteredStudios.reduce((acc, s) => acc + (roomsByStudioId.get(s.name)?.length || s.roomCount), 0)} 部屋を表示
              </span>
              <button
                type="button"
                onClick={toggleExpandAll}
                className="text-xs text-emerald-700 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline font-semibold cursor-pointer"
              >
                {expandedStudioIds.size > 0 ? 'すべて閉じる' : '全店舗の部屋・機材を展開'}
              </button>
            </div>

            {filteredStudios.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                <Building2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">該当するスタジオまたは機材が見つかりませんでした。</p>
                <button
                  onClick={() => { setSelectedArea('all'); setSelectedSyncType('all'); setSearchQuery(''); }}
                  className="mt-3 text-xs text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  条件をリセットする
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredStudios.map((studio) => {
                  const rooms = roomsByStudioId.get(studio.name) || [];
                  const isExpanded = expandedStudioIds.has(studio.id);

                  return (
                    <div
                      key={studio.id}
                      className="bg-stone-50 border border-stone-200 hover:border-stone-300 dark:bg-slate-950/70 dark:border-slate-800 dark:hover:border-slate-700/80 rounded-xl p-3.5 sm:p-4 transition-all hover:shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        {/* 上段バッジ群 */}
                        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-stone-100 text-slate-600 border border-stone-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60">
                              {studio.chainName}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-emerald-700 border border-emerald-300 dark:bg-slate-800/80 dark:text-emerald-400 dark:border-emerald-800/40">
                              {studio.area}
                            </span>
                            {studio.is24Hours && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800/60">
                                24h
                              </span>
                            )}
                          </div>

                          {/* 同期ステータスバッジ */}
                          {studio.syncType === 'phone' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-800/60 flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5" />
                              電話予約
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-800/60 flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                              Web空き状況
                            </span>
                          )}
                        </div>

                        {/* スタジオ名 */}
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                          {studio.name}
                        </h3>

                        {/* 最寄り駅・部屋数 */}
                        <div className="mt-1.5 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                            <span>{studio.nearestStation}</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Layers className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                            <span className="font-semibold text-slate-700 dark:text-slate-200">全 {rooms.length || studio.roomCount} 部屋</span>
                            <span className="text-stone-300 dark:text-slate-600">•</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{studio.systemName}</span>
                            <span className="text-stone-300 dark:text-slate-600">•</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{studio.businessHours}</span>
                          </div>
                        </div>

                        {/* 特徴タグ */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {studio.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-white border border-stone-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 部屋・機材一覧のアコーディオン展開ボタン */}
                      <div className="mt-3 pt-2.5 border-t border-stone-200 dark:border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => toggleExpand(studio.id)}
                          className="w-full flex items-center justify-between gap-2 flex-wrap px-3 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 hover:border-emerald-400 dark:bg-slate-900/90 dark:hover:bg-slate-800 dark:border-slate-800/90 dark:hover:border-emerald-600/50 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition cursor-pointer group"
                        >
                          {/* 左右どちらのテキストも折り返さず一塊のまま扱い、幅が足りない場合は
                              右側のラベルごと2段目に落とす（文字やアイコンの途中で崩れるのを防ぐ） */}
                          <span className="flex items-center gap-1.5 whitespace-nowrap">
                            <Music className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                            <span>常設部屋・機材一覧（全 {rooms.length || studio.roomCount} 部屋）</span>
                          </span>
                          <span className="flex items-center gap-1 text-slate-500 group-hover:text-emerald-600 dark:text-slate-400 dark:group-hover:text-emerald-400 text-[11px] whitespace-nowrap">
                            {isExpanded ? (
                              <>閉じる <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" /></>
                            ) : (
                              <>詳細を見る <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" /></>
                            )}
                          </span>
                        </button>

                        {/* アコーディオン内容: 部屋・機材スペックカード一覧 */}
                        {isExpanded && (
                          <div className="mt-2.5 space-y-2 pt-1 animate-fadeIn">
                            {rooms.length === 0 ? (
                              <p className="text-xs text-slate-400 dark:text-slate-500 py-2 text-center">
                                部屋スペックの詳細は公式HPをご確認ください。
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {rooms.map((room) => {
                                  const eq = room.equipment;
                                  return (
                                    <div
                                      key={room.id}
                                      onClick={() => setDetailRoom(room)}
                                      className="p-2.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 hover:border-stone-300 dark:bg-slate-900/90 dark:hover:bg-slate-800 dark:border-slate-800/90 dark:hover:border-slate-700 transition cursor-pointer group/room flex flex-col justify-between"
                                      title="クリックして部屋・機材の詳細を表示"
                                    >
                                      <div>
                                        {/* 部屋名・帖数・料金 */}
                                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                                          <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="font-bold text-xs text-slate-900 group-hover/room:text-emerald-600 dark:text-white dark:group-hover/room:text-emerald-400 transition truncate">
                                              {room.name}
                                            </span>
                                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 shrink-0">
                                              {room.sizeTatami}帖
                                            </span>
                                            {room.floor && (
                                              <span className="text-[9px] text-slate-400 dark:text-slate-500 shrink-0">
                                                {room.floor}
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-right shrink-0">
                                            <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                              ¥{room.pricePerHourRegular.toLocaleString()}
                                            </span>
                                            <span className="text-[9px] text-slate-400 dark:text-slate-500 block">/h(通常)</span>
                                          </div>
                                        </div>

                                        {/* 機材リスト */}
                                        <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 mt-2">
                                          {/* ギターアンプ */}
                                          {eq && eq.guitarAmps.length > 0 && (
                                            <div className="flex items-start gap-1">
                                              <span className="text-[9px] uppercase font-bold text-slate-400 px-1 py-0.2 rounded bg-stone-100 dark:text-slate-500 dark:bg-slate-950 shrink-0">
                                                GUITAR
                                              </span>
                                              <span className="text-slate-600 dark:text-slate-300 text-[10.5px] truncate">
                                                {eq.guitarAmps.join(', ')}
                                              </span>
                                            </div>
                                          )}

                                          {/* ベースアンプ */}
                                          {eq?.bassAmp && (
                                            <div className="flex items-start gap-1">
                                              <span className="text-[9px] uppercase font-bold text-slate-400 px-1 py-0.2 rounded bg-stone-100 dark:text-slate-500 dark:bg-slate-950 shrink-0">
                                                BASS
                                              </span>
                                              <span className="text-slate-600 dark:text-slate-300 text-[10.5px] truncate">
                                                {eq.bassAmp}
                                              </span>
                                            </div>
                                          )}

                                          {/* ドラム */}
                                          {eq?.drumSet && (
                                            <div className="flex items-start gap-1">
                                              <span className="text-[9px] uppercase font-bold text-slate-400 px-1 py-0.2 rounded bg-stone-100 dark:text-slate-500 dark:bg-slate-950 shrink-0">
                                                DRUM
                                              </span>
                                              <span className="text-slate-600 dark:text-slate-300 text-[10.5px] truncate">
                                                {eq.drumSet}
                                              </span>
                                            </div>
                                          )}

                                          {/* 鍵盤・キーボード */}
                                          {eq?.keyboards && eq.keyboards.length > 0 && (
                                            <div className="flex items-start gap-1">
                                              <span className="text-[9px] uppercase font-bold text-slate-400 px-1 py-0.2 rounded bg-stone-100 dark:text-slate-500 dark:bg-slate-950 shrink-0">
                                                KEYS
                                              </span>
                                              <span className="text-slate-600 dark:text-slate-300 text-[10.5px] truncate">
                                                {eq.keyboards.join(', ')}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* 個人練習料金 & 詳細案内 */}
                                      <div className="mt-2 pt-1.5 border-t border-stone-200 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                                        <span>個人: ¥{room.pricePerHourSolo.toLocaleString()}/h</span>
                                        <span className="text-emerald-700 dark:text-emerald-400 group-hover/room:underline">詳細スペック ↗</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* アクションボタン */}
                      <div className="mt-3 pt-2.5 border-t border-stone-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                          {studio.address}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {studio.syncType === 'phone' ? (
                            <a
                              href={`tel:${studio.tel}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 text-xs font-semibold transition"
                            >
                              <Phone className="w-3 h-3" />
                              電話予約
                            </a>
                          ) : null}
                          <a
                            href={studio.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                          >
                            公式HP
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* モーダルフッター（安心・同期ポリシー説明） */}
          <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-slate-800/80 bg-stone-50 dark:bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs flex-shrink-0">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <p className="leading-snug">
                各スタジオ公式システムから空き情報を定期取得。首都圏全{areaCounts.all}店舗の常設機材スペックを網羅しています。
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex-shrink-0"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>

      {/* 部屋詳細モーダル（SupportedStudiosModal からも開けるよう連携） */}
      {detailRoom && (
        <div className="relative z-[60]">
          <RoomDetailModal
            room={detailRoom}
            bookingType="band"
            onClose={() => setDetailRoom(null)}
          />
        </div>
      )}
    </>
  );
};
