#!/bin/zsh

set -euo pipefail

TARGET_PLIST="$HOME/Library/LaunchAgents/com.gomarketing.searchconsole.weekly.plist"
GUI_DOMAIN="gui/$(id -u)"

launchctl bootout "$GUI_DOMAIN" "$TARGET_PLIST" >/dev/null 2>&1 || true

if [[ -f "$TARGET_PLIST" ]]; then
  rm "$TARGET_PLIST"
fi

echo "Removed weekly Search Console launch agent."
