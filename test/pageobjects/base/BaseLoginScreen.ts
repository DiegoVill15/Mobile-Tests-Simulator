import type { LoginScreenLocators } from '../locators/types'

/**
 * Shared login behaviour. Platform-specific differences (inline error on
 * Android vs native alert on iOS) are implemented in the subclasses.
 */
export abstract class BaseLoginScreen {
  protected readonly locators: LoginScreenLocators

  constructor(locators: LoginScreenLocators) {
    this.locators = locators
  }

  get usernameInput() {
    return $(this.locators.usernameInput)
  }

  get passwordInput() {
    return $(this.locators.passwordInput)
  }

  get loginButton() {
    return $(this.locators.loginButton)
  }

  async waitForDisplayed(): Promise<void> {
    await this.usernameInput.waitForDisplayed()
  }

  /** Uses the demo account autofill button, which avoids the on-screen keyboard. */
  async fillWithValidCredentials(): Promise<void> {
    await $(this.locators.validCredentials).click()
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.setValue(username)
    await this.passwordInput.setValue(password)
    await this.submit()
  }

  async submit(): Promise<void> {
    await this.loginButton.click()
  }

  async getGenericErrorMessage(): Promise<string> {
    return ''
  }

  async isValidationAlertDisplayed(): Promise<boolean> {
    return false
  }
  
  async dismissValidationAlert(): Promise<void> {
  }
}
