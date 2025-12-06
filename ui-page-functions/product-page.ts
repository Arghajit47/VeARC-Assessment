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
   * Array to store product details in JSON format
   * @private
   */
  private productDataArray: any[] = [];

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
    let productDetails: any[] = [];
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
    productDetails = await this.storeProductDetails();
    let { firstResponse } = await this.common.captureResponseWhenPageLoad(
      this.common.clickOnElement(productPageElements.addToCartBtn),
      {
        url: PRODUCT_PAGE_CONSTANTS.CART_API_URL,
        method: "POST",
        status: 200,
      }
    );
    const firstResponseJson = await firstResponse.json();
    this.common.expectEqual(firstResponseJson.success, true);
    this.common.expectEqual(
      firstResponseJson.message,
      PRODUCT_PAGE_CONSTANTS.ADDED_TO_CART_API_RESPONSE
    );
    await this.common.expectInnerText(
      productPageElements.addToCartNotification,
      PRODUCT_PAGE_CONSTANTS.ADDED_TO_CART_NOTIFICATION
    );
    await this.common.clickOnElement(productPageElements.notificationCloseBtn);
    await this.common.waitForPageLoad();
    return productDetails;
  }

  async storeProductDetails() {
    const productNameText =
      (
        await this.common.getTextContents(productPageElements.productName)
      )?.trim() ?? "";
    const productPriceText = await this.common.getTextContents(
      productPageElements.productPrice
    );
    const productQuantityText = await this.common.getAttribute(
      productPageElements.productQuantity,
      "value"
    );

    const productData = {
      product: {
        name: productNameText || "",
      },
      price: parseFloat((productPriceText || "").replace(/[^\d.]/g, "") || "0"),
      quantity: parseInt(productQuantityText || "0", 10),
    };

    // Append data to the array instead of overwriting
    this.productDataArray.push(productData);

    return this.productDataArray;
  }

  async verifyTwoItemsInCart() {
    await this.common.expectInnerText(productPageElements.cartCount, "(2)");
  }
}
