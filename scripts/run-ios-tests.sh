#!/usr/bin/env bash
#
# Runs the iOS test suite in CI.
#
# The GitHub macOS runners ship a set of iOS simulator runtimes, and which ones
# are available depends on the runner image. Instead of hardcoding a device and
# OS version, this script discovers the newest available iPhone simulator, boots
# it and hands its identity to WebdriverIO through the environment (see
# config/wdio.ios.conf.ts).
#
# set -euo pipefail and this being a script file (instead of inline workflow
# steps) keep it reusable and runnable locally too.
#
set -euo pipefail

# Make sure relative paths (apps/, config/, logs/) resolve from the repo root.
cd "$(dirname "${BASH_SOURCE[0]}")/.."

mkdir -p logs

# Pretty-print the newest available iPhone simulator as: udid|name|version
select_simulator() {
  xcrun simctl list devices available --json | node -e '
    const fs = require("fs");
    const data = JSON.parse(fs.readFileSync(0, "utf8"));
    const runtimes = Object.entries(data.devices)
      .filter(([runtime]) => runtime.includes("SimRuntime.iOS-"))
      .map(([runtime, devices]) => ({
        version: runtime.replace(/.*SimRuntime\.iOS-/, "").replace(/-/g, "."),
        devices,
      }))
      .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));

    let result = "";
    for (const { version, devices } of runtimes) {
      const device = devices.find((d) => d.name.startsWith("iPhone"));
      if (device) {
        result = `${device.udid}|${device.name}|${version}`;
        break;
      }
    }

    if (!result) {
      console.error("No available iPhone simulator found");
      process.exitCode = 1;
    } else {
      process.stdout.write(result);
    }
  '
}

SIMULATOR="$(select_simulator)"
IFS='|' read -r IOS_UDID IOS_DEVICE_NAME IOS_PLATFORM_VERSION <<< "${SIMULATOR}"
export IOS_UDID IOS_DEVICE_NAME IOS_PLATFORM_VERSION
export ALLURE_OUTPUT_DIR="${ALLURE_OUTPUT_DIR:-allure-results/ios}"

# Download a prebuilt WebDriverAgent for the simulator instead of building it
# with xcodebuild on the first session.
WDA_DIR="$(mktemp -d)/wda"
echo "Downloading prebuilt WebDriverAgent..."
npx appium driver run xcuitest download-wda \
  -- --kind sim --platform iOS --outdir "${WDA_DIR}"

IOS_PREBUILT_WDA="$(find "${WDA_DIR}" -type d -name 'WebDriverAgentRunner-Runner.app' -print -quit)"
if [ -z "${IOS_PREBUILT_WDA}" ]; then
  echo "Could not find WebDriverAgentRunner-Runner.app in ${WDA_DIR}" >&2
  exit 1
fi
export IOS_PREBUILT_WDA
echo "Using prebuilt WebDriverAgent: ${IOS_PREBUILT_WDA}"

echo "Booting simulator: ${IOS_DEVICE_NAME} (iOS ${IOS_PLATFORM_VERSION}) [${IOS_UDID}]"
xcrun simctl boot "${IOS_UDID}" 2>/dev/null || true

BOOTED=false
for _ in $(seq 1 90); do
  if xcrun simctl bootstatus "${IOS_UDID}" 2>/dev/null | grep -q "Booted"; then
    BOOTED=true
    break
  fi
  if [ "$(xcrun simctl list devices | grep "${IOS_UDID}" | grep -c "Booted")" -gt 0 ]; then
    BOOTED=true
    break
  fi
  sleep 2
done
if [ "${BOOTED}" != "true" ]; then
  echo "Simulator ${IOS_UDID} did not finish booting" >&2
  xcrun simctl list devices | grep "${IOS_UDID}" || true
  exit 1
fi
echo "Simulator booted."

npx wdio run config/wdio.ios.conf.ts --waitforTimeout 20000 2>&1 \
  | tee logs/ios-tests.log
