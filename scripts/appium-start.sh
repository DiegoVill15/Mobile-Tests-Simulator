#!/usr/bin/env bash
#
# Starts a standalone Appium server for local development / Appium Inspector.
#
# Note: `npm run test:android` and `npm run test:ios` do NOT need this script.
# WebdriverIO starts (and stops) its own Appium server through the
# @wdio/appium-service. Use this only when you want a long-running server,
# e.g. to drive Appium Inspector.
#
# Usage:
#   npm run appium:start          # start in background (default port 4723)
#   APPIUM_PORT=4725 npm run appium:start
#
set -euo pipefail

PORT="${APPIUM_PORT:-4723}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="${ROOT_DIR}/logs"
LOG_FILE="${LOG_DIR}/appium.log"
PID_FILE="${LOG_DIR}/appium.pid"

mkdir -p "${LOG_DIR}"

if lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port ${PORT} is already in use. Run 'npm run appium:stop' first."
  exit 1
fi

# Prefer the locally installed Appium so versions stay pinned to package.json.
if [ -x "${ROOT_DIR}/node_modules/.bin/appium" ]; then
  APPIUM_BIN="${ROOT_DIR}/node_modules/.bin/appium"
else
  APPIUM_BIN="appium"
fi

echo "Starting Appium on http://127.0.0.1:${PORT} ..."
"${APPIUM_BIN}" --address 127.0.0.1 --port "${PORT}" --allow-cors \
  >"${LOG_FILE}" 2>&1 &
echo $! >"${PID_FILE}"

for _ in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:${PORT}/status" >/dev/null 2>&1; then
    echo "Appium is ready (pid $(cat "${PID_FILE}")). Logs: ${LOG_FILE}"
    echo "Inspector -> Remote Host 127.0.0.1 | Port ${PORT} | Path /"
    exit 0
  fi
  sleep 1
done

echo "Appium did not become ready in time. Check ${LOG_FILE}" >&2
exit 1
