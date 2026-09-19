import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
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
  afterTest: async function (test, _context, { passed }) {
    if (passed) return

    const directory = path.join(process.cwd(), 'logs')
    const name = `${Date.now()}-${test.title.replace(/[^a-zA-Z0-9_-]/g, '_')}`
    // Capture the actual screen before the worker closes its Appium session.
    // Diagnostics must not replace the original test failure.
    try {
      await mkdir(directory, { recursive: true })
      const results = await Promise.allSettled([
        driver.saveScreenshot(path.join(directory, `${name}.png`)),
        driver.getPageSource().then(source =>
          writeFile(path.join(directory, `${name}.xml`), source)),
      ])
      for (const result of results) {
        if (result.status === 'rejected') console.warn('Android diagnostics:', result.reason)
      }
    } catch (error) {
      console.warn('Android diagnostics:', error)
    }
  },
}
