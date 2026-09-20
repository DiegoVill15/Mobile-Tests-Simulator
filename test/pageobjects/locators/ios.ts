import type { AppLocators } from './types'

export const iosLocators: AppLocators = {
  login: {
    usernameInput: '-ios class chain:**/XCUIElementTypeTextField',
    passwordInput: '-ios class chain:**/XCUIElementTypeSecureTextField',
    loginButton: '-ios class chain:**/XCUIElementTypeButton[`name == "Login"`]',
    validCredentials: '~bob@example.com',
    validationAlert: '-ios predicate string:type == "XCUIElementTypeAlert"',
    alertDismissButton: '~OK',
  },
  products: {
    screen: '~Catalog-screen',
    items: '~ProductItem',
    cartBadge: '//XCUIElementTypeStaticText[@name="Cart"]',
    catalogTab: '~Catalog-tab-item',
  },
  product: {
    screen: '~ProductDetails-screen',
    price: '~Price',
    addToCartButton: '~AddToCart',
  },
  sideMenu: {
    navigation: '~More-tab-item',
    loginItem: '~Login Button',
    logoutItem: '~LogOut-menu-item',
  },
}
