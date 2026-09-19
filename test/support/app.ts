export const APP_ID = driver.isAndroid
  ? 'com.saucelabs.mydemoapp.rn'
  : 'com.saucelabs.mydemo.app.ios'

export async function resetApp(): Promise<void> {
  await driver.terminateApp(APP_ID)
  await driver.execute('mobile: clearApp', driver.isAndroid
    ? { appId: APP_ID }
    : { bundleId: APP_ID })
  await driver.activateApp(APP_ID)
}
