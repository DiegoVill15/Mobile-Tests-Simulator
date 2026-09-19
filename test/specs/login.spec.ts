import { expect } from '@wdio/globals'
import { loginScreen, productsScreen, sideMenu } from '../pageobjects'

describe('Authentication', () => {
  it('logs in successfully with valid credentials', async () => {
    await productsScreen.waitForDisplayed()
    await sideMenu.openLogin()
    await loginScreen.waitForDisplayed()

    await loginScreen.fillWithValidCredentials()
    await loginScreen.submit()

    await expect(productsScreen.screen).toBeDisplayed()
  })
})
