'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * ダーク/ライト切り替えボタン。実際のテーマ切り替え自体はlayout.tsxの
 * ブロッキングスクリプトが<html>のdarkクラスとlocalStorageで管理しており、
 * このコンポーネントはその状態を読み取って表示・トグルするだけ。
 * サーバー側ではlocalStorageの値が分からないため、初期表示は暫定的に
 * ダーク（現行デフォルト）とし、マウント後に実際のクラスへ同期する
 * （アイコンが一瞬だけ実テーマと異なる可能性があるが、ページ全体の
 * 配色自体はブロッキングスクリプトにより最初から正しいテーマで描画される）。
 */
export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // プライベートブラウジング等でlocalStorageが使えない場合は静かに無視
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 dark:bg-slate-800/90 border border-stone-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-500/60 transition-colors cursor-pointer flex-shrink-0"
      suppressHydrationWarning
    >
      {isDark ? (
        <Moon className="w-4 h-4" suppressHydrationWarning />
      ) : (
        <Sun className="w-4 h-4" suppressHydrationWarning />
      )}
    </button>
  );
};
