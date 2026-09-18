/**
 * Login screen.
 * Locators rely on accessibility labels, which are shared between Android and iOS.
 */
class LoginScreen {
  get screen() {
    return $('~login screen')
  }

  get usernameInput() {
    return $('~Username input field')
  }

  get passwordInput() {
    return $('~Password input field')
  }

  get loginButton() {
    return $('~Login button')
  }

  get genericError() {
    return $('~generic-error-message')
  }

  get usernameError() {
    return $('~Username-error-message')
  }

  get passwordError() {
    return $('~Password-error-message')
  }

  async waitForDisplayed(): Promise<void> {
    await this.screen.waitForDisplayed()
  }

  async fillWithValidCredentials(): Promise<void> {
    await $('~bob@example.com-autofill').click()
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.setValue(username)
    await this.passwordInput.setValue(password)
    await this.loginButton.click()
  }

  async submit(): Promise<void> {
    await this.loginButton.click()
  }

  async getGenericErrorMessage(): Promise<string> {
    const message = this.genericError.$('android.widget.TextView')
    return (await message.isExisting()) ? (await message.getText()).trim() : ''
  }

  async getUsernameErrorMessage(): Promise<string> {
    const message = this.usernameError.$('android.widget.TextView')
    return (await message.isExisting()) ? (await message.getText()).trim() : ''
  }

  async getPasswordErrorMessage(): Promise<string> {
    const message = this.passwordError.$('android.widget.TextView')
    return (await message.isExisting()) ? (await message.getText()).trim() : ''
  }
}

export default new LoginScreen()
