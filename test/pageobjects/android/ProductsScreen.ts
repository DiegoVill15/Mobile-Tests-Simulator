import { BaseProductsScreen } from '../base/BaseProductsScreen'

/**
 * Android catalog: the cart badge is a container whose child TextView holds the
 * count, and the hardware back button returns to the catalog.
 */
export class AndroidProductsScreen extends BaseProductsScreen {
  get cartBadge() {
    return $(this.locators.cartBadge)
  }

  async getCartBadgeCount(): Promise<string> {
    const value = this.cartBadge.$('android.widget.TextView')
    return (await value.isExisting()) ? (await value.getText()).trim() : '0'
  }

  async goToCatalog(): Promise<void> {
    await browser.back()
    await this.waitForDisplayed()
  }
}
