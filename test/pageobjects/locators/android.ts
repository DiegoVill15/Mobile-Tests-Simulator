import type { AppLocators } from './types'

export const androidLocators: AppLocators = {
  login: {
    usernameInput: '~Username input field',
    passwordInput: '~Password input field',
    loginButton: '~Login button',
    validCredentials: '~bob@example.com-autofill',
    genericError: '~generic-error-message',
  },
  products: {
    screen: '~products screen',
    items: '~store item',
    cartBadge: '~cart badge',
  },
  product: {
    screen: '~product screen',
    price: '~product price',
    addToCartButton: '~Add To Cart button',
  },
  sideMenu: {
    navigation: '~open menu',
    loginItem: '~menu item log in',
    logoutItem: '~menu item log out',
  },
}
