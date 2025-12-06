// import { expect, test } from "@playwright/test";
import { baseTest } from "../fixtures/fixture";
import LoginPage from "../ui-page-functions/login-page";
import CheckoutPage from "../ui-page-functions/checkout-page";
import CartPage from "../ui-page-functions/cart-page";
import ProductPage from "../ui-page-functions/product-page";
import "dotenv/config";

let details: any[] = [];
let cartData: any[] = [];

type MyFixtures = {
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  productPage: ProductPage;
  loginPage: LoginPage;
};

// Extended timeout to accommodate API response validations during login and cart flows

export const test = baseTest.extend<MyFixtures>({
  // Add any additional fixtures if needed
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
});
test.describe("VeArc Assessment", async () => {
  test.setTimeout(120000);
  test("Adding 2 products to the cart and checking out with verifying", async ({
    loginPage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    await test.step("Navigating to the login page", async () => {
      await loginPage.gotoWebpage();
      await loginPage.clickOnLoginButton();
      await loginPage.verifyLoginPageUrl();
    });
    await test.step("Logging in with valid credentials", async () => {
      await loginPage.loginWithValidCredentials();
      await productPage.verifyProductPageIsDisplayed();
    });

    await test.step("Searching for products", async () => {
      await productPage.searchProducts("TCP");
      await productPage.verifySearchModalIsDisplayed("TCP");
      details = await productPage.addProductsToCart();
      await loginPage.gotoWebpage();
      await productPage.searchProducts("Phone Cover");
      await productPage.verifySearchModalIsDisplayed("Phone Cover");
      details = await productPage.addProductsToCart();
      await productPage.verifyTwoItemsInCart();
    });

    await test.step("Verifying the cart table", async () => {
      await cartPage.clickOnCartBtn();
      await cartPage.verifyCartPageUrl();
      cartData = await cartPage.parseCartTable();
      await cartPage.verifyCartAndProducts(cartData, details);
      await cartPage.acceptTermsAndServices();
      await cartPage.clickCheckoutBtn();
    });

    await test.step("Verifying the checkout page", async () => {
      await checkoutPage.verifyCheckoutPage();
      await checkoutPage.clickOnContinueInBillingAddress();
      await checkoutPage.clickOnContinueInShippingAddress();
      await checkoutPage.clickOnContinueInShippingMethod();
      await checkoutPage.clickOnContinueInPaymentMethod();
      await checkoutPage.clickOnContinueInPaymentInfo();
      await checkoutPage.clickConfirmBtnInConfirmOrderStep();
    });

    await test.step("Verifying the order confirmation", async () => {
      await checkoutPage.verifyThankYouMessage();
    });
  });
});
