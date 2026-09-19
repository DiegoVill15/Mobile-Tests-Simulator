/**
 * Locator contracts. Each screen declares the elements it needs; the concrete
 * strings live in locators/android.ts and locators/ios.ts.
 */
export interface LoginScreenLocators {
  usernameInput: string
  passwordInput: string
  loginButton: string
  validCredentials: string
  genericError?: string
  validationAlert?: string
  alertDismissButton?: string
}

export interface ProductsScreenLocators {
  screen: string
  items: string
  cartBadge: string
  catalogTab?: string
}

export interface ProductScreenLocators {
  screen: string
  price: string
  addToCartButton: string
}

export interface SideMenuLocators {
  navigation: string
  loginItem: string
  logoutItem: string
}

export interface AppLocators {
  login: LoginScreenLocators
  products: ProductsScreenLocators
  product: ProductScreenLocators
  sideMenu: SideMenuLocators
}
