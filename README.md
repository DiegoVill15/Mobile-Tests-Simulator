# Mobile Test Automation — Appium + WebdriverIO + TypeScript

Cross-platform end-to-end test automation for the [Sauce Labs My Demo App](https://github.com/saucelabs/my-demo-app-rn),
running on a real Android emulator and an iOS simulator, with the same test
suite executing on **both platforms** and reports published from CI.

[![Android CI](https://github.com/DiegoVill15/Mobile-Tests-Simulator/actions/workflows/android.yml/badge.svg)](https://github.com/DiegoVill15/Mobile-Tests-Simulator/actions/workflows/android.yml)
[![iOS CI](https://github.com/DiegoVill15/Mobile-Tests-Simulator/actions/workflows/ios.yml/badge.svg)](https://github.com/DiegoVill15/Mobile-Tests-Simulator/actions/workflows/ios.yml)

**[View the test reports](https://diegovill15.github.io/Mobile-Tests-Simulator/)** · [Android](https://diegovill15.github.io/Mobile-Tests-Simulator/android/) · [iOS](https://diegovill15.github.io/Mobile-Tests-Simulator/ios/)

---

## What this project demonstrates

- **One suite, two platforms.** The shared flows (login, add to cart) run
  unchanged on Android and iOS; genuinely platform-specific behaviour lives in
  dedicated classes.
- **Cross-platform Page Object Model** built in three layers (locators as data,
  shared base classes, platform subclasses + a factory).
- **Stable CI.** Both platforms run in GitHub Actions on every pull request and
  on `main`, with Allure reports published to GitHub Pages.
- **Attention to CI reality.** Emulator/simulator startup, WebDriverAgent cold
  starts and other sources of flakiness are handled explicitly (see
  [Engineering notes](#engineering-notes)).

## Tech stack

| Concern        | Choice                                              |
| -------------- | --------------------------------------------------- |
| Automation     | Appium 3 (UiAutomator2 / XCUITest)                  |
| Test runner    | WebdriverIO 9 + Mocha                               |
| Language       | TypeScript (strict)                                 |
| Design pattern | Page Object Model, cross-platform                   |
| Reporting      | Allure, published to GitHub Pages                   |
| CI             | GitHub Actions (Ubuntu for Android, macOS for iOS)  |

## Project structure

```
config/
  wdio.shared.conf.ts      # shared config: specs, timeouts, reporting
  wdio.android.conf.ts     # Android capabilities
  wdio.ios.conf.ts         # iOS capabilities
scripts/
  download-apps.sh         # downloads the app under test (android | ios | all)
  run-android-tests.sh     # CI entry point: waits for boot, runs the suite
  run-ios-tests.sh         # CI entry point: boots the sim, preloads WDA
  appium-start.sh          # standalone Appium server (for Appium Inspector)
  appium-stop.sh
test/
  pageobjects/
    locators/              # selectors as plain data (types + android + ios)
    base/                  # shared behaviour
    android/ · ios/        # platform-specific subclasses
    index.ts               # factory: picks the right instance per platform
  specs/
    login.spec.ts          # shared flow
    add-to-cart.spec.ts    # shared flow
    android/login.spec.ts  # Android-specific: inline error
    ios/login.spec.ts      # iOS-specific: native alert
pages/
  index.html               # landing page for the published reports
.github/workflows/
  android.yml · ios.yml
```

## Page Object Model

Android and iOS share flows but differ in selectors and UX:

| Concern            | Android                        | iOS                                 |
| ------------------ | ------------------------------ | ----------------------------------- |
| Navigation         | Hamburger menu                 | Bottom "More" tab                   |
| Invalid login      | Inline error text              | Native alert                        |
| Back to catalog    | Hardware back button           | "Catalog" tab                       |
| Cart badge         | Accessibility id               | XPath on a static text              |

The design keeps those differences explicit while removing duplication:

1. **Locators as data** — `test/pageobjects/locators/{android,ios}.ts` hold the
   selectors. The only platform branch for *locating* elements is in
   `locators/index.ts`.
2. **Base classes** — `test/pageobjects/base/*` implement the shared flows.
3. **Platform subclasses + factory** — `test/pageobjects/{android,ios}/*` add
   only what differs, and `pageobjects/index.ts` returns the right instance.

Specs never branch on the platform: they import the factory and use one API.

## Getting started

**Requirements:** Node.js ≥ 20, Appium drivers and a device/simulator.

```bash
npm ci                     # install dependencies
npm run apps:download all  # download the Android APK and iOS simulator build

npm run test:android       # run the Android suite
npm run test:ios           # run the iOS suite
npm run typecheck          # TypeScript check
```

### Local environment

- **Android:** Android SDK + an AVD (the CI uses a Pixel 6, API 34). WebdriverIO
  starts and stops its own Appium server via `@wdio/appium-service`; the
  `appium:start` / `appium:stop` scripts are only for a long-running server,
  e.g. to drive Appium Inspector.
- **iOS:** Xcode with an iOS 17+ simulator runtime. The app under test is an
  **arm64 native build** — the React Native iOS artifact is x86_64-only and does
  not run on Apple Silicon simulators.

### Reports locally

```bash
npx allure generate allure-results/android --clean -o allure-report/android
npx allure open allure-report/android
```

## CI pipeline

Both workflows run on pull requests to `main` and on pushes to `main`
(feature branches are validated through the PR, so a branch is never tested
twice). After the tests, each job generates its Allure report, uploads it as a
build artifact, and — **only from `main`** — publishes it to GitHub Pages under
its own subfolder, keeping the other platform's files intact.

```
tests → Allure report → artifact (every run)
                     └→ GitHub Pages /android/ · /ios/  (main only)
```

## Engineering notes

Real problems found while getting the suite green on CI, and how they were solved.

- **iOS simulator build.** The React Native iOS artifact is x86_64-only, so it
  cannot run on arm64 Apple Silicon simulators or `macos-14` runners. The suite
  uses the native arm64 build instead.
- **Emulator ANR from the per-test reset.** To isolate tests we restarted the app
  before each one (`terminate → activate`). On the CI emulator that cycle raced
  with the system launcher and triggered a *"Pixel Launcher isn't responding"*
  dialog that covered the app and failed every test. Since each spec already
  runs in its **own session** (WebdriverIO launches the app per worker), the
  reset was redundant and was removed — which also removed the ANR.
- **Cold boot.** A fresh emulator is slow and prone to system ANRs. CI caches
  the AVD and boots from a snapshot, and waits for `sys.boot_completed` before
  running tests.
- **WebDriverAgent cold start.** The first XCUITest session built WDA with
  `xcodebuild` and blew past the connection timeout (~331 s observed). CI
  downloads a prebuilt WDA and enables `usePreinstalledWDA`, avoiding the build.
- **Duplicate CI runs.** Feature branches were triggering both `push` and
  `pull_request`. The `push` trigger is now limited to `main`.

## Possible next steps

- Group the iOS specs into a single session (one WDA startup instead of one per
  spec file) and measure the gain.
- Add visual regression or more flows (checkout, sorting, product search).
- Run in parallel across multiple devices via a build matrix.

---

Built by [Diego Villalobos](https://github.com/DiegoVill15).
