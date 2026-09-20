import { expect } from '@wdio/globals'
import { loginScreen, productsScreen, sideMenu } from '../../pageobjects'
import type { IOSLoginScreen } from '../../pageobjects/ios/LoginScreen'

describe('Authentication (iOS)', () => {
  it('shows a native validation alert when fields are missing', async () => {
    await productsScreen.waitForDisplayed()
    await sideMenu.openLogin()
    await loginScreen.waitForDisplayed()

    await loginScreen.submit()

    const iosLogin = loginScreen as IOSLoginScreen
    await expect(iosLogin.validationAlert).toBeDisplayed()
    await iosLogin.dismissValidationAlert()
  })
})
