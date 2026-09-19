import { BaseLoginScreen } from '../base/BaseLoginScreen'

export class IOSLoginScreen extends BaseLoginScreen {
  get validationAlert() {
    return $(this.locators.validationAlert as string)
  }

  get alertDismissButton() {
    return $(this.locators.alertDismissButton as string)
  }

  async isValidationAlertDisplayed(): Promise<boolean> {
    return this.validationAlert.isDisplayed()
  }

  async dismissValidationAlert(): Promise<void> {
    await this.alertDismissButton.click()
  }
}
