import { androidLocators } from './android'
import { iosLocators } from './ios'
import type { AppLocators } from './types'

export type { AppLocators } from './types'

/**
 * Single source of truth for platform-specific locators.
 * The only platform branch for locating elements lives here.
 */
export const locators: AppLocators = driver.isAndroid ? androidLocators : iosLocators
