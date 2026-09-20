import path from 'node:path'
import { config as sharedConfig } from './wdio.shared.conf'

const appPath = path.join(process.cwd(), 'apps', 'ios', 'SauceLabs-Demo-App.app')

const capabilities: WebdriverIO.Capabilities = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': process.env.IOS_DEVICE_NAME ?? 'iPhone 15',
  'appium:platformVersion': process.env.IOS_PLATFORM_VERSION ?? '27.0',
  'appium:app': appPath,
  'appium:newCommandTimeout': 240,
  'appium:wdaLaunchTimeout': 240_000,
  'appium:wdaConnectionTimeout': 240_000,
}

if (process.env.IOS_UDID) {
  capabilities['appium:udid'] = process.env.IOS_UDID
}

// When the runner script provides a prebuilt WebDriverAgent, tell XCUITest to
// install and use it instead of building WDA with xcodebuild on session start.
// This requires iOS 17+ (see the preinstalled-WDA guide in the Appium docs).
if (process.env.IOS_PREBUILT_WDA) {
  const platformMajor = Number((process.env.IOS_PLATFORM_VERSION ?? '27.0').split('.')[0])
  if (!Number.isInteger(platformMajor) || platformMajor < 17) {
    throw new Error(
      `Prebuilt WebDriverAgent requires iOS 17+, but the simulator runtime is ${process.env.IOS_PLATFORM_VERSION}`,
    )
  }
  const appiumCapabilities = capabilities as Record<string, unknown>
  appiumCapabilities['appium:usePreinstalledWDA'] = true
  appiumCapabilities['appium:prebuiltWDAPath'] = process.env.IOS_PREBUILT_WDA
}

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  specs: [
    ...(sharedConfig.specs as string[]),
    path.join(process.cwd(), 'test/specs/ios/*.spec.ts'),
  ],
  capabilities: [capabilities],
  /**
   * Give Appium more time to come up. On a loaded macOS CI runner the default
   * 30s is not always enough and the run fails with "Appium did not start
   * within expected time" before any test can run.
   */
  services: [['appium', { appiumStartTimeout: 120_000 }]],
  /**
   * Keep extra room for simulator startup and Appium session creation on CI.
   */
  connectionRetryTimeout: 300_000,
}
