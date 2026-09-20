import type { ProductScreenLocators } from '../locators/types'

/**
 * Shared product detail behaviour. Identical flow on both platforms; only the
 * locators differ, so there is no subclass needed.
 */
export class ProductScreen {
  private readonly locators: ProductScreenLocators

  constructor(locators: ProductScreenLocators) {
    this.locators = locators
  }

  get screen() {
    return $(this.locators.screen)
  }

  get price() {
    return $(this.locators.price)
  }

  get addToCartButton() {
    return $(this.locators.addToCartButton)
  }

  async waitForDisplayed(): Promise<void> {
    await this.screen.waitForDisplayed()
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click()
  }
}
