import { Page } from "@playwright/test";
import InitializationPage from "../helper-functions/page";
import checkoutPageElements from "../page-elements/checkout-page-elements";
import CHECKOUT_PAGE_CONSTANTS from "../constants/checkoutPage.ts";
import "dotenv/config";

export default class CheckoutPage {
  /**
   * The Playwright Page object
   */
  page: Page;
  /**
   * Instance of InitializationPage for common page interactions
   * @private
   */
  private common: InitializationPage;

  /**
   * Initializes a new instance of membersPage
   * @param page The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
    this.common = new InitializationPage(page);
  }

  /**
   * Verifies that the current page is the checkout page by checking the URL and header text.
   */
  async verifyCheckoutPage() {
    await this.common.expectHaveURL(CHECKOUT_PAGE_CONSTANTS.CHECKOUT_URL);
    await this.common.expectInnerText(
      checkoutPageElements.header,
      CHECKOUT_PAGE_CONSTANTS.CHECKOUT_HEADER
    );
  }

  /**
   * Clicks the confirm button in the confirm order step and waits for the page to load.
   */
  async clickConfirmBtnInConfirmOrderStep() {
    await this.common.clickOnElement(checkoutPageElements.checkoutConfirm);
    await this.common.waitForPageLoad();
  }

  /**
   * Clicks the continue button in the billing address step and waits for the page to load.
   */
  async clickOnContinueInBillingAddress() {
    await this.common.clickOnElement(
      checkoutPageElements.billingAddressContinue
    );
    await this.common.waitForPageLoad();
  }

  /**
   * Clicks the continue button in the shipping address step and waits for the page to load.
   */
  async clickOnContinueInShippingAddress() {
    await this.common.clickOnElement(
      checkoutPageElements.shippingAddressContinue
    );
    await this.common.waitForPageLoad();
  }

  /**
   * Clicks the continue button in the shipping method step and waits for the page to load.
   */
  async clickOnContinueInShippingMethod() {
    await this.common.clickOnElement(
      checkoutPageElements.shippingMethodContinue
    );
    await this.common.waitForPageLoad();
  }

  /**
   * Clicks the continue button in the payment method step and waits for the page to load.
   */
  async clickOnContinueInPaymentMethod() {
    await this.common.clickOnElement(
      checkoutPageElements.paymentMethodContinue
    );
    await this.common.waitForPageLoad();
  }

  /**
   * Clicks the continue button in the payment info step and waits for the page to load.
   */
  async clickOnContinueInPaymentInfo() {
    await this.common.clickOnElement(checkoutPageElements.paymentInfoContinue);
    await this.common.waitForPageLoad();
  }

  /**
   * Verifies the thank you message is displayed, logs the order ID, clicks the continue button, and waits for the page to load.
   */
  async verifyThankYouMessage() {
    await this.common.waitForPageLoad();
    await this.common.expectInnerText(
      checkoutPageElements.thankYouMessage.title,
      CHECKOUT_PAGE_CONSTANTS.THANK_YOU_MESSAGE_TITLE
    );
    const orderIdText = await this.common.getTextContents(
      checkoutPageElements.thankYouMessage.orderId
    );
    console.log(orderIdText?.trim() || "");
    await this.common.clickOnElement(
      checkoutPageElements.thankYouMessage.continueBtn
    );
    await this.common.waitForPageLoad();
  }
}
