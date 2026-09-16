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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* 凡例 & 早朝トグル & 説明（上部パディング領域） */}
      <div className="p-3 sm:p-5 pb-3 sm:pb-4 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-emerald-500/30 text-emerald-400 font-bold text-[10px] border border-emerald-500/50">
                ○
              </span>
              <span className="text-slate-300 font-medium">空き枠 (予約可)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-slate-800 text-slate-400 font-bold text-[10px] border border-slate-700">
                ×
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
              <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                :15
              </span>
              <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/60">
                :30
              </span>
              <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
                :45
              </span>
              <span className="text-[11px]">時差枠 (毎時15/30/45分開始の部屋あり)</span>
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
      </div>

      {/*
        タイムライン縦横スクロール領域（左右パディングpx-0によりsticky left-0が左端に完全に密着）。
        overflow-x-autoだけだとCSS仕様上overflow-yも暗黙にautoへ昇格するが、この要素自体の高さが
        中身に合わせて伸びきってしまい実質スクロールしないため、その暗黙のoverflow-y挙動を
        max-h + overflow-y-autoとして明示的に使う形にし、sticky top-0のヘッダーが「ページ全体」ではなく
        「この枠内」で正しく機能する（＝スクロールしてもヘッダーが常に見える）ようにしている。
      */}
      <div className="overflow-x-auto overflow-y-auto max-h-[70vh] pb-4 pt-1">
        <div 
          className={`${showEarlyMorning ? 'min-w-[1000px] sm:min-w-[1300px]' : 'min-w-[860px] sm:min-w-[1100px]'} [--col-room-w:135px] sm:[--col-room-w:220px]`}
        >
          {/* 時間軸ヘッダー */}
          <div 
            className="grid text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800 items-center sticky top-0 bg-slate-900 z-40"
            style={{
              gridTemplateColumns: `var(--col-room-w) repeat(${HOURS.length * 4}, minmax(0, 1fr))`
            }}
          >
            {/* 部屋一覧固定列（スマホ135px / PC220px、完全不透明bg-slate-900、z-50） */}
            <div className="w-[135px] sm:w-[220px] px-2.5 sm:px-3 flex items-center gap-1.5 text-slate-300 sticky left-0 bg-slate-900 z-50 border-r border-slate-800 shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">部屋一覧</span>
            </div>
            {HOURS.map((hour) => {
              const hStartMin = hour * 60;
              const hEndMin = (hour + 1) * 60;
              const isTargetHour = hStartMin < targetEndMin && hEndMin > targetStartMin;
              return (
                <div
                  key={hour}
                  className={`col-span-4 text-left pl-1 font-mono text-[11px] border-l transition-colors ${
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
          <div className="space-y-4 mt-2 px-1 sm:px-2">
            {studioGroups.map((group) => {
              const is24h = group.studio.is24Hours || group.studio.name.includes('ノア');
              const isLong = group.studio.name.includes('ベースオントップ') || group.studio.name.includes('音楽館');

              return (
                <div key={group.studio.id} className="rounded-xl border border-slate-800/80 bg-slate-950/40">
                  {/* スタジオ見出しヘッダー行 */}
                  <div 
                    className="grid py-1.5 bg-slate-800 border-b border-slate-700/80 items-center text-xs rounded-t-xl"
                    style={{
                      gridTemplateColumns: `var(--col-room-w) repeat(${HOURS.length * 4}, minmax(0, 1fr))`
                    }}
                  >
                    {/* スタジオ名 & 24hバッジ（完全不透明 bg-slate-800, z-30 で固定、左端密着） */}
                    <div className="w-[135px] sm:w-[220px] col-span-1 flex items-center gap-1.5 px-2.5 sm:px-3 sticky left-0 bg-slate-800 z-30 border-r border-slate-700 min-w-0 shrink-0">
                      <span 
                        className="font-bold text-white truncate text-xs" 
                        title={group.studio.name}
                      >
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

                    {/* スタジオ補足情報（駅・部屋数・公式予約リンク、横スクロール時にスタジオ名の裏へ潜り込む） */}
                    <div 
                      className="flex items-center justify-between text-[11px] text-slate-400 pl-3 pr-2 min-w-0"
                      style={{ gridColumn: `2 / span ${HOURS.length * 4}` }}
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
                          className="text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-950/60 hover:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/50 shrink-0 transition ml-2"
                        >
                          <span>公式予約</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* 各部屋の行 */}
                  <div className="divide-y divide-slate-800/40">
                    {group.rooms.map((room, rIdx) => {
                      // 部屋ごとの開始オフセット（0/15/30/45分）。1コマ=15分（4コマ/時間）の
                      // グリッド上で、オフセット分だけ先頭にスペーサーを入れて全体をずらすことで
                      // どの開始分の部屋でも正確な時刻位置に描画する。
                      const offsetMin = room.startTimeOffset || 0;
                      const offsetCols = offsetMin / 15; // 0,1,2,3
                      const isLastRoom = rIdx === group.rooms.length - 1;
                      // GOODMAN AKIBAのように「:00からでも:30からでも開始できる」部屋
                      // （bookingStartGranularityMinutes === 30）は、固定の1点オフセットではなく
                      // 1時間を:00側/:30側の2つの独立した半コマとして描画する必要がある。
                      const granularity = room.bookingStartGranularityMinutes || 60;
                      const isHalfHourGranularity = granularity === 30;

                      // 1コマ分のセルを描画する共通ロジック（1時間=4カラムの通常部屋も、
                      // 30分刻み部屋の半コマ=2カラムも、この関数で共用する）。
                      const renderCell = (
                        slotStartMin: number,
                        spanCols: number,
                        keyId: string,
                        roundRight: boolean,
                        titleTimeRange: string
                      ) => {
                        const cellHour = Math.floor(slotStartMin / 60);
                        const cellMinute = slotStartMin % 60;
                        const slotTimeStr = `${String(cellHour).padStart(2, '0')}:${String(cellMinute).padStart(2, '0')}`;

                        // 完全一致判定 (開始時間が検索条件と完全一致: 緑強調)。
                        // この部屋の実際の開始刻み幅（granularity）ごとに判定することで、
                        // 30分刻み部屋（GOODMAN AKIBA等）の1.5時間一致（例: 11:00開始で
                        // 11:00/11:30/12:00の3コマとも一致対象）を漏れなく緑強調できる。
                        const isExact = slotStartMin >= targetStartMin && slotStartMin < targetEndMin && ((slotStartMin - targetStartMin) % granularity === 0);
                        // 前後30分以内ズレ判定 (:00/:30グリッド前提を置かず、この部屋の実際の
                        // 開始時刻が検索時刻の±30分以内に収まっていれば候補として青強調する)
                        const isAdjacent = allowAdjacent30Min && !isExact && Math.abs(slotStartMin - targetStartMin) <= 30;
                        const isPhoneOnly = room.studio.chainName.includes('PENTA') || (!room.studio.bookingUrl && !!room.studio.tel);

                        const slot = room.slots?.find((s) => {
                          const d = new Date(s.startTime);
                          return d.getHours() === cellHour && d.getMinutes() === cellMinute;
                        });

                        if (!slot) {
                          return (
                            <div
                              key={keyId}
                              style={{ gridColumn: `span ${spanCols} / span ${spanCols}` }}
                              className={`h-7 ${roundRight ? 'rounded-r' : 'rounded'} border flex items-center justify-center select-none ${
                                isPhoneOnly
                                  ? 'border-amber-900/40 bg-amber-950/20 text-amber-400/90 text-[9px] font-bold'
                                  : 'border-dashed border-slate-800/80 bg-slate-950/40 text-slate-600 text-[10px]'
                              } ${isExact ? 'ring-1 ring-slate-700' : ''}`}
                              title={
                                isPhoneOnly
                                  ? `${room.studio.name} ${room.name} ${titleTimeRange} - 電話予約店舗（公式へお電話でお問い合わせください）`
                                  : `${room.studio.name} ${room.name} ${titleTimeRange} - 空き枠データ未取得（公式WEB予約サイトをご確認ください）`
                              }
                            >
                              {isPhoneOnly ? 'TEL' : '—'}
                            </div>
                          );
                        }

                        const isAvailable = slot.status === 'available';
                        const isBooked = slot.status === 'booked';

                        return (
                          <button
                            key={keyId}
                            type="button"
                            onClick={() => handleSlotClick(room, cellHour, cellMinute)}
                            style={{ gridColumn: `span ${spanCols} / span ${spanCols}` }}
                            title={`${room.studio.name} ${room.name} ${titleTimeRange} (${isAvailable ? isExact ? '完全一致・空きあり' : isAdjacent ? '前後30分枠・空きあり' : '空きあり' : '予約済'}) - クリックで時間指定`}
                            className={`h-7 ${roundRight ? 'rounded-r' : 'rounded'} text-[10px] font-bold transition-all relative overflow-hidden flex items-center justify-center mx-0.5 cursor-pointer select-none ${
                              isExact && isAvailable
                                ? 'bg-emerald-500/35 text-emerald-100 ring-2 ring-emerald-400 border border-emerald-300 shadow-lg shadow-emerald-500/30 z-0 scale-[1.03]'
                                : isAdjacent && isAvailable
                                ? 'bg-blue-900/85 hover:bg-blue-800 text-blue-100 ring-2 ring-blue-400 border border-blue-300 shadow-lg shadow-blue-500/30 z-0 scale-[1.02]'
                                : isAvailable
                                ? 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40 hover:scale-[1.02]'
                                : isBooked
                                ? 'bg-slate-850 hover:bg-slate-800 text-slate-600 border border-slate-800/50'
                                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {isExact && isAvailable ? (
                              <>
                                <span className={`tracking-tight ${spanCols <= 2 ? 'text-[8px]' : 'text-[9px]'} font-mono font-bold text-emerald-200`}>
                                  {slotTimeStr}
                                </span>
                                <span className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              </>
                            ) : isAdjacent && isAvailable ? (
                              <>
                                <span className={`tracking-tight ${spanCols <= 2 ? 'text-[8px]' : 'text-[9px]'} font-mono font-bold text-blue-200`}>
                                  {slotTimeStr}
                                </span>
                                <span className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                              </>
                            ) : isAvailable ? (
                              <span className="text-[11px] font-bold text-emerald-400/90">○</span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-500">×</span>
                            )}
                          </button>
                        );
                      };

                      return (
                        <div
                          key={room.id}
                          className={`grid py-1.5 items-center hover:bg-slate-850/40 transition-colors group ${
                            isLastRoom ? 'rounded-b-xl' : ''
                          }`}
                          style={{
                            gridTemplateColumns: `var(--col-room-w) repeat(${HOURS.length * 4}, minmax(0, 1fr))`
                          }}
                        >
                          {/* 部屋情報（完全不透明 bg-slate-900, z-20 で固定、左端密着、右側境界線でスロットを遮断） */}
                          <div 
                            className="w-[135px] sm:w-[220px] px-2 sm:px-3 cursor-pointer select-none sticky left-0 bg-slate-900 hover:bg-slate-850 z-20 flex items-center justify-between transition-colors border-r border-slate-800 min-w-0 shrink-0"
                            onClick={() => onOpenDetail(room)}
                            title={`${room.name} (${room.sizeTatami}帖) - クリックで部屋詳細`}
                          >
                            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 truncate">
                              <span className="font-semibold text-xs text-slate-200 group-hover:text-emerald-400 transition truncate">
                                {room.name}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-slate-400 bg-slate-800 px-1 py-0.2 rounded shrink-0">
                                {room.sizeTatami}帖
                              </span>
                              {offsetMin !== 0 && (
                                <span className={`px-1 py-0.2 rounded font-mono text-[8px] sm:text-[9px] font-bold shrink-0 ${
                                  offsetMin === 15
                                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                                    : offsetMin === 45
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                                    : 'bg-purple-950 text-purple-300 border border-purple-800/60'
                                }`}>
                                  :{String(offsetMin).padStart(2, '0')}
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono shrink-0 pl-1">
                              ¥{(bookingType === 'solo' ? room.pricePerHourSolo : room.pricePerHourRegular).toLocaleString()}
                            </span>
                          </div>

                          {isHalfHourGranularity ? (
                            // 30分刻み部屋: 1時間=4カラムを:00側/:30側の2カラムずつに分けて
                            // それぞれ独立に空き状況を描画する（スペーサー・末尾調整は不要＝
                            // オフセットは常に0のため、通常のオフセット部屋の仕組みとは別経路）。
                            HOURS.map((hour) => (
                              <React.Fragment key={hour}>
                                {renderCell(hour * 60 + offsetMin, 2, `${hour}-a`, false, `${String(hour).padStart(2, '0')}:${String(offsetMin).padStart(2, '0')}〜`)}
                                {renderCell(hour * 60 + offsetMin + 30, 2, `${hour}-b`, false, `${String(hour).padStart(2, '0')}:${String(offsetMin + 30).padStart(2, '0')}〜`)}
                              </React.Fragment>
                            ))
                          ) : (
                            <>
                              {/* 開始オフセットがある場合：先頭に該当分数（15分刻み）の空きスペーサー */}
                              {offsetCols > 0 && (
                                <div
                                  className="h-7 border-r border-dashed border-slate-800/40 bg-slate-950/20"
                                  style={{ gridColumn: `span ${offsetCols} / span ${offsetCols}` }}
                                />
                              )}

                              {/* 各コマ（1時間枠 = 4カラム分・15分単位）の描画 */}
                              {HOURS.map((hour, idx) => {
                                const slotStartMin = hour * 60 + offsetMin;
                                const slotTimeStr = `${String(hour).padStart(2, '0')}:${String(offsetMin).padStart(2, '0')}`;

                                // オフセット付き部屋の最終コマの扱いに対応（例: 23:15〜24:00, 23:30〜24:00等）
                                // スペーサーで先頭をずらした分、末尾のコマはoffsetCols分だけ幅を詰める。
                                if (offsetCols > 0 && idx === HOURS.length - 1) {
                                  const tailSpan = 4 - offsetCols;
                                  return renderCell(slotStartMin, tailSpan, `${hour}`, true, `${slotTimeStr}〜24:00`);
                                }

                                return renderCell(slotStartMin, 4, `${hour}`, false, `${slotTimeStr}〜`);
                              })}
                            </>
                          )}
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
    </div>
  );
};
