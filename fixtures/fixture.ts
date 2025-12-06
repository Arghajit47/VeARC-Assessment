import { test as base } from "@playwright/test";
import CartPage from "../ui-page-functions/cart-page";
import CheckoutPage from "../ui-page-functions/checkout-page";
import ProductPage from "../ui-page-functions/product-page";
import LoginPage from "../ui-page-functions/login-page";

/**
 * Defines the custom fixtures available in the test suite.
 * Each property represents an instance of a page object that will be
 * automatically initialized and made available to every test.
 */
type MyFixtures = {
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  productPage: ProductPage;
  loginPage: LoginPage;
};

/**
 * Extends the base Playwright test with custom fixtures.
 * This new `baseTest` can be imported and used in multiple test files,
 * automatically providing initialized page objects for cart, checkout, product, and login flows.
 */
export const baseTest = base.extend<MyFixtures>({
  /**
   * Provides a CartPage instance to tests.
   * @param page - The Playwright Page object supplied by the test runner.
   * @param use - Function to signal that the fixture is ready for consumption.
   */
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  /**
   * Provides a CheckoutPage instance to tests.
   * @param page - The Playwright Page object supplied by the test runner.
   * @param use - Function to signal that the fixture is ready for consumption.
   */
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  /**
   * Provides a ProductPage instance to tests.
   * @param page - The Playwright Page object supplied by the test runner.
   * @param use - Function to signal that the fixture is ready for consumption.
   */
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  /**
   * Provides a LoginPage instance to tests.
   * @param page - The Playwright Page object supplied by the test runner.
   * @param use - Function to signal that the fixture is ready for consumption.
   */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from "@playwright/test";
