import type { ProductsScreenLocators } from '../locators/types'

/**
 * Shared product catalog behaviour. Cart badge reading and the way back to the
 * catalog differ per platform and are implemented in the subclasses.
 */
export abstract class BaseProductsScreen {
  protected readonly locators: ProductsScreenLocators

  constructor(locators: ProductsScreenLocators) {
    this.locators = locators
  }

  get screen() {
    return $(this.locators.screen)
  }

  get items() {
    return $$(this.locators.items)
  }

  get firstItem() {
    return this.items[0]
  }

  async waitForDisplayed(): Promise<void> {
    await this.screen.waitForDisplayed()
  }

  async openFirstProduct(): Promise<void> {
    await this.firstItem.click()
  }

  abstract getCartBadgeCount(): Promise<string>
  
  abstract goToCatalog(): Promise<void>
}
