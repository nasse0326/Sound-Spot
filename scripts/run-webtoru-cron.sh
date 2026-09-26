#!/bin/bash
# launchd (com.soundspot.webtoru-crawler) からGitHub Actionsと同じ1日4回起動される、
# webtoru.com系3店舗（西船橋・亀戸・松戸ダグアウト2）単独巡回のラッパー。
# 2026-09-26: webtoru.comがGitHub ActionsのIPを403で一律ブロックするようになったため
# ローカル実行に移行（NOAHと同じ経緯）。
# launchdはログインシェルのdotfile群(.zshrc/.zshenv)を読み込まないため、
# Homebrew版Node.jsへのPATHをここで明示的に通す。
set -uo pipefail

PROJECT_DIR="/Users/nasse0326/Developer/006_Band Studio Search"
export PATH="/opt/homebrew/opt/node@22/bin:/opt/homebrew/bin:$PATH"

cd "$PROJECT_DIR" || exit 1

LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/webtoru-cron.log"

TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S')"
echo "===== [$TIMESTAMP] webtoru crawl start =====" >> "$LOG_FILE"

npm run crawl:webtoru >> "$LOG_FILE" 2>&1
EXIT_CODE=$?

echo "===== [$TIMESTAMP] webtoru crawl end (exit $EXIT_CODE) =====" >> "$LOG_FILE"
exit $EXIT_CODE
