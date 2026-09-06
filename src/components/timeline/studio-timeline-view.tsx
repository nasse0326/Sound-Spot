'use client';

import React, { useMemo } from 'react';
import { RoomWithSlots, BookingType, AvailabilitySlot } from '@/types/studio';
import { Info, Clock, ExternalLink, MapPin } from 'lucide-react';

interface StudioTimelineViewProps {
  rooms: RoomWithSlots[];
  bookingType: BookingType;
  showEarlyMorning: boolean;
  onToggleEarlyMorning: (show: boolean) => void;
  targetStartTime: string;
  targetEndTime: string;
  allowAdjacent30Min?: boolean;
  onSelectTime: (startTime: string, endTime: string) => void;
  onOpenDetail: (room: RoomWithSlots) => void;
}

export const StudioTimelineView: React.FC<StudioTimelineViewProps> = ({
  rooms,
  bookingType,
  showEarlyMorning,
  onToggleEarlyMorning,
  targetStartTime,
  targetEndTime,
  allowAdjacent30Min = true,
  onSelectTime,
  onOpenDetail,
}) => {
  // 全部屋をタイムラインに表示（スロット未取得や電話予約も状態を明示）
  const activeRooms = rooms;

  // スタジオごとに部屋をグループ化（スタジオ名の重複を排除）
  const studioGroups = useMemo(() => {
    const groups: {
      studio: RoomWithSlots['studio'];
      rooms: RoomWithSlots[];
    }[] = [];

    const map = new Map<string, { studio: RoomWithSlots['studio']; rooms: RoomWithSlots[] }>();
    activeRooms.forEach((room) => {
      const sid = room.studio.id;
      if (!map.has(sid)) {
        const entry = { studio: room.studio, rooms: [] };
        map.set(sid, entry);
        groups.push(entry);
      }
      map.get(sid)!.rooms.push(room);
    });

    return groups;
  }, [activeRooms]);

  // 表示する時間軸（早朝ON: 6〜23時の18時間 / 早朝OFF: 9〜23時の15時間）
  const startH = showEarlyMorning ? 6 : 9;
  const hoursCount = 24 - startH;
  const HOURS = Array.from({ length: hoursCount }, (_, i) => startH + i);

  // 選択中の時間帯（例: 14:00〜15:00 または 14:30〜15:30）の開始・終了時
  const selStartH = parseInt(targetStartTime.split(':')[0], 10);
  const selStartM = parseInt(targetStartTime.split(':')[1], 10);
  const selEndH = parseInt(targetEndTime.split(':')[0], 10);
  const selEndM = parseInt(targetEndTime.split(':')[1], 10);
  const targetStartMin = selStartH * 60 + selStartM;
  const targetEndMin = selEndH * 60 + selEndM;

  // スロットクリック時に検索時間帯を「該当コマ + 1時間後」に即座に更新する
  const handleSlotClick = (room: RoomWithSlots, hour: number, offsetMin: number) => {
    const startStr = `${String(hour).padStart(2, '0')}:${String(offsetMin).padStart(2, '0')}`;
    const endH = Math.min(24, hour + 1);
    const endStr = `${String(endH).padStart(2, '0')}:${String(offsetMin).padStart(2, '0')}`;
    onSelectTime(startStr, endStr);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-xl overflow-x-auto">
      {/* 凡例 & 早朝トグル & 説明 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-emerald-500/30 text-emerald-400 font-bold text-[10px] border border-emerald-500/50">
              ○
            </span>
            <span className="text-slate-300 font-medium">空き枠 (予約可)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-slate-800 text-slate-500 text-[10px] border border-slate-700">
              -
            </span>
            <span className="text-slate-400">予約済み</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-slate-950 text-slate-500 text-[10px] border border-dashed border-slate-700">
              —
            </span>
            <span className="text-slate-400">データ未取得</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center px-1 h-4 rounded bg-amber-950/60 text-amber-300 text-[9px] font-bold border border-amber-800/50">
              TEL
            </span>
            <span className="text-slate-400">電話受付</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-700 text-slate-400">
            <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/60">
              :30
            </span>
            <span className="text-[11px]">時差枠 (毎時30分開始)</span>
          </div>

          {/* 強調ハイライト枠の凡例（緑＝完全一致、青＝前後30分枠） */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 text-xs font-bold shadow-sm shadow-emerald-950/40">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>完全一致 ({targetStartTime}〜{targetEndTime})</span>
          </div>

          {allowAdjacent30Min && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-950/80 border border-blue-500/80 text-blue-300 text-xs font-bold shadow-sm shadow-blue-950/40">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <span>前後30分枠 (調整候補)</span>
            </div>
          )}
        </div>

        {/* 右側: 早朝枠トグル & ヒント */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleEarlyMorning(!showEarlyMorning)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              showEarlyMorning
                ? 'bg-amber-950/80 text-amber-300 border-amber-600/70 shadow-sm shadow-amber-950/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span>🌅 早朝(6〜9時):</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              showEarlyMorning ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {showEarlyMorning ? 'ON' : 'OFF'}
            </span>
          </button>

          <div className="text-[11px] text-slate-500 hidden xl:flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>マスをクリックで時間指定 / 部屋名で詳細</span>
          </div>
        </div>
      </div>

      {/* タイムラインテーブル */}
      <div className={showEarlyMorning ? 'min-w-[1300px]' : 'min-w-[1100px]'}>
        {/* 時間軸ヘッダー */}
        <div 
          className="grid text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800 items-center sticky top-0 bg-slate-900 z-30"
          style={{
            gridTemplateColumns: `230px repeat(${HOURS.length * 2}, minmax(0, 1fr))`
          }}
        >
          <div className="pl-3 flex items-center gap-1.5 text-slate-300 sticky left-0 bg-slate-900 z-40">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>部屋一覧</span>
          </div>
          {HOURS.map((hour) => {
            const hStartMin = hour * 60;
            const hEndMin = (hour + 1) * 60;
            const isTargetHour = hStartMin < targetEndMin && hEndMin > targetStartMin;
            return (
              <div 
                key={hour} 
                className={`col-span-2 text-left pl-1 font-mono text-[11px] border-l transition-colors ${
                  isTargetHour 
                    ? 'text-emerald-300 font-bold bg-emerald-950/30 border-emerald-600/60 rounded-t' 
                    : 'text-slate-400 border-slate-800/80'
                }`}
              >
                {hour}:00
                {isTargetHour && (
                  <span className="ml-1 text-[9px] text-emerald-400 font-normal">◀指定</span>
                )}
              </div>
            );
          })}
        </div>

        {/* スタジオごとのグループ表示 */}
        <div className="space-y-4 mt-2">
          {studioGroups.map((group) => {
            const is24h = group.studio.is24Hours || group.studio.name.includes('ノア');
            const isLong = group.studio.name.includes('ベースオントップ') || group.studio.name.includes('音楽館');

            return (
              <div key={group.studio.id} className="rounded-xl border border-slate-800/70 overflow-hidden bg-slate-950/30">
                {/* スタジオ見出しヘッダー行（1スタジオにつき1回だけ表示） */}
                <div 
                  className="grid py-2 px-3 bg-slate-800/70 border-b border-slate-700/60 items-center text-xs"
                  style={{
                    gridTemplateColumns: `230px repeat(${HOURS.length * 2}, minmax(0, 1fr))`
                  }}
                >
                  {/* スタジオ名 & 24hバッジ */}
                  <div className="col-span-1 flex items-center gap-1.5 pr-2 sticky left-0 bg-slate-800/90 z-20">
                    <span className="font-bold text-white truncate text-xs">
                      {group.studio.name}
                    </span>
                    {is24h ? (
                      <span className="shrink-0 px-1 py-0.2 rounded text-[8px] font-black bg-cyan-950 text-cyan-300 border border-cyan-700/60" title={group.studio.businessHoursSummary || '24時間営業'}>
                        24h
                      </span>
                    ) : isLong ? (
                      <span className="shrink-0 px-1 py-0.2 rounded text-[8px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60" title={group.studio.businessHoursSummary || '長時間営業'}>
                        深夜早朝
                      </span>
                    ) : null}
                  </div>

                  {/* スタジオ補足情報（駅・部屋数・公式予約リンク） */}
                  <div 
                    className="flex items-center justify-between text-[11px] text-slate-400 pl-3 pr-2"
                    style={{ gridColumn: `2 / span ${HOURS.length * 2}` }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="flex items-center gap-1 text-slate-400 truncate">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        {group.studio.nearestStation}
                      </span>
                      <span className="text-slate-600">・</span>
                      <span className="text-slate-400 shrink-0">{group.rooms.length}部屋</span>
                    </div>

                    {group.studio.bookingUrl && (
                      <a
                        href={group.studio.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-950/60 hover:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/50 shrink-0 transition"
                      >
                        <span>公式予約</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* 各部屋の行 */}
                <div className="divide-y divide-slate-800/40">
                  {group.rooms.map((room) => {
                    const isOffset30 = room.startTimeOffset === 30;

                    return (
                      <div
                        key={room.id}
                        className="grid py-1.5 items-center hover:bg-slate-850/40 transition-colors group"
                        style={{
                          gridTemplateColumns: `230px repeat(${HOURS.length * 2}, minmax(0, 1fr))`
                        }}
                      >
                        {/* 部屋情報（スタジオ名は省き、部屋名・帖数・料金・30分バッジのみスッキリ表示） */}
                        <div 
                          className="pr-2 pl-3 cursor-pointer select-none sticky left-0 bg-slate-900/95 group-hover:bg-slate-800 z-10 flex items-center justify-between transition-colors border-r border-slate-800/60"
                          onClick={() => onOpenDetail(room)}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-semibold text-xs text-slate-200 group-hover:text-emerald-400 transition truncate">
                              {room.name}
                            </span>
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded shrink-0">
                              {room.sizeTatami}帖
                            </span>
                            {isOffset30 && (
                              <span className="px-1 py-0.2 rounded font-mono text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800/60 shrink-0">
                                :30
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 pl-1">
                            ¥{(bookingType === 'solo' ? room.pricePerHourSolo : room.pricePerHourRegular).toLocaleString()}
                          </span>
                        </div>

                        {/* 30分開始枠の場合：先頭の30分（1マス分）の空きスペーサー */}
                        {isOffset30 && (
                          <div className="col-span-1 h-7 border-r border-dashed border-slate-800/40 bg-slate-950/20" />
                        )}

                        {/* 各コマ（1時間枠 = 2カラム分）の描画 */}
                        {HOURS.map((hour, idx) => {
                          const offsetMin = isOffset30 ? 30 : 0;
                          const slotStartMin = hour * 60 + offsetMin;
                          const slotTimeStr = `${String(hour).padStart(2, '0')}:${String(offsetMin).padStart(2, '0')}`;

                          // 完全一致判定 (開始時間が検索条件と完全一致: 緑強調)
                          const isExact = slotStartMin >= targetStartMin && slotStartMin < targetEndMin && ((slotStartMin - targetStartMin) % 60 === 0);

                          // 前後30分ズレ判定 (開始時間が -30分 または +30分 ズレ: 青強調)
                          const isAdjacent = allowAdjacent30Min && !isExact && (
                            (slotStartMin >= targetStartMin - 30 && slotStartMin < targetEndMin - 30 && ((slotStartMin - (targetStartMin - 30)) % 60 === 0)) ||
                            (slotStartMin >= targetStartMin + 30 && slotStartMin < targetEndMin + 30 && ((slotStartMin - (targetStartMin + 30)) % 60 === 0))
                          );

                          const isPhoneOnly = room.studio.chainName.includes('PENTA') || (!room.studio.bookingUrl && !!room.studio.tel);

                          // 30分枠の最終コマの扱いに対応（23:30〜24:00）
                          if (isOffset30 && idx === HOURS.length - 1) {
                            const slot = room.slots?.find((s) => {
                              const d = new Date(s.startTime);
                              return d.getHours() === hour;
                            });

                            if (!slot) {
                              return (
                                <div
                                  key={hour}
                                  className={`col-span-1 h-7 rounded-r border flex items-center justify-center text-[9px] select-none ${
                                    isPhoneOnly
                                      ? 'border-amber-900/40 bg-amber-950/25 text-amber-400 font-bold'
                                      : 'border-dashed border-slate-800/80 bg-slate-950/40 text-slate-600'
                                  }`}
                                  title={
                                    isPhoneOnly
                                      ? `${room.studio.name} ${room.name} ${hour}:30〜24:00 - 電話予約店舗（公式へお電話でお問い合わせください）`
                                      : `${room.studio.name} ${room.name} ${hour}:30〜24:00 - 空き枠データ未取得（公式WEB予約サイトをご確認ください）`
                                  }
                                >
                                  {isPhoneOnly ? 'TEL' : '—'}
                                </div>
                              );
                            }

                            const isAvailable = slot?.status === 'available';

                            return (
                              <button
                                key={hour}
                                type="button"
                                onClick={() => handleSlotClick(room, hour, 30)}
                                title={`${room.studio.name} ${room.name} ${hour}:30〜24:00 (${isAvailable ? isExact ? '完全一致・空きあり' : isAdjacent ? '前後30分枠・空きあり' : '空きあり' : '予約済'}) - クリックで時間指定`}
                                className={`col-span-1 h-7 rounded-r text-[9px] font-bold transition-all flex items-center justify-center cursor-pointer select-none ${
                                  isExact
                                    ? isAvailable
                                      ? 'bg-emerald-500/35 text-emerald-100 ring-2 ring-emerald-400 border border-emerald-300 shadow-md shadow-emerald-500/30 scale-[1.03] z-10'
                                      : 'bg-slate-800 text-slate-400 ring-2 ring-slate-500 border border-slate-400 z-10'
                                    : isAdjacent && isAvailable
                                    ? 'bg-blue-900/85 hover:bg-blue-800 text-blue-100 ring-2 ring-blue-400 border border-blue-300 shadow-md shadow-blue-500/30 scale-[1.02] z-10'
                                    : isAvailable
                                    ? 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-slate-850 hover:bg-slate-800 text-slate-600 border border-slate-800/60'
                                }`}
                              >
                                {isExact || isAdjacent ? (
                                  <span className="tracking-tight text-[8px] font-mono font-bold">
                                    {hour}:30
                                  </span>
                                ) : isAvailable ? (
                                  '○'
                                ) : (
                                  '-'
                                )}
                              </button>
                            );
                          }

                          // 該当時間（hour）のスロットを探す
                          const slot = room.slots?.find((s) => {
                            const d = new Date(s.startTime);
                            return d.getHours() === hour;
                          });

                          const isAvailable = slot?.status === 'available';
                          const isBooked = slot?.status === 'booked';

                          if (!slot) {
                            return (
                              <div
                                key={hour}
                                className={`col-span-2 h-7 rounded border flex items-center justify-center select-none ${
                                  isPhoneOnly
                                    ? 'border-amber-900/40 bg-amber-950/20 text-amber-400/90 text-[9px] font-bold'
                                    : 'border-dashed border-slate-800/80 bg-slate-950/40 text-slate-600 text-[10px]'
                                } ${
                                  isExact
                                    ? 'ring-1 ring-slate-700'
                                    : ''
                                }`}
                                title={
                                  isPhoneOnly
                                    ? `${room.studio.name} ${room.name} ${slotTimeStr}〜 - 電話予約店舗（公式へお電話でお問い合わせください）`
                                    : `${room.studio.name} ${room.name} ${slotTimeStr}〜 - 空き枠データ未取得（公式WEB予約サイトをご確認ください）`
                                }
                              >
                                {isPhoneOnly ? 'TEL' : '—'}
                              </div>
                            );
                          }

                          return (
                            <button
                              key={hour}
                              type="button"
                              onClick={() => handleSlotClick(room, hour, offsetMin)}
                              title={`${room.studio.name} ${room.name} - ${slotTimeStr}〜 (${isAvailable ? isExact ? '完全一致・空きあり' : isAdjacent ? '前後30分枠・空きあり' : '空きあり' : '予約済'}) - クリックで時間指定`}
                              className={`col-span-2 h-7 rounded text-[10px] font-bold transition-all relative overflow-hidden flex items-center justify-center mx-0.5 cursor-pointer select-none ${
                                isExact
                                  ? isAvailable
                                    ? 'bg-emerald-500/35 text-emerald-100 ring-2 ring-emerald-400 border border-emerald-300 shadow-lg shadow-emerald-500/30 z-10 scale-[1.03]'
                                    : isBooked
                                    ? 'bg-slate-800 text-slate-400 ring-2 ring-slate-500 border border-slate-400 z-10'
                                    : 'bg-amber-500/30 text-amber-200 ring-2 ring-amber-400 border border-amber-300 z-10'
                                  : isAdjacent && isAvailable
                                  ? 'bg-blue-900/85 hover:bg-blue-800 text-blue-100 ring-2 ring-blue-400 border border-blue-300 shadow-lg shadow-blue-500/30 z-10 scale-[1.02]'
                                  : isAvailable
                                  ? 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40 hover:scale-[1.02] hover:z-10'
                                  : isBooked
                                  ? 'bg-slate-850 hover:bg-slate-800 text-slate-600 border border-slate-800/50'
                                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {/* 完全一致（緑強調）または 前後30分候補（青強調）の表示 */}
                              {isExact ? (
                                <>
                                  <span className="tracking-tight text-[9px] font-mono font-bold text-emerald-200">
                                    {slotTimeStr}
                                  </span>
                                  {isAvailable && (
                                    <span className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  )}
                                </>
                              ) : isAdjacent && isAvailable ? (
                                <>
                                  <span className="tracking-tight text-[9px] font-mono font-bold text-blue-200">
                                    {slotTimeStr}
                                  </span>
                                  <span className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                </>
                              ) : isAvailable ? (
                                <span className="text-[11px] font-bold text-emerald-400/90">○</span>
                              ) : (
                                <span className="text-[10px] text-slate-600">-</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

