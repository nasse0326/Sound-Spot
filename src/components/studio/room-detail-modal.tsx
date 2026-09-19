'use client';

import React from 'react';
import { RoomWithSlots, BookingType } from '@/types/studio';
import { 
  X, 
  ExternalLink, 
  MapPin, 
  Phone, 
  Music, 
  Disc, 
  Volume2, 
  Check, 
  Clock, 
  Calendar,
  AlertCircle,
  Info
} from 'lucide-react';

interface RoomDetailModalProps {
  room: RoomWithSlots | null;
  bookingType: BookingType;
  onClose: () => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  bookingType,
  onClose,
}) => {
  if (!room) return null;

  const studio = room.studio;
  const eq = room.equipment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-stone-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full bg-stone-100 hover:bg-stone-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-stone-100 text-emerald-700 border border-emerald-300 dark:bg-slate-800 dark:text-emerald-400 dark:border-emerald-500/20">
              {studio.chainName}
            </span>
            {studio.is24Hours || studio.name.includes('ノア') ? (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-700/60 flex items-center gap-1">
                <span>🌙 24時間営業</span>
              </span>
            ) : studio.name.includes('ベースオントップ') ? (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700/60 flex items-center gap-1">
                <span>✨ 土日朝9時〜翌朝5時営業</span>
              </span>
            ) : studio.name.includes('音楽館') ? (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700/60 flex items-center gap-1">
                <span>✨ 予約時24h対応</span>
              </span>
            ) : null}
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {studio.nearestStation}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {studio.name}
          </h2>
          {studio.businessHoursSummary && (
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>営業時間: {studio.businessHoursSummary}</span>
            </div>
          )}
          <div className="flex items-center gap-3 mt-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-lg">{room.name}</span>
            <span>•</span>
            <span className="bg-stone-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">{room.sizeTatami} 帖</span>
            <span>•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">定員 ~{room.capacity}名</span>
            <span>•</span>
            <span className="text-xs bg-amber-50 dark:bg-slate-800/80 px-2 py-0.5 rounded text-amber-700 dark:text-amber-300 font-mono">
              毎時 {String(room.startTimeOffset || 0).padStart(2, '0')}分スタート
            </span>
          </div>
        </div>

        {/* 料金ハイライト */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-stone-50 dark:bg-slate-950/80 border border-stone-200 dark:border-slate-800 rounded-xl mb-6">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">バンド（平日昼）</div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-200">
              ¥{room.pricePerHourDaytime.toLocaleString()}<span className="text-xs font-normal text-slate-400 dark:text-slate-500">/h</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">バンド（夜間・土日祝）</div>
            <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
              ¥{room.pricePerHourRegular.toLocaleString()}<span className="text-xs font-normal text-slate-400 dark:text-slate-500">/h</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">個人練習（1名）</div>
            <div className="text-lg font-bold text-amber-700 dark:text-amber-400">
              ¥{room.pricePerHourSolo.toLocaleString()}<span className="text-xs font-normal text-slate-400 dark:text-slate-500">/h</span>
            </div>
          </div>
        </div>

        {/* 予約ルールについての注意 */}
        <div className="mb-6 p-4 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950/40">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            予約受付ルール
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 shrink-0">
                バンド予約
              </span>
              <span className="text-slate-600 dark:text-slate-300">{studio.groupBookingRule || `${studio.groupBookingLeadMonths}ヶ月先まで予約可能`}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 shrink-0">
                個人練習
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                {studio.soloBookingRule || `利用開始${studio.soloBookingLeadHours}時間前より受付開始`}
              </span>
            </div>
          </div>
        </div>

        {/* 常設機材・スペック */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            常設機材・スペック
          </h3>

          <div className="space-y-3 bg-stone-50 dark:bg-slate-950/50 p-4 rounded-xl border border-stone-200 dark:border-slate-800/80">
            {/* ギターアンプ */}
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                ギターアンプ ({eq.guitarAmps.length}台常設)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {eq.guitarAmps.map((amp, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white text-slate-700 px-2.5 py-1 rounded-md font-medium border border-stone-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                  >
                    {amp}
                  </span>
                ))}
              </div>
            </div>

            {/* ベースアンプ */}
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">ベースアンプ</div>
              <div className="text-sm font-medium text-slate-700 bg-white border border-stone-200 dark:text-slate-200 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg dark:border-slate-700/60">
                {eq.bassAmp}
              </div>
            </div>

            {/* ドラムセット */}
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">ドラムセット</div>
              <div className="text-sm font-medium text-slate-700 bg-white border border-stone-200 dark:text-slate-200 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg dark:border-slate-700/60">
                {eq.drumSet}
              </div>
              {eq.cymbalsDetail && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-1">
                  シンバル: {eq.cymbalsDetail}
                </div>
              )}
            </div>

            {/* キーボード・その他 */}
            {eq.keyboards && eq.keyboards.length > 0 && (
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">キーボード・シンセ</div>
                <div className="flex flex-wrap gap-1.5">
                  {eq.keyboards.map((kb, idx) => (
                    <span key={idx} className="text-xs bg-white text-slate-600 px-2 py-1 rounded border border-stone-300 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                      {kb}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {eq.additionalNotes && (
              <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-stone-200 dark:border-slate-800 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                <span>{eq.additionalNotes}</span>
              </div>
            )}
          </div>
        </div>

        {/* 店舗情報・直リンク */}
        <div className="pt-4 border-t border-stone-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{studio.address}</span>
            </div>
            {studio.tel && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <a href={`tel:${studio.tel}`} className="text-slate-600 dark:text-slate-300 hover:underline">
                  {studio.tel}
                </a>
              </div>
            )}
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            {(studio.chainName.includes('PENTA') || (!studio.bookingUrl && !!studio.tel)) && studio.tel ? (
              <>
                <a
                  href={`tel:${studio.tel}`}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  <Phone className="w-4 h-4" />
                  <span>お電話で予約する</span>
                </a>
                <a
                  href={studio.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl font-medium text-sm bg-stone-100 hover:bg-stone-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition"
                  title="公式HP"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            ) : (
              <a
                href={studio.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>公式WEB予約サイトを開く</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
