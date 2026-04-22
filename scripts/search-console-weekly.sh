#!/bin/zsh

set -euo pipefail

REPO_DIR="/Users/rosyyu/Documents/Playground/site"
LOG_DIR="$REPO_DIR/.search-console/logs"

mkdir -p "$LOG_DIR"

export HOME="/Users/rosyyu"
export NVM_DIR="$HOME/.nvm"

if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  . "$NVM_DIR/nvm.sh"
fi

if command -v nvm >/dev/null 2>&1; then
  nvm use default >/dev/null 2>&1 || nvm use >/dev/null 2>&1 || true
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node is not available to launchd. Check your nvm installation and default Node version." >&2
  exit 1
fi

cd "$REPO_DIR"

echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] Running weekly Search Console snapshot"
node scripts/search-console.js snapshot --days=28
echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] Weekly Search Console snapshot complete"
