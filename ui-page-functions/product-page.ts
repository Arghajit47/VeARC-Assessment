import { Page } from "@playwright/test";
import InitializationPage from "../helper-functions/page";
import loginPageElements from "../page-elements/login-page-elements";
import productPageElements from "../page-elements/product-page-elements";
import PRODUCT_PAGE_CONSTANTS from "../constants/productPage";
import "dotenv/config";
import { randomNumberExpect } from "../helper-functions/utils";

export default class ProductPage {
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

  async verifyProductPageIsDisplayed() {
    await this.common.expectInnerText(
      productPageElements.accountInfo,
      process.env.VALID_USERNAME!
    );
    await this.common.expectVisible(loginPageElements.navbar.logout);
  }

  async searchProducts(productName: string) {
    await this.common.typeOnElement(productPageElements.searchBox, productName);
    await this.common.clickOnElement(productPageElements.searchBtn);
    await this.common.waitForPageLoad();
    await this.common.expectVisibleAllElements(productPageElements.products);
  }

  async verifySearchModalIsDisplayed(productName: string) {
    await this.common.expectInnerText(
      productPageElements.searchModal.header,
      PRODUCT_PAGE_CONSTANTS.SEARCH_MODAL_HEADER
    );
    await this.common.expectInnerText(
      productPageElements.searchModal.searchKeywordLabel,
      PRODUCT_PAGE_CONSTANTS.SEARCH_MODAL_KEYWORD_LABEL
    );
    await this.common.expectAttribute(
      productPageElements.searchModal.searchKeywordInput,
      "value",
      productName
    );
  }

  async addProductsToCart() {
    const productCount = await this.common.getCountOfElements(
      productPageElements.products
    );
    if (productCount > 1) {
      const randomIndex = randomNumberExpect(1, productCount);
      await this.common.clickOnElement(
        productPageElements.products,
        randomIndex
      );
    } else {
      console.log("Only one product is available");
      await this.common.clickOnElement(productPageElements.products);
    }
    await this.common.waitForPageLoad();
    // await this.common.typeOnElement(productPageElements.productQuantity, "2");
    const productDetails = await this.storeProductDetails();
    await this.common.clickOnElement(productPageElements.addToCartBtn);
    await this.common.expectInnerText(
      productPageElements.addToCartNotification,
      "The product has been added to your shopping cart"
    );
    await this.common.clickOnElement(productPageElements.notificationCloseBtn);
    await this.common.waitForPageLoad();
    return productDetails;
  }

  async storeProductDetails() {
    const productName = await this.common.getTextContents(
      productPageElements.productName
    );
    const productPrice = await this.common.getTextContents(
      productPageElements.productPrice
    );
    const productQuantity = await this.common.getAttribute(
      productPageElements.productQuantity,
      "value"
    );
    return {
      productName,
      productPrice,
      productQuantity,
    };
  }

  async verifyTwoItemsInCart() {
    await this.common.expectInnerText(productPageElements.cartCount, "(2)");
  }
}
