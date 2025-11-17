import { Page } from "@playwright/test";
import InitializationPage from "../helper-functions/page";
import cartPageElements from "../page-elements/cart-page-elements";
import loginPageElements from "../page-elements/login-page-elements";
import CART_PAGE_CONSTANTS from "../constants/cartPage";
import "dotenv/config";

/**
 * Class representing the Cart page functionality
 * Provides methods for interacting with and validating the shopping cart page
 */
export default class CartPage {
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
   * Initializes a new instance of CartPage
   * @param page The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
    this.common = new InitializationPage(page);
  }

  /**
   * Verifies that the current URL is the cart page URL
   * @returns Promise that resolves when the URL verification is complete
   */
  async verifyCartPageUrl() {
    await this.common.expectHaveURL(CART_PAGE_CONSTANTS.CART_URL);
  }

  /**
   * Clicks on the shopping cart button in the navigation bar
   * @returns Promise that resolves when the click action is complete
   */
  async clickOnCartBtn() {
    await this.common.clickOnElement(loginPageElements.navbar.shoppingCart);
  }

  /**
   * Verifies that product details in the cart match the expected values
   * @param productDetails Object containing product name, price, and quantity
   * @returns Promise that resolves when all verification steps are complete
   */
  async verifyProductInCart(
    productDetails1: {
      productName: string;
      productPrice: string;
      productQuantity: string;
    },
    productDetails2: {
      productName: string;
      productPrice: string;
      productQuantity: string;
    }
  ) {
    for (
      let index = 1;
      index <= parseInt(CART_PAGE_CONSTANTS.EXPECTED_CART_COUNT);
      index++
    ) {
      await this.common.expectVisible(
        cartPageElements.cartTableProductName(
          index === 2
            ? productDetails1.productName
            : productDetails2.productName
        )
      );
      console.log(
        `Product Name: ${
          index === 2
            ? productDetails1.productName
            : productDetails2.productName
        }`
      );

      await this.common.expectVisible(
        cartPageElements.cartTableProductPrice(
          index === 2
            ? String(parseInt(productDetails1.productPrice).toFixed(2))
            : String(parseInt(productDetails2.productPrice).toFixed(2))
        )
      );
      console.log(
        `Product Price: ${
          index === 2
            ? String(parseInt(productDetails1.productPrice).toFixed(2))
            : String(parseInt(productDetails2.productPrice).toFixed(2))
        }`
      );

      await this.common.expectAttribute(
        cartPageElements.cartTableProductQuantity(index),
        "value",
        index === 2
          ? productDetails1.productQuantity
          : productDetails2.productQuantity
      );

      console.log(
        `Product Quantity: ${
          index === 2
            ? productDetails1.productQuantity
            : productDetails2.productQuantity
        }`
      );
    }
    await this.common.expectInnerText(
      cartPageElements.cartTotal,
      String(
        (
          parseInt(productDetails1.productPrice) +
          parseInt(productDetails2.productPrice)
        ).toFixed(2)
      )
    );
  }

  /**
   * Clicks on the checkout button to proceed to checkout
   * @returns Promise that resolves when the click action is complete
   */
  async clickCheckoutBtn() {
    await this.common.clickOnElement(cartPageElements.checkoutBtn);
  }

  /**
   * Accepts the terms and services by clicking the checkbox
   * @returns Promise that resolves when the click action is complete
   */
  async acceptTermsAndServices() {
    await this.common.clickOnElement(cartPageElements.termsAndServices);
  }

  /**
   * Parses the cart table and converts its data into a JSON-friendly array of objects.
   * @returns {Array<Object>} An array of objects, where each object represents a cart item.
   */
  async parseCartTable() {
    // Step 1: Get the headers and create clean, machine-readable keys.
    const headerElements = this.page.locator(cartPageElements.cartTableHeaders);
    const headerTexts = await headerElements.allTextContents();

    const keys = headerTexts.map((headerText) => {
      const keyText = headerText.trim().toLowerCase();
      if (keyText === "product(s)") return "product";
      if (keyText === "qty.") return "quantity";
      return keyText; // e.g., 'remove', 'price', 'total'
    });

    // Step 2: Get all the data rows from the table body.
    const rowElements = this.page.locator(cartPageElements.cartTableRows);
    const rowCount = await rowElements.count();
    const cartData = [];

    // Step 3: Process each row to transform it into a JavaScript object.
    for (let i = 0; i < rowCount; i++) {
      const row = rowElements.nth(i);
      const cells = row.locator(cartPageElements.cartTableCells);
      const cellCount = await cells.count();
      const rowData: Record<string, any> = {};

      // Map cell data to the correct property using keys array.
      for (let j = 0; j < cellCount && j < keys.length; j++) {
        const cell = cells.nth(j);
        const key = keys[j];

        // Extract data based on the key type.
        switch (key) {
          case "product":
            // For product cells, create a nested object.
            const productNameElement = cell.locator(
              cartPageElements.cartTableProductNameLink
            );
            const productName = await productNameElement.textContent();
            rowData[key] = {
              name: productName?.trim() || "",
            };
            break;
          case "price":
            // Find the price span and extract numeric value.
            const priceElement = cell.locator(
              cartPageElements.cartTablePriceSpan
            );
            const priceText = await priceElement.textContent();
            rowData[key] = parseFloat(
              (priceText || "").replace(/[^\d.]/g, "") || "0"
            );
            break;
          case "quantity":
            // Get the value from the quantity input.
            const qtyElement = cell.locator(
              cartPageElements.cartTableQuantityInput
            );
            const qtyValue = await qtyElement.getAttribute("value");
            rowData[key] = parseInt(qtyValue || "0", 10);
            break;

          case "remove":
          case "total":
          case "":
            break;
          default:
            // A fallback for any other columns.
            const cellText = await cell.textContent();
            rowData[key] = cellText?.trim() || "";
        }
      }

      cartData.push(rowData);
    }

    return cartData;
  }

  async verifyCartAndProducts(
    actualObject: Record<string, any>,
    expectedObject: Record<string, any>
  ) {
    await this.common.validateObject(actualObject, expectedObject);
  }
}
