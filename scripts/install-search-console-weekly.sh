#!/bin/zsh

set -euo pipefail

REPO_DIR="/Users/rosyyu/Documents/Playground/site"
TARGET_DIR="$HOME/Library/LaunchAgents"
TARGET_PLIST="$TARGET_DIR/com.gomarketing.searchconsole.weekly.plist"
LABEL="com.gomarketing.searchconsole.weekly"
GUI_DOMAIN="gui/$(id -u)"
LOG_DIR="$HOME/Library/Logs/go-marketing-search-console"

mkdir -p "$TARGET_DIR"
mkdir -p "$REPO_DIR/.search-console/logs"
mkdir -p "$LOG_DIR"

export NVM_DIR="$HOME/.nvm"

if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  . "$NVM_DIR/nvm.sh"
fi

if command -v nvm >/dev/null 2>&1; then
  nvm use default >/dev/null 2>&1 || nvm use >/dev/null 2>&1 || true
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node is not available in the current shell. Install Node or fix your nvm setup first." >&2
  exit 1
fi

NODE_BIN="$(command -v node)"

cat > "$TARGET_PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>

  <key>ProgramArguments</key>
  <array>
    <string>$NODE_BIN</string>
    <string>$REPO_DIR/scripts/search-console.js</string>
    <string>snapshot</string>
    <string>--days=28</string>
  </array>

  <key>StartCalendarInterval</key>
  <dict>
    <key>Weekday</key>
    <integer>1</integer>
    <key>Hour</key>
    <integer>9</integer>
    <key>Minute</key>
    <integer>0</integer>
  </dict>

  <key>StandardOutPath</key>
  <string>$LOG_DIR/weekly.out.log</string>

  <key>StandardErrorPath</key>
  <string>$LOG_DIR/weekly.err.log</string>
</dict>
</plist>
EOF

plutil -lint "$TARGET_PLIST" >/dev/null

launchctl bootout "$GUI_DOMAIN" "$TARGET_PLIST" >/dev/null 2>&1 || true
launchctl bootstrap "$GUI_DOMAIN" "$TARGET_PLIST"

echo "Installed weekly Search Console launch agent:"
echo "- Label: $LABEL"
echo "- Plist: $TARGET_PLIST"
echo "- Node: $NODE_BIN"
echo "- Schedule: Every Monday at 09:00 (local Mac time)"
