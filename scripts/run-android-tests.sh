#!/usr/bin/env bash
#
# Runs the Android test suite in CI.
#
# It is invoked from the workflow as a single command
# (`script: bash scripts/run-android-tests.sh`) on purpose:
# reactivecircus/android-emulator-runner splits the `script` input by line and
# executes each line with `sh -c`, so multi-line shell logic (heredocs, if/fi,
# pipefail) cannot live inline. Keeping it in a script file also makes it
# reusable and testable locally.
#
set -euo pipefail

# Make sure relative paths (apps/, config/, logs/) resolve from the repo root.
cd "$(dirname "${BASH_SOURCE[0]}")/.."

mkdir -p logs

# The emulator action exports ANDROID_SERIAL for the running AVD. Fall back to
# the first online device when running the script outside the action.
ANDROID_UDID="${ANDROID_SERIAL:-$(adb devices | awk '$2 == "device" { print $1; exit }')}"
if [ -z "${ANDROID_UDID}" ]; then
  echo "No online Android emulator found" >&2
  adb devices
  exit 1
fi

export ANDROID_UDID
echo "Running Android tests against emulator: ${ANDROID_UDID}"

npx wdio run config/wdio.android.conf.ts --waitforTimeout 20000 2>&1 \
  | tee logs/android-tests.log
