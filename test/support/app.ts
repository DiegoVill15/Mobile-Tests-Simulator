/**
 * Resets the Application Under Test to a clean state so each test starts from
 * the same place (the product catalog, logged out).
 *
 * A plain restart is not enough: the app persists the session, so a previous
 * test could leave it logged in. We clear the app data and relaunch it.
 *
 * Note: the "clear app" argument name differs per driver: Android
 * (UiAutomator2) expects "appId", iOS (XCUITest) expects "bundleId".
 */
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
