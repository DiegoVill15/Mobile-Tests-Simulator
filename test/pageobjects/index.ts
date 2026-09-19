import { androidLocators } from './locators/android'
import { iosLocators } from './locators/ios'

import { AndroidLoginScreen } from './android/LoginScreen'
import { IOSLoginScreen } from './ios/LoginScreen'
import { AndroidProductsScreen } from './android/ProductsScreen'
import { IOSProductsScreen } from './ios/ProductsScreen'

import { ProductScreen } from './base/ProductScreen'
import { SideMenu } from './base/SideMenu'

import type { BaseLoginScreen } from './base/BaseLoginScreen'
import type { BaseProductsScreen } from './base/BaseProductsScreen'

/**
 * Single place that maps the running platform to concrete screen objects.
 * Specs import these instances and never branch on the platform to locate
 * elements; only genuinely platform-specific behaviour is exposed by the
 * subclasses.
 */
export const loginScreen: BaseLoginScreen = driver.isAndroid
  ? new AndroidLoginScreen(androidLocators.login)
  : new IOSLoginScreen(iosLocators.login)

export const productsScreen: BaseProductsScreen = driver.isAndroid
  ? new AndroidProductsScreen(androidLocators.products)
  : new IOSProductsScreen(iosLocators.products)

export const productScreen = new ProductScreen(
  driver.isAndroid ? androidLocators.product : iosLocators.product,
)

export const sideMenu = new SideMenu(
  driver.isAndroid ? androidLocators.sideMenu : iosLocators.sideMenu,
)
