import { BaseProductsScreen } from '../base/BaseProductsScreen'

export class IOSProductsScreen extends BaseProductsScreen {
  get cartBadge() {
    return $(this.locators.cartBadge)
  }

  get catalogTab() {
    return $(this.locators.catalogTab as string)
  }

  async getCartBadgeCount(): Promise<string> {
    return (await this.cartBadge.isExisting())
      ? (await this.cartBadge.getText()).trim()
      : '0'
  }

  async goToCatalog(): Promise<void> {
    await this.catalogTab.click()
    await this.waitForDisplayed()
  }
}
