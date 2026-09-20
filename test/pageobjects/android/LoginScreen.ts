import { BaseLoginScreen } from '../base/BaseLoginScreen'

/**
 * Android login: rejected credentials render an inline error node whose child
 * TextView holds the message. There is no native alert to dismiss.
 */
export class AndroidLoginScreen extends BaseLoginScreen {
  get genericError() {
    return $(this.locators.genericError as string)
  }

  async getGenericErrorMessage(): Promise<string> {
    const message = this.genericError.$('android.widget.TextView')
    return (await message.isExisting()) ? (await message.getText()).trim() : ''
  }
}
