import type { SideMenuLocators } from '../locators/types'

/**
 * Shared navigation behaviour. The entry point differs per platform (hamburger
 * menu on Android, bottom "More" tab on iOS) but the resulting actions are the
 * same, so the flow lives here and only the navigation locator changes.
 */
export class SideMenu {
  private readonly locators: SideMenuLocators

  constructor(locators: SideMenuLocators) {
    this.locators = locators
  }

  get navigation() {
    return $(this.locators.navigation)
  }

  get loginItem() {
    return $(this.locators.loginItem)
  }

  get logoutItem() {
    return $(this.locators.logoutItem)
  }

  async openLogin(): Promise<void> {
    await this.openNavigation()
    await this.loginItem.waitForDisplayed()
    await this.loginItem.click()
  }

  async logout(): Promise<void> {
    await this.openNavigation()
    await this.logoutItem.waitForDisplayed()
    await this.logoutItem.click()
  }

  private async openNavigation(): Promise<void> {
    await this.navigation.click()
  }
}
