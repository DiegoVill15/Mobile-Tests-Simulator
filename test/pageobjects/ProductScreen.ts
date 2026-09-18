/**
 * Product detail screen, reached by tapping a catalog item.
 */
class ProductScreen {
  get screen() {
    return $('~product screen')
  }

  get price() {
    return $('~product price')
  }

  get addToCartButton() {
    return $('~Add To Cart button')
  }

  async waitForDisplayed(): Promise<void> {
    await this.screen.waitForDisplayed()
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click()
  }
}

export default new ProductScreen()
