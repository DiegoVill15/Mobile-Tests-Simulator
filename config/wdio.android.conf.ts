import path from 'node:path'
import { config as sharedConfig } from './wdio.shared.conf'

const apkPath = path.join(process.cwd(), 'apps', 'Android-MyDemoAppRN.apk')

const capabilities: WebdriverIO.Capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'Pixel_6_API_34',
  'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION ?? '14',
  'appium:app': apkPath,
  'appium:appPackage': 'com.saucelabs.mydemoapp.rn',
  'appium:appActivity': 'com.saucelabs.mydemoapp.rn.MainActivity',
  'appium:autoGrantPermissions': true,
  'appium:newCommandTimeout': 240,
}

if (process.env.ANDROID_UDID) {
  capabilities['appium:udid'] = process.env.ANDROID_UDID
}

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  specs: [
    ...(sharedConfig.specs as string[]),
    path.join(process.cwd(), 'test/specs/android/*.spec.ts'),
  ],
  capabilities: [capabilities],
}
