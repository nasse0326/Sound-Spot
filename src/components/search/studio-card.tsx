'use client';

import React from 'react';
import { Studio, RoomWithSlots, BookingType } from '@/types/studio';
import { checkRoomAvailability } from '@/lib/slot-utils';
import { 
  MapPin, 
  ExternalLink, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Info,
  Clock
} from 'lucide-react';

export interface StudioGroup {
  studio: Studio;
  rooms: RoomWithSlots[];
}

interface StudioCardProps {
  studioGroup: StudioGroup;
  bookingType: BookingType;
  targetDate: string;
  targetStartTime: string;
  targetEndTime: string;
  allowAdjacent30Min?: boolean;
  onOpenDetail: (room: RoomWithSlots) => void;
}

export const StudioCard: React.FC<StudioCardProps> = ({
  studioGroup,
  bookingType,
  targetDate,
  targetStartTime,
  targetEndTime,
  allowAdjacent30Min = true,
  onOpenDetail,
}) => {
  const { studio, rooms } = studioGroup;

  // 曜日・時間帯に応じた動的料金判定
  const dateObj = new Date(targetDate);
  const dayOfWeek = dateObj.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const startH = parseInt(targetStartTime.split(':')[0], 10);
  const endH = parseInt(targetEndTime.split(':')[0], 10);
  const durationHours = Math.max(1, endH - startH);
  const isDaytime = !isWeekend && startH < 18;

  // 各部屋の料金計算と空き状況判定
  const getRoomPrice = (room: RoomWithSlots) => {
    if (bookingType === 'solo') {
      return room.pricePerHourSolo;
    }
    return isDaytime ? room.pricePerHourDaytime : room.pricePerHourRegular;
  };

  // 各部屋の空き状況判定（±30分枠含む）
  const getRoomAvailability = (room: RoomWithSlots) => {
    return checkRoomAvailability(room, targetStartTime, targetEndTime, allowAdjacent30Min);
  };

  const roomAvails = rooms.map(getRoomAvailability);
  const availableCount = roomAvails.filter((r) => r.isAvailable).length;
  const isPhoneOnly = studio.chainName.includes('PENTA') || (!studio.bookingUrl && !!studio.tel);
  const allUnfetched = !isPhoneOnly && roomAvails.every((r) => r.matchType === 'unfetched');

  // 価格帯サマリー（¥2,200〜3,500/h）
  const prices = rooms.map(getRoomPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* 1. スタジオヘッダー（店舗情報・営業時間・最寄り駅・公式予約リンク） */}
      <div className="p-3.5 sm:p-5 pb-3 sm:pb-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-start justify-between gap-2.5 sm:gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {studio.chainName}
              </span>

              {/* 24時間・長時間営業バッジ */}
              {studio.is24Hours || studio.name.includes('ノア') ? (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-700/70 shadow-sm shadow-cyan-950/40 flex items-center gap-1" title={studio.businessHoursSummary || '24時間営業'}>
                  <span>🌙 24h営業</span>
                </span>
              ) : studio.name.includes('ベースオントップ') ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950/90 text-indigo-300 border border-indigo-700/70 flex items-center gap-1" title={studio.businessHoursSummary || '土日祝9:00〜翌5:00 / 平日10:00〜翌5:00'}>
                  <span>✨ 翌朝5時迄 (土日朝9時~)</span>
                </span>
              ) : studio.name.includes('音楽館') ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950/90 text-indigo-300 border border-indigo-700/70 flex items-center gap-1" title="バンド練習は事前予約で24時間利用可能">
                  <span>✨ 予約時24h対応</span>
                </span>
              ) : null}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
              {studio.name}
            </h3>

            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{studio.nearestStation}</span>
              </span>
            </div>
          </div>

          {/* 右上: 空き部屋数サマリー & 価格帯 */}
          <div className="text-right shrink-0">
            {isPhoneOnly ? (
              <div className="mb-1">
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/50">
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  <span>電話予約</span>
                </span>
              </div>
            ) : availableCount > 0 ? (
              <div className="mb-1">
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border bg-emerald-950 text-emerald-300 border-emerald-700/60 shadow-sm shadow-emerald-950/40">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                  <span>{availableCount}室 空き</span>
                </span>
              </div>
            ) : allUnfetched ? (
              <div className="mb-1">
                <span 
                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-slate-900 text-slate-400 border border-dashed border-slate-700/80"
                  title="この日時の最新空き枠データは未取得です。公式WEBでご確認ください。"
                >
                  <span className="font-mono text-slate-500">—</span>
                  <span>未同期</span>
                </span>
              </div>
            ) : (
              <div className="mb-1">
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border bg-rose-950/60 text-rose-300 border border-rose-800/50">
                  <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
                  <span>満室</span>
                </span>
              </div>
            )}

            <div className="text-[11px] sm:text-xs text-slate-400 font-mono">
              ¥{minPrice.toLocaleString()}{minPrice !== maxPrice ? `〜` : ''}
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-normal">/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 部屋一覧リスト（スマホでタップしやすいスリム行デザイン） */}
      <div className="p-2 sm:p-3 divide-y divide-slate-800/60 flex-1">
        {rooms.map((room) => {
          const price = getRoomPrice(room);
          const availResult = getRoomAvailability(room);
          const isOffset30 = room.startTimeOffset === 30;

          return (
            <div
              key={room.id}
              onClick={() => onOpenDetail(room)}
              className="py-2.5 px-2.5 sm:px-3 rounded-xl hover:bg-slate-800/50 active:bg-slate-800/80 transition-all flex items-center justify-between gap-2 sm:gap-3 cursor-pointer group"
            >
              {/* 部屋名・帖数・開始分・アンプ */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition truncate">
                    {room.name}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-300 bg-slate-800/90 px-1.5 py-0.2 rounded border border-slate-700/60">
                    {room.sizeTatami}帖
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isOffset30
                      ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                      : 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                  }`}>
                    {isOffset30 ? ':30' : ':00'}
                  </span>
                </div>

                {/* 主要アンプタグ */}
                <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-[11px] text-slate-400 truncate">
                  {room.equipment.guitarAmps.slice(0, 2).map((amp, idx) => (
                    <span key={idx} className="bg-slate-950/70 px-1.5 py-0.2 rounded text-slate-400 border border-slate-800/80">
                      {amp.replace('Roland ', '').replace('Marshall ', 'M/')}
                    </span>
                  ))}
                  {room.hasRecording && (
                    <span className="text-[9px] sm:text-[10px] text-purple-400 font-medium bg-purple-950/50 px-1 rounded">
                      REC
                    </span>
                  )}
                </div>
              </div>

              {/* 右側: 料金 & ステータス & 矢印 */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                    ¥{price.toLocaleString()}
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-normal">/h</span>
                  </div>
                  {durationHours > 1 && (
                    <div className="text-[9px] sm:text-[10px] text-slate-500 font-mono">
                      計¥{(price * durationHours).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* 空き状況アイコン */}
                {availResult.matchType === 'exact' ? (
                  <span className="px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/80 flex items-center gap-1 shadow-sm shadow-emerald-950/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>空き</span>
                  </span>
                ) : availResult.matchType === 'early30' || availResult.matchType === 'late30' ? (
                  <span 
                    className="px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-500/80 flex items-center gap-1 shadow-sm shadow-blue-950/40"
                    title={`指定時間(${targetStartTime})から前後30分ズレた枠に空きがあります (${availResult.availableCandidateTimes.join(', ')}~)`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    <span>
                      {availResult.availableCandidateTimes.length > 1
                        ? `${availResult.availableCandidateTimes.join('/')}~ 空き`
                        : `${availResult.matchedStartTime}~ 空き`}
                    </span>
                  </span>
                ) : availResult.matchType === 'phone_only' ? (
                  <span className="px-2 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-medium bg-amber-950/60 text-amber-300 border border-amber-800/50 flex items-center gap-1">
                    <span>要TEL</span>
                  </span>
                ) : availResult.matchType === 'unfetched' ? (
                  <span 
                    className="px-2 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-medium bg-slate-900 text-slate-400 border border-dashed border-slate-700/80 flex items-center gap-1"
                    title="この日時の空き枠データは未取得です。公式WEB予約サイトをご確認ください。"
                  >
                    <span className="font-mono text-slate-500">—</span>
                    <span>未取得</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-medium bg-slate-950 text-slate-500 border border-slate-800 flex items-center gap-1">
                    <XCircle className="w-3 h-3 text-slate-600" />
                    <span>満室</span>
                  </span>
                )}

                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 group-hover:text-slate-300 transition group-hover:translate-x-0.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. カード下部CTA（スマホ親指タップしやすいサイズ） */}
      <div className="p-2.5 sm:p-3 bg-slate-950/60 border-t border-slate-800/80">
        {isPhoneOnly && studio.tel ? (
          <a
            href={`tel:${studio.tel}`}
            className="w-full h-11 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold rounded-xl bg-amber-500 active:bg-amber-600 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10 transition"
          >
            <Phone className="w-4 h-4" />
            <span>電話で予約 ({studio.tel})</span>
          </a>
        ) : (
          <a
            href={studio.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold rounded-xl bg-emerald-500 active:bg-emerald-600 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10 transition"
          >
            <span>公式WEB予約を開く</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

