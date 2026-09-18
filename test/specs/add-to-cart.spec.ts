import { expect } from '@wdio/globals'
import ProductScreen from '../pageobjects/ProductScreen'
import ProductsScreen from '../pageobjects/ProductsScreen'

describe('Shopping cart', () => {
  it('adds a product to the cart and updates the badge', async () => {
    await ProductsScreen.waitForDisplayed()

    await ProductsScreen.openFirstProduct()
    await ProductScreen.waitForDisplayed()

    await ProductScreen.addToCart()

    await browser.back()
    await ProductsScreen.waitForDisplayed()

    expect(await ProductsScreen.getCartBadgeCount()).toEqual('1')
  })
})
