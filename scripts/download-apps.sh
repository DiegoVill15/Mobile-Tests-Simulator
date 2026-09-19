#!/usr/bin/env bash
#
# Downloads the Sauce Labs "My Demo App" binaries used as the Application Under Test.
# The binaries are intentionally NOT committed to the repository (see .gitignore).
#
# Usage: npm run apps:download
#
set -euo pipefail

VERSION="v1.3.0"
ANDROID_APK="Android-MyDemoAppRN.1.3.0.build-244.apk"
IOS_SIM_ZIP="iOS-Simulator-MyRNDemoApp.1.3.0-162.zip"
BASE_URL="https://github.com/saucelabs/my-demo-app-rn/releases/download/${VERSION}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPS_DIR="${ROOT_DIR}/apps"

mkdir -p "${APPS_DIR}/ios"

echo "Downloading Android APK (${ANDROID_APK})..."
curl -sSL -o "${APPS_DIR}/Android-MyDemoAppRN.apk" "${BASE_URL}/${ANDROID_APK}"

echo "Downloading iOS Simulator build (${IOS_SIM_ZIP})..."
curl -sSL -o "${APPS_DIR}/${IOS_SIM_ZIP}" "${BASE_URL}/${IOS_SIM_ZIP}"
unzip -oq "${APPS_DIR}/${IOS_SIM_ZIP}" -d "${APPS_DIR}/ios"
rm -f "${APPS_DIR}/${IOS_SIM_ZIP}"

echo "Done. Binaries available in ${APPS_DIR}"
