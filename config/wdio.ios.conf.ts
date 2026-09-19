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
  'appium:wdaLaunchTimeout': 120_000,
}

if (process.env.IOS_UDID) {
  capabilities['appium:udid'] = process.env.IOS_UDID
}

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  specs: [
    ...(sharedConfig.specs as string[]),
    path.join(process.cwd(), 'test/specs/ios/*.spec.ts'),
  ],
  capabilities: [capabilities],
}
