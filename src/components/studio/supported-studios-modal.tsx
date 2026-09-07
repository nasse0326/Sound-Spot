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
import { getMockRoomsWithSlots } from '@/lib/mock-data';
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

  // 本日の日付基準で全店舗の部屋・機材スペックを取得
  const todayStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  const allRooms = useMemo(() => getMockRoomsWithSlots(todayStr), [todayStr]);

  // スタジオIDごとの部屋マッピング
  const roomsByStudioId = useMemo(() => {
    const map = new Map<string, RoomWithSlots[]>();
    for (const room of allRooms) {
      const sId = room.studio.id;
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
        const rooms = roomsByStudioId.get(st.id) || [];
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
          className="relative w-full max-w-4xl h-[94vh] sm:h-auto sm:max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* モーダルヘッダー（スマホではスリム化し、不要なカード固定を完全排除） */}
          <div className="p-3.5 sm:p-5 border-b border-slate-800/80 bg-slate-950/70 flex-shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80 shrink-0">
                    <Radio className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse text-emerald-400" />
                    稼働中スタジオ
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    都内3大エリア・16店舗 / {totalRooms}部屋 実データ対応
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-black tracking-tight text-white mt-1 truncate">
                  SoundSpot 対応スタジオ・部屋機材一覧
                </h2>
              </div>

              {/* 閉じるボタン */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition flex-shrink-0 cursor-pointer"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* フィルター＆検索バー（コンパクト） */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-3">
              {/* エリアタブ */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedArea('all')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
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
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
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
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
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
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    selectedArea === '秋葉原'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  秋葉原 ({areaCounts['秋葉原']})
                </button>
              </div>

              {/* 検索入力（機材名・アンプ検索にも対応） */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="店舗名・機材名 (Marshall/JC-120等)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/70"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
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
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 sm:p-2.5">
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">対応エリア</span>
                <p className="text-sm sm:text-base font-extrabold text-white mt-0.5">3 エリア</p>
                <span className="text-[9px] sm:text-[10px] text-slate-500">渋谷・新宿・秋葉原</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 sm:p-2.5">
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">対応スタジオ数</span>
                <p className="text-sm sm:text-base font-extrabold text-emerald-400 mt-0.5">16 店舗</p>
                <span className="text-[9px] sm:text-[10px] text-slate-500">渋 8 / 新 4 / 秋 4</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 sm:p-2.5">
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">対応部屋総数</span>
                <p className="text-sm sm:text-base font-extrabold text-teal-300 mt-0.5">{totalRooms} 部屋</p>
                <span className="text-[9px] sm:text-[10px] text-slate-500">8〜50帖・ゲネプロ対応</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 sm:p-2.5">
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">予約連携仕様</span>
                <p className="text-sm sm:text-base font-extrabold text-cyan-300 mt-0.5">10店 Web / 6店 電話</p>
                <span className="text-[9px] sm:text-[10px] text-slate-500">リアルタイム同期</span>
              </div>
            </div>

            {/* 一括開閉トグルボタン & ヒント */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span className="text-[11px]">
                {filteredStudios.length} 店舗中 {filteredStudios.reduce((acc, s) => acc + (roomsByStudioId.get(s.id)?.length || s.roomCount), 0)} 部屋を表示
              </span>
              <button
                type="button"
                onClick={toggleExpandAll}
                className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline font-semibold cursor-pointer"
              >
                {expandedStudioIds.size > 0 ? 'すべて閉じる' : '全店舗の部屋・機材を展開'}
              </button>
            </div>

            {filteredStudios.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Building2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">該当するスタジオまたは機材が見つかりませんでした。</p>
                <button
                  onClick={() => { setSelectedArea('all'); setSelectedSyncType('all'); setSearchQuery(''); }}
                  className="mt-3 text-xs text-emerald-400 hover:underline"
                >
                  条件をリセットする
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredStudios.map((studio) => {
                  const rooms = roomsByStudioId.get(studio.id) || [];
                  const isExpanded = expandedStudioIds.has(studio.id);

                  return (
                    <div 
                      key={studio.id}
                      className="bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 rounded-xl p-3.5 sm:p-4 transition-all hover:shadow-lg flex flex-col justify-between"
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
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                          {studio.name}
                        </h3>

                        {/* 最寄り駅・部屋数 */}
                        <div className="mt-1.5 space-y-1 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span>{studio.nearestStation}</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Layers className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="font-semibold text-slate-200">全 {rooms.length || studio.roomCount} 部屋</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-[11px] text-slate-400">{studio.systemName}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-[11px] text-slate-400">{studio.businessHours}</span>
                          </div>
                        </div>

                        {/* 特徴タグ */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
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

                      {/* 部屋・機材一覧のアコーディオン展開ボタン */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => toggleExpand(studio.id)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800/90 hover:border-emerald-600/50 text-xs font-bold text-slate-200 hover:text-white transition cursor-pointer group"
                        >
                          <span className="flex items-center gap-1.5">
                            <Music className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span>常設部屋・機材一覧（全 {rooms.length || studio.roomCount} 部屋）</span>
                          </span>
                          <span className="flex items-center gap-1 text-slate-400 group-hover:text-emerald-400 text-[11px]">
                            {isExpanded ? (
                              <>閉じる <ChevronUp className="w-3.5 h-3.5" /></>
                            ) : (
                              <>部屋・アンプを見る <ChevronDown className="w-3.5 h-3.5" /></>
                            )}
                          </span>
                        </button>

                        {/* アコーディオン内容: 部屋・機材スペックカード一覧 */}
                        {isExpanded && (
                          <div className="mt-2.5 space-y-2 pt-1 animate-fadeIn">
                            {rooms.length === 0 ? (
                              <p className="text-xs text-slate-500 py-2 text-center">
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
                                      className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800/90 hover:border-slate-700 transition cursor-pointer group/room flex flex-col justify-between"
                                      title="クリックして部屋・機材の詳細を表示"
                                    >
                                      <div>
                                        {/* 部屋名・帖数・料金 */}
                                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                                          <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="font-bold text-xs text-white group-hover/room:text-emerald-400 transition truncate">
                                              {room.name}
                                            </span>
                                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 shrink-0">
                                              {room.sizeTatami}帖
                                            </span>
                                            {room.floor && (
                                              <span className="text-[9px] text-slate-500 shrink-0">
                                                {room.floor}
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-right shrink-0">
                                            <span className="font-mono text-xs font-bold text-emerald-400">
                                              ¥{room.pricePerHourRegular.toLocaleString()}
                                            </span>
                                            <span className="text-[9px] text-slate-500 block">/h(通常)</span>
                                          </div>
                                        </div>

                                        {/* 機材リスト */}
                                        <div className="space-y-1 text-[11px] text-slate-300 mt-2">
                                          {/* ギターアンプ */}
                                          {eq && eq.guitarAmps.length > 0 && (
                                            <div className="flex items-start gap-1">
                                              <span className="text-[9px] uppercase font-bold text-slate-500 px-1 py-0.2 rounded bg-slate-950 shrink-0">
                                                GUITAR
                                              </span>
                                              <span className="text-slate-300 text-[10.5px] truncate">
                                                {eq.guitarAmps.join(', ')}
                                              </span>
                                            </div>
                                          )}

                                          {/* ベースアンプ */}
                                          {eq?.bassAmp && (
                                            <div className="flex items-start gap-1">
                                              <span className="text-[9px] uppercase font-bold text-slate-500 px-1 py-0.2 rounded bg-slate-950 shrink-0">
                                                BASS
                                              </span>
                                              <span className="text-slate-300 text-[10.5px] truncate">
                                                {eq.bassAmp}
                                              </span>
                                            </div>
                                          )}

                                          {/* ドラム */}
                                          {eq?.drumSet && (
                                            <div className="flex items-start gap-1">
                                              <span className="text-[9px] uppercase font-bold text-slate-500 px-1 py-0.2 rounded bg-slate-950 shrink-0">
                                                DRUM
                                              </span>
                                              <span className="text-slate-300 text-[10.5px] truncate">
                                                {eq.drumSet}
                                              </span>
                                            </div>
                                          )}

                                          {/* 鍵盤・キーボード */}
                                          {eq?.keyboards && eq.keyboards.length > 0 && (
                                            <div className="flex items-start gap-1">
                                              <span className="text-[9px] uppercase font-bold text-slate-500 px-1 py-0.2 rounded bg-slate-950 shrink-0">
                                                KEYS
                                              </span>
                                              <span className="text-slate-300 text-[10.5px] truncate">
                                                {eq.keyboards.join(', ')}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* 個人練習料金 & 詳細案内 */}
                                      <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                                        <span>個人: ¥{room.pricePerHourSolo.toLocaleString()}/h</span>
                                        <span className="text-emerald-400 group-hover/room:underline">詳細スペック ↗</span>
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
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500 truncate">
                          {studio.address}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
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
                  );
                })}
              </div>
            )}
          </div>

          {/* モーダルフッター（安心・同期ポリシー説明） */}
          <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs flex-shrink-0">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] sm:text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <p className="leading-snug">
                各スタジオ公式システムと定時自動同期。全16店舗の常設機材スペックを網羅しています。
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer flex-shrink-0"
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
