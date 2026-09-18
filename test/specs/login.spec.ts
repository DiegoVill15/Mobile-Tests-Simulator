import { expect } from '@wdio/globals'
import LoginScreen from '../pageobjects/LoginScreen'
import ProductsScreen from '../pageobjects/ProductsScreen'
import SideMenu from '../pageobjects/SideMenu'

describe('Authentication', () => {
  it('shows a generic error when credentials are invalid', async () => {
    await ProductsScreen.waitForDisplayed()
    await SideMenu.openLogin()
    await LoginScreen.waitForDisplayed()

    await LoginScreen.login('invalid@example.com', 'invalid-password')

    await expect(LoginScreen.genericError).toBeDisplayed()
    const errorMessage = await LoginScreen.getGenericErrorMessage()
    expect(errorMessage).toContain('do not match')
  })

  it('logs in successfully with valid credentials', async () => {
    await SideMenu.openLogin()
    await LoginScreen.waitForDisplayed()

    await LoginScreen.fillWithValidCredentials()
    await LoginScreen.submit()

    await expect(ProductsScreen.screen).toBeDisplayed()
  })
})
