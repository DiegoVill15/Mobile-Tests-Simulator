#!/usr/bin/env bash
#
# Stops the Appium server started with `npm run appium:start`.
#
set -euo pipefail

PORT="${APPIUM_PORT:-4723}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="${ROOT_DIR}/logs/appium.pid"

if [ -f "${PID_FILE}" ]; then
  PID="$(cat "${PID_FILE}")"
  if kill "${PID}" >/dev/null 2>&1; then
    echo "Stopped Appium (pid ${PID})."
  else
    echo "Appium process ${PID} was not running."
  fi
  rm -f "${PID_FILE}"
else
  echo "No PID file found."
fi

# Fallback: free the port if something is still listening on it.
if lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port ${PORT} still in use, freeing it..."
  lsof -nP -tiTCP:"${PORT}" -sTCP:LISTEN | xargs kill >/dev/null 2>&1 || true
fi

echo "Done."
