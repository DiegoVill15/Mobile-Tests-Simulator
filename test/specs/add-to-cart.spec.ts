import { expect } from '@wdio/globals'
import { productScreen, productsScreen } from '../pageobjects'

describe('Shopping cart', () => {
  it('adds a product to the cart and updates the badge', async () => {
    await productsScreen.waitForDisplayed()

    await productsScreen.openFirstProduct()
    await productScreen.waitForDisplayed()

    await productScreen.addToCart()

    await productsScreen.goToCatalog()

    expect(await productsScreen.getCartBadgeCount()).not.toEqual('0')
  })
})
