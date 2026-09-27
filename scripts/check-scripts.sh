#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_DIR="$(mktemp -d)"
trap 'rm -rf "${TEST_DIR}"' EXIT
mkdir -p "${TEST_DIR}/project/scripts" "${TEST_DIR}/bin"
cp "${ROOT_DIR}/scripts/download-apps.sh" "${ROOT_DIR}/scripts/appium-stop.sh" "${TEST_DIR}/project/scripts/"

cat >"${TEST_DIR}/bin/curl" <<'EOF'
#!/usr/bin/env bash
while [ "$#" -gt 0 ]; do
  if [ "$1" = -o ]; then output="$2"; shift 2; else shift; fi
done
: >"${output}"
EOF
cat >"${TEST_DIR}/bin/unzip" <<'EOF'
#!/usr/bin/env bash
mkdir -p "$4/Fake.app"
EOF
chmod +x "${TEST_DIR}/bin/curl" "${TEST_DIR}/bin/unzip"
export PATH="${TEST_DIR}/bin:${PATH}"

for platform in android ios all; do
  rm -rf "${TEST_DIR}/project/apps"
  bash "${TEST_DIR}/project/scripts/download-apps.sh" "${platform}" >/dev/null
  if [ "${platform}" = ios ]; then
    test ! -e "${TEST_DIR}/project/apps/Android-MyDemoAppRN.apk"
  else
    test -f "${TEST_DIR}/project/apps/Android-MyDemoAppRN.apk"
  fi
  if [ "${platform}" = android ]; then
    test ! -e "${TEST_DIR}/project/apps/ios/SauceLabs-Demo-App.app"
  else
    test -d "${TEST_DIR}/project/apps/ios/SauceLabs-Demo-App.app"
  fi
done

rm -rf "${TEST_DIR}/project/apps"
if bash "${TEST_DIR}/project/scripts/download-apps.sh" invalid >/dev/null 2>&1; then
  echo "Invalid platform was accepted" >&2
  exit 1
fi
test ! -e "${TEST_DIR}/project/apps"

mkdir -p "${TEST_DIR}/project/logs"
sleep 60 &
FOREIGN_PID=$!
echo "${FOREIGN_PID}" >"${TEST_DIR}/project/logs/appium.pid"
bash "${TEST_DIR}/project/scripts/appium-stop.sh" >/dev/null
kill -0 "${FOREIGN_PID}"
kill "${FOREIGN_PID}"
wait "${FOREIGN_PID}" 2>/dev/null || true
echo "Script checks passed"
