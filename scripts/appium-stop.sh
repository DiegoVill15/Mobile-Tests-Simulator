#!/usr/bin/env bash
#
# Stops the Appium server started with `npm run appium:start`.
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="${ROOT_DIR}/logs/appium.pid"
LOG_FILE="${ROOT_DIR}/logs/appium.log"

if [ -f "${PID_FILE}" ]; then
  PID="$(cat "${PID_FILE}")"
  COMMAND="$(ps -p "${PID}" -o command= 2>/dev/null || true)"
  if [[ "${COMMAND}" == *appium* && "${COMMAND}" == *"--log ${LOG_FILE}"* ]] && kill "${PID}" >/dev/null 2>&1; then
    echo "Stopped Appium (pid ${PID})."
  else
    echo "No project Appium process found for pid ${PID}."
  fi
  rm -f "${PID_FILE}"
else
  echo "No PID file found."
fi

echo "Done."
