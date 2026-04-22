#!/bin/zsh

set -euo pipefail

REPO_DIR="/Users/rosyyu/Documents/Playground/site"
SOURCE_PLIST="$REPO_DIR/ops/launchd/com.gomarketing.searchconsole.weekly.plist"
TARGET_DIR="$HOME/Library/LaunchAgents"
TARGET_PLIST="$TARGET_DIR/com.gomarketing.searchconsole.weekly.plist"
LABEL="com.gomarketing.searchconsole.weekly"
GUI_DOMAIN="gui/$(id -u)"

mkdir -p "$TARGET_DIR"
mkdir -p "$REPO_DIR/.search-console/logs"

cp "$SOURCE_PLIST" "$TARGET_PLIST"

launchctl bootout "$GUI_DOMAIN" "$TARGET_PLIST" >/dev/null 2>&1 || true
launchctl bootstrap "$GUI_DOMAIN" "$TARGET_PLIST"

echo "Installed weekly Search Console launch agent:"
echo "- Label: $LABEL"
echo "- Plist: $TARGET_PLIST"
echo "- Schedule: Every Monday at 09:00 (local Mac time)"
