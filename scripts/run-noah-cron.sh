#!/bin/bash
# launchd (com.soundspot.noah-crawler) から1日2回起動される、NOAH単独巡回のラッパー。
# launchdはログインシェルのdotfile群(.zshrc/.zshenv)を読み込まないため、
# Homebrew版Node.jsへのPATHをここで明示的に通す。
set -uo pipefail

PROJECT_DIR="/Users/nasse0326/Downloads/Antigravity/006_Band Studio Search"
export PATH="/opt/homebrew/opt/node@22/bin:/opt/homebrew/bin:$PATH"

cd "$PROJECT_DIR" || exit 1

LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/noah-cron.log"

TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S')"
echo "===== [$TIMESTAMP] NOAH crawl start =====" >> "$LOG_FILE"

npm run crawl:noah >> "$LOG_FILE" 2>&1
EXIT_CODE=$?

echo "===== [$TIMESTAMP] NOAH crawl end (exit $EXIT_CODE) =====" >> "$LOG_FILE"
exit $EXIT_CODE
