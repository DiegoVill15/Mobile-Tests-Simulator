export const APP_ID = driver.isAndroid
  ? 'com.saucelabs.mydemoapp.rn'
  : 'com.saucelabs.mydemo.app.ios'

// Appium's app state value for "the app is running in the foreground".
const APP_STATE_RUNNING_IN_FOREGROUND = 4

export async function resetApp(): Promise<void> {
  await driver.terminateApp(APP_ID)
  await driver.activateApp(APP_ID)
  await driver.waitUntil(
    async () => (await driver.queryAppState(APP_ID)) === APP_STATE_RUNNING_IN_FOREGROUND,
    {
      timeout: 120_000,
      timeoutMsg: `App ${APP_ID} did not reach the foreground after reset`,
    },
  )
}
