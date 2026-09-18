/**
 * Product catalog (the app's landing screen).
 */
class ProductsScreen {
  get screen() {
    return $('~products screen')
  }

  get cartBadge() {
    return $('~cart badge')
  }

  get items() {
    return $$('~store item')
  }

  get firstItem() {
    return $('~store item')
  }

  async waitForDisplayed(): Promise<void> {
    await this.screen.waitForDisplayed()
  }

  async openFirstProduct(): Promise<void> {
    await this.firstItem.click()
  }

  async getCartBadgeCount(): Promise<string> {
    const value = this.cartBadge.$('android.widget.TextView')
    return (await value.isExisting()) ? (await value.getText()).trim() : '0'
  }
}

export default new ProductsScreen()
