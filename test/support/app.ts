export const APP_ID = driver.isAndroid
  ? 'com.saucelabs.mydemoapp.rn'
  : 'com.saucelabs.mydemo.app.ios'

export async function resetApp(): Promise<void> {
  await driver.terminateApp(APP_ID)
  await driver.activateApp(APP_ID)
}
