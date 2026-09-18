/**
 * Side (hamburger) navigation menu, available from every screen.
 */
class SideMenu {
  get openMenuButton() {
    return $('~open menu')
  }

  get loginItem() {
    return $('~menu item log in')
  }

  get logoutItem() {
    return $('~menu item log out')
  }

  async openLogin(): Promise<void> {
    await this.openMenuButton.click()
    await this.loginItem.waitForDisplayed()
    await this.loginItem.click()
  }

  async logout(): Promise<void> {
    await this.openMenuButton.click()
    await this.logoutItem.waitForDisplayed()
    await this.logoutItem.click()
  }
}

export default new SideMenu()
