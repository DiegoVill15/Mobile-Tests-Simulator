#!/usr/bin/env bash
#
# Downloads the Sauce Labs "My Demo App" binaries used as the Application Under Test.
# The binaries are intentionally NOT committed to the repository (see .gitignore).
#
# Note: the two platforms use different Sauce Labs builds.
#   - Android: React Native build (same app family, accessibility-id based).
#   - iOS:     native build. The React Native iOS simulator artifact is x86_64
#              only and cannot run on Apple Silicon simulators, which are arm64.
#
# Usage: npm run apps:download
#
set -euo pipefail

RN_VERSION="v1.3.0"
ANDROID_APK="Android-MyDemoAppRN.1.3.0.build-244.apk"
RN_BASE_URL="https://github.com/saucelabs/my-demo-app-rn/releases/download/${RN_VERSION}"

IOS_VERSION="2.2.2"
IOS_SIM_ZIP="SauceLabs-Demo-App.Simulator.zip"
IOS_BASE_URL="https://github.com/saucelabs/my-demo-app-ios/releases/download/${IOS_VERSION}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPS_DIR="${ROOT_DIR}/apps"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

mkdir -p "${APPS_DIR}/ios"

echo "Downloading Android APK (${ANDROID_APK})..."
curl -sSL -o "${APPS_DIR}/Android-MyDemoAppRN.apk" "${RN_BASE_URL}/${ANDROID_APK}"

echo "Downloading iOS Simulator build (${IOS_SIM_ZIP})..."
curl -sSL -o "${TMP_DIR}/${IOS_SIM_ZIP}" "${IOS_BASE_URL}/${IOS_SIM_ZIP}"
unzip -oq "${TMP_DIR}/${IOS_SIM_ZIP}" -d "${TMP_DIR}/ios"

APP_PATH="$(find "${TMP_DIR}/ios" -maxdepth 3 -name '*.app' -type d | head -1)"
if [ -z "${APP_PATH}" ]; then
  echo "Could not find a .app bundle inside ${IOS_SIM_ZIP}" >&2
  exit 1
fi

rm -rf "${APPS_DIR}/ios/SauceLabs-Demo-App.app"
cp -R "${APP_PATH}" "${APPS_DIR}/ios/SauceLabs-Demo-App.app"

echo "Done. Binaries available in ${APPS_DIR}"
