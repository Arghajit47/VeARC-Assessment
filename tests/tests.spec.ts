import { expect, test } from "@playwright/test";
import LoginPage from "../ui-page-functions/login-page";
import CheckoutPage from "../ui-page-functions/checkout-page";
import CartPage from "../ui-page-functions/cart-page";
import ProductPage from "../ui-page-functions/product-page";
import "dotenv/config";

let loginPage: LoginPage;
let checkoutPage: CheckoutPage;
let cartPage: CartPage;
let productPage: ProductPage;
let details: any[] = [];
let cartData: any[] = [];

test.setTimeout(120000);

test.describe("VeArc Assessment", async () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    checkoutPage = new CheckoutPage(page);
    cartPage = new CartPage(page);
    productPage = new ProductPage(page);
  });

  test("Adding 2 products to the cart and checking out with verifying", async () => {
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
