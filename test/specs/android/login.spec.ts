import { expect } from '@wdio/globals'
import { loginScreen, productsScreen, sideMenu } from '../../pageobjects'
import type { AndroidLoginScreen } from '../../pageobjects/android/LoginScreen'

describe('Authentication (Android)', () => {
  it('shows an inline error for invalid credentials', async () => {
    await productsScreen.waitForDisplayed()
    await sideMenu.openLogin()
    await loginScreen.waitForDisplayed()

    await loginScreen.login('invalid@example.com', 'invalid-password')

    const androidLogin = loginScreen as AndroidLoginScreen
    await expect(androidLogin.genericError).toBeDisplayed()
    expect(await androidLogin.getGenericErrorMessage()).toContain('do not match')
  })
})
