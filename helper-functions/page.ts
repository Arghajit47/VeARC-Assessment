/* eslint-disable @typescript-eslint/no-explicit-any */
import { Page, expect, Locator } from "@playwright/test";
/**
 * Base page class that provides common functionality for page interactions
 * Handles initialization, navigation, element interactions, and assertions
 */
export default class InitializationPage {
  /**
   * Common page elements from page-elements/common-page-elements
   * @private
   */
  pageObjects: any;
  /**
   * Playwright Page object for browser interactions
   * @private
   */
  page: Page;
  /**
   * Initializes a new instance of InitializationPage
   * @param page Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the specified URL
   * @param url The URL to navigate to
   */
  async goto(url: string) {
    const options: any = { waitUntil: "load" };
    await this.page.goto(url, options);
  }

  /**
   * Verifies that the current URL contains the expected value
   * @param value The value that should be present in the URL
   * @param page Optional page object (defaults to this.page)
   */
  async expectHaveURL(value: string, page: any = this.page) {
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape special regex chars
    await expect(page).toHaveURL(new RegExp(`.*${escaped}.*`));
  }

  /**
   * Reloads the current page
   */
  async reload() {
    await this.page.reload({ waitUntil: "domcontentloaded" });
    await this.waitForPageLoad();
  }

  /**
   * Navigates back to the previous page in the browser history
   */
  async navigateBack() {
    await this.page.goBack({ waitUntil: "load" });
    await this.waitForPageLoad();
  }

  /**
   * Closes the current page
   */
  async closePage(page: Page = this.page): Promise<void> {
    try {
      if (page && !page.isClosed()) {
        await page.close();
      }
    } catch (error) {
      console.warn("Failed to close page:", error);
      // Or handle as appropriate for your test framework
    }
  }

  /**
   * Creates a delay for the specified time
   * @param ms The number of milliseconds to delay
   * @returns A promise that resolves after the specified time
   */
  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Scrolls the page to make an element visible
   * @param selector The selector for the element to scroll to
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   */
  async scrollToElement(selector: string, index: number = 0) {
    await this.page.locator(selector).nth(index).scrollIntoViewIfNeeded();
  }

  /**
   * Clicks on an element and waits for the page to load
   * @param locator The selector for the element to click
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   */
  async clickOnElement(locator: string | Locator, index: any = 0) {
    await this.waitForPageLoad();
    if (typeof locator === "string") {
      const element = this.page.locator(locator).nth(index);
      await element.waitFor({ state: "visible", timeout: 5000 });
      await element.click({ force: true });
    } else {
      await locator.waitFor({ state: "visible", timeout: 5000 });
      await locator.click({ force: true });
    }
    await this.waitForPageLoad();
  }

  /**
   * Clicks on an element with specific text content at a specific index
   * @param locator The selector for the elements to filter
   * @param text The text content to filter by
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   */
  async clickOnTextElementWithIndex(locator: string, text: string, index = 0) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page
      .locator(locator)
      .filter({ hasText: text })
      .nth(index)
      .click({ force: true });
  }

  /**
   * Verifies that an element's text content matches the expected value
   * @param selector The selector for the element
   * @param expectedValue The expected text content
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   * @param page Optional page object (defaults to this.page)
   */
  async expectText(
    selector: string,
    expectedValue: string,
    index = 0,
    page: any = this.page
  ) {
    const text: string =
      (await this.getTextContents(selector, index, page)) ?? "";
    expect(text.trim()).toBe(expectedValue);
  }

  /**
   * Verifies that an element's inner text content matches the expected value
   * @param selector The selector for the element to check
   * @param expectedValue The expected inner text content
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   * @param page Optional page object (defaults to this.page)
   */
  async expectInnerText(
    selector: string,
    expectedValue: string,
    index = 0,
    page: any = this.page
  ) {
    const text = await this.getVisibleInnerTextContents(selector, index, page);
    expect(text.trim()).toBe(expectedValue.trim());
  }

  /**
   * Verifies that an element's text content contains the expected value
   * @param selector The selector for the element
   * @param expectedValue The value that should be contained in the text content
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   */
  async expectTextContains(selector: string, expectedValue: string, index = 0) {
    const text: string = (await this.getTextContents(selector, index)) ?? "";
    expect(text.trim()).toContain(expectedValue);
  }

  /**
   * Verifies that a text contains the expected value
   * @param text The text to check
   * @param expectedValue The value that should be contained in the text
   */
  async expectContains(text: string, expectedValue: string) {
    expect(text.trim()).toContain(expectedValue);
  }

  /**
   * Verifies that an element is visible
   * @param selector The selector for the element
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   * @param page Optional page object (defaults to this.page)
   */
  async expectVisible(
    selector: string | Locator,
    index = 0,
    page: any = this.page
  ) {
    if (typeof selector === "string") {
      selector = page.locator(selector).nth(index);
    } else {
      const ele = await selector;
      await expect(ele).toBeVisible();
    }
  }

  /**
   * Verifies that an element is enabled
   * @param selector The selector for the element
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   */
  async expectEnable(selector: string, index = 0) {
    const ele = await this.page.locator(selector).nth(index);
    await this.expectVisible(selector, index);
    await expect(ele).toBeEnabled();
  }

  /**
   * Verifies that an element is disabled
   * @param selector The selector for the element
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   */
  async expectDisable(selector: string, index = 0) {
    const ele = await this.page.locator(selector).nth(index);
    await this.expectVisible(selector, index);
    await expect(ele).toBeDisabled();
  }

  /**
   * Verifies that an element is not visible
   * @param selector The selector for the element
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   */
  async expectNotVisible(selector: string, index = 0) {
    const ele = await this.page.locator(selector).nth(index);
    await expect(ele).not.toBeVisible();
  }

  /**
   * Verifies that an element has the expected attribute value
   * @param selector The selector for the element
   * @param attributeName The name of the attribute to check
   * @param attributevalue The expected value of the attribute
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   */
  async expectAttribute(
    selector: string,
    attributeName: string,
    attributevalue: string,
    index = 0
  ) {
    const ele = await this.page.locator(selector).nth(index);
    await expect(ele).toHaveAttribute(attributeName, attributevalue);
  }

  /**
   * Verifies that an element's attribute contains the expected value
   * @param selector The selector for the element
   * @param attributeName The name of the attribute to check
   * @param attributevalue The value that should be contained in the attribute
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   */
  async expectAttributeContains(
    selector: string,
    attributeName: string,
    attributeValue: string,
    index = 0
  ) {
    const ele = this.page.locator(selector).nth(index);
    const actualValue = await ele.getAttribute(attributeName);
    expect(actualValue).toContain(attributeValue);
  }

  /**
   * Gets the text content of an element
   * @param locator The selector for the element
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   * @param page Optional page object (defaults to this.page)
   * @returns The text content of the element
   */
  async getTextContents(locator: string, index = 0, page = this.page) {
    return await page.locator(locator).nth(index).textContent();
  }

  /**
   * Gets the visible inner text content of an element
   * @param locator The selector for the element
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   * @param page Optional page object (defaults to this.page)
   * @returns The visible inner text content of the element
   */
  async getVisibleInnerTextContents(
    locator: string,
    index = 0,
    page = this.page
  ) {
    const ele = await page.locator(locator).nth(index);
    return await ele.innerText();
  }

  /**
   * Waits for the DOM content to be loaded
   */
  async domContentLoaded() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Pauses test execution for debugging
   */
  async pauseForDebugging() {
    await this.page.pause();
  }

  /**
   * Waits for the page to finish loading
   * @param string Optional string to specify wait duration ("max", "min", or default)
   * @param page Optional page object (defaults to this.page)
   */
  async waitForPageLoad(string = "", page = this.page) {
    await this.domContentLoaded();
    await Promise.race([
      page.waitForLoadState("load"),
      page.waitForTimeout(
        string === "max" ? 12000 : string === "min" ? 3000 : 9000
      ),
    ]);
  }

  /**
   * Waits for a specific amount of time
   * @param timeInMs Time to wait in milliseconds
   * @param page Optional page object (defaults to this.page)
   */
  async waitForSomeTime(timeInMs: number, page = this.page) {
    await page.waitForTimeout(timeInMs);
  }

  /**
   * Waits only for the page load event without additional waiting
   * @param page Optional page object (defaults to this.page)
   */
  async waitOnlyForPageLoad(page = this.page) {
    await this.domContentLoaded();
    await page.waitForLoadState("load");
  }

  /**
   * Gets the count of elements matching a selector
   * @param locator The selector for the elements
   * @returns The number of matching elements
   */
  async getElementsCount(locator: string) {
    return await this.page.locator(locator).count();
  }

  /**
   * Verifies that the number of elements matching a selector equals the expected count
   * @param locator The selector for the elements
   * @param length The expected number of elements
   */
  async validateElementsCount(locator: string, length: number) {
    const count = await this.getElementsCount(locator);
    await expect(length).toBe(count);
  }

  /**
   * Verifies that at least one element matching the selector is visible
   * @param selector The selector for the elements
   */
  async expectVisibleAllElements(selector: string) {
    const elementList = await this.page.$$(selector);
    const visibleCount = await Promise.all(
      elementList.map((el) => el.isVisible())
    );
    expect(visibleCount.filter(Boolean).length).toBeGreaterThan(0);
  }

  /**
   * Verifies that all elements matching the selector are not visible
   * @param selector The selector for the elements
   */
  async expectNotVisibleAllElements(selector: string) {
    const elementList = await this.page.$$(selector);
    for (const element of elementList) {
      expect(await element.isVisible()).toBe(false);
    }
  }

  /**
   * Verifies that all elements matching the selector have the expected text
   * @param selector The selector for the elements
   * @param expectedText The expected text content
   */
  async expectTextAllElements(selector: string, expectedText: string) {
    const elementList = await this.page.$$(selector);

    for (const element of elementList) {
      const actualText = await element.textContent();
      expect(actualText?.trim()).toBe(expectedText);
    }
  }

  /**
   * Fills a form field with data
   * @param locator The selector for the form field
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   * @param data The data to fill in the form field
   */
  async fillDataByLocator(locator: string, index = 0, data: string) {
    await this.page.locator(locator).nth(index).fill(data);
  }
  /**
   * Selects a date in a datepicker input field.
   * Works for inputs with type="date" or custom datepicker components.
   * @param locator The selector for the date input field
   * @param date The date to fill (in "YYYY-MM-DD" format or Date object)
   * @param index Optional index if multiple elements match
   */
  async fillDateInDatepicker(locator: string, date: string | Date, index = 0) {
    const dateValue =
      typeof date === "string"
        ? new Date(date).toISOString().split("T")[0] // ✅ converts to "YYYY-MM-DD"
        : date.toISOString().split("T")[0];

    const input = this.page.locator(locator).nth(index);

    await input.click({ force: true });
    await input.fill(dateValue);
    await input.press("Enter");
  }

  /**
   * Types text into an element with optional delay
   * @param locator The selector for the element
   * @param text The text to type
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   * @param timeout Optional delay between keystrokes in milliseconds (default: 0)
   */
  async typeOnElement(
    locator: string,
    text: string,
    index: number = 0,
    timeout = 0
  ) {
    await this.page.locator(locator).nth(index).clear();
    await this.page.locator(locator).nth(index).type(text, { delay: timeout });
  }

  /**
   * Clears the text from an input element
   * @param locator The selector for the input element
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   */
  async clearTxtBox(locator: string, index: number = 0) {
    await this.page.locator(locator).nth(index).clear();
  }

  /**
   * Gets the count of elements matching a selector
   * @param locator The selector for the elements
   * @returns The number of matching elements
   */
  async getCountOfElements(locator: string) {
    return await this.page.locator(locator).count();
  }

  /**
   * Verifies that the number of elements matching a selector equals the expected count
   * @param locator The selector for the elements
   * @param number The expected number of elements
   */
  async expectCount(locator: string, number: number) {
    await expect(this.page.locator(locator)).toHaveCount(number);
  }

  /**
   * Verifies that the number of elements matching a selector is less than the expected number
   * @param locator The selector for the elements
   * @param number The number to compare against
   */
  async expectCountGreaterThan(locator: string, number: number) {
    expect(number).toBeGreaterThan(await this.getElementsCount(locator));
  }

  /**
   * Gets the text content of all elements matching a selector
   * @param locator The selector for the elements
   * @returns An array of text content strings
   */
  async getTextContentOfAllElements(locator: string) {
    const dropdownOptions = await this.page.$$eval(locator, (options) =>
      options.map((option) => option.textContent.trim())
    );
    return dropdownOptions;
  }

  /**
   * Verifies that two values are equal, with optional soft assertion
   * @param expected The expected value
   * @param actual The actual value
   * @param softAssert Whether to use soft assertion (default: true)
   * @returns The expect result for chaining
   */
  async expectEqual(expected: any, actual: any, softAssert = true) {
    if (softAssert) {
      return expect.soft(actual).toStrictEqual(expected);
    } else {
      expect(actual).toStrictEqual(expected);
    }
  }

  /**
   * Validates that text elements match expected enum values
   * @param selectors The selector for the text elements
   * @param enumNames An object mapping keys to expected text values
   * @param page Optional page object (defaults to this.page)
   * @throws Will throw an error if any expected text is not found
   */
  async validateTextsBasedOnEnums(
    selectors: any,
    enumNames: any,
    page = this.page
  ) {
    await page.waitForSelector(selectors, { timeout: 5000 });
    const labels = await page
      .locator(selectors)
      .evaluateAll((elements) =>
        elements
          .map(
            (el) =>
              (el as HTMLElement).innerText
                ?.replace(/\s+/g, " ")
                .trim()
                .toLowerCase() || ""
          )
          .filter((text) => text.length > 0)
      );

    const labelSet = new Set(labels);

    for (const [key, expectedText] of Object.entries(enumNames)) {
      if (typeof expectedText === "string") {
        const normalizedExpectedText = expectedText
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase();
        if (!labelSet.has(normalizedExpectedText)) {
          throw new Error(
            `Validation failed for "${key}". Expected text: "${expectedText}" not found. Available labels: ${[
              ...labelSet,
            ].join(", ")}`
          );
        }
      }
    }
  }

  /**
   * Verifies that a checkbox or radio button is not selected
   * @param selector The selector for the checkbox or radio button
   */
  async verifyNotSelected(selector: string) {
    const isSelected = await this.page.locator(selector);
    expect(isSelected).not.toBeChecked();
  }

  /**
   * Verifies that a checkbox or radio button is selected
   * @param selector The selector for the checkbox or radio button
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   */
  async verifySelected(selector: string, index = 0) {
    const isSelected = await this.page.locator(selector).nth(index);
    expect(isSelected).toBeChecked();
  }

  /**
   * Uploads files to a file input element
   * @param locator The selector for the file input element
   * @param path The path to the file(s) to upload
   */
  async sendFilesToBrowser(locator: string, path: string) {
    await this.page.waitForSelector(locator, { state: "visible" });
    await this.page.locator(locator).setInputFiles(path);
  }

  /**
   * Checks if an element is visible
   * @param locator The selector for the element
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   * @param page Optional page object (defaults to this.page)
   * @returns True if the element is visible, false otherwise
   */
  async isElementVisible(locator: string, index = 0, page = this.page) {
    return await page.locator(locator).nth(index).isVisible({ timeout: 9000 });
  }

  /**
   * Checks if an element is hidden
   * @param locator The selector for the element
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   * @param page Optional page object (defaults to this.page)
   * @returns True if the element is hidden, false otherwise
   */
  async isElementHidden(locator: string, index = 0, page = this.page) {
    return await page.locator(locator).nth(index).isHidden({ timeout: 12000 });
  }

  /**
   * Clicks a button that opens a new window and returns the new page object
   * @param buttonLocator The selector for the button
   * @param buttonIndex Optional index for selecting a specific button when multiple match (default: 0)
   * @returns The Playwright Page object for the new window
   */
  async verifyNewWindow(buttonLocator: string, buttonIndex = 0) {
    // Listen for a new page (popup window/tab)
    const [newPage] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.page.locator(buttonLocator).nth(buttonIndex).click(),
    ]);

    await newPage.waitForLoadState(); // Ensure the new page loads

    // Return the new page context
    return newPage;
  }

  /**
   * Checks if a browser alert is displayed
   * @returns True if an alert was displayed, false otherwise
   */
  async isAlertDisplayed() {
    let alertTriggered = false;
    try {
      // Use a single timeout with waitForEvent instead of redundant Promise.race
      const alert = await this.page
        .waitForEvent("dialog", { timeout: 3000 })
        .catch(() => null);

      if (alert) {
        console.log(`🚨 Alert Triggered for Input: - ${alert.message()}`);
        alertTriggered = true;
        await alert.dismiss();
      } else {
        console.log(`✅ No Alert Triggered for Input`);
      }
    } catch (e) {
      console.error(`Error handling Alert for payload`, e);
    }
    return alertTriggered;
  }

  /**
   * Scrolls the page by one viewport height
   */
  async pageScroll() {
    await this.page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await this.waitOnlyForPageLoad();
  }

  /**
   * Clears all network request/response handlers
   */
  async clearNetworkLogs() {
    await this.page.unrouteAll();
  }

  /**
   * Sets the viewport size
   * @param viewportSize Object containing width and height properties
   */
  async setViewport(viewportSize: any) {
    await this.page.setViewportSize(viewportSize);
  }
  /**
   * Simulates a single Backspace key press on the specified input element.
   *
   * @param {string} selector - The selector used to locate the input element.
   * @param {number} [index=0] - Optional index for selecting a specific element if multiple match the selector.
   *
   * @example
   * await this.common.pressBackspace('#meeting-title');
   *
   * @returns {Promise<void>} Resolves when the Backspace key has been pressed.
   */
  async pressBackspace(selector: string, index: any = 0) {
    const element = this.page.locator(selector).nth(index);
    await element.click();
    await element.press("Backspace");
  }
  /**
   * Checks if an element has the expected CSS property value
   * @param selector The selector for the element
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   * @param cssProperty The CSS property name to check
   * @param cssValue The expected CSS property value
   */
  async checkCSSProperty(
    selector: string,
    index: any = 0,
    cssProperty: string,
    cssValue: string
  ) {
    await this.domContentLoaded();
    const element = await this.page.locator(selector).nth(index);
    await element.waitFor({ state: "visible", timeout: 5000 });
    await expect(element).toHaveCSS(cssProperty, cssValue);
  }

  /**
   * Validates that elements have CSS properties matching expected enum values
   * @param selectors The selector for the elements
   * @param cssProperty The CSS property or attribute name to check
   * @param enumValues An object mapping keys to expected CSS values
   * @param page Optional page object (defaults to this.page)
   * @throws Will throw an error if any expected CSS property value is not found
   */
  async validateCssPropertyValueBasedOnEnums(
    selectors: string,
    cssProperty: string,
    enumValues: Record<string, string>,
    page = this.page
  ) {
    await page.waitForSelector(selectors, { timeout: 5000 });
    const elements = await page.locator(selectors).elementHandles();

    if (Object.keys(enumValues).length !== elements.length) {
      throw new Error(
        `Validation failed: Expected ${
          Object.keys(enumValues).length
        } elements, but found ${
          elements.length
        }. Possible duplicate or missing elements.`
      );
    }

    for (const [key, expectedValue] of Object.entries(enumValues)) {
      let propertyMatchFound = false;

      for (const element of elements) {
        let computedValue;

        if (cssProperty === "src" || cssProperty === "href") {
          computedValue = await element.getAttribute(cssProperty);
        } else {
          computedValue = await element.evaluate((el, prop) => {
            return window
              .getComputedStyle(el as Element)
              .getPropertyValue(prop);
          }, cssProperty);
        }

        const normalizedComputedValue = computedValue
          ?.replace(/\s+/g, " ")
          .trim()
          .toLowerCase();

        const normalizedExpectedValue = expectedValue
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase();

        if (normalizedComputedValue === normalizedExpectedValue) {
          propertyMatchFound = true;
          break;
        }
      }

      if (!propertyMatchFound) {
        throw new Error(
          `Validation failed for "${key}". CSS property/attribute "${cssProperty}" expected: "${expectedValue}" but not found on any element.`
        );
      }
    }
  }

  /**
   * Retrieves a single element locator with optional index
   * @param selector CSS selector or XPath to locate the element
   * @param index Zero-based index when multiple elements match (default: 0)
   * @returns Promise resolving to the Playwright Locator
   */
  async getLocator(selector: string, index: number = 0): Promise<Locator> {
    await this.waitForPageLoad();
    return this.page.locator(selector).nth(index);
  }

  /**
   * Asserts that an element is hidden from the viewport
   * @param selector CSS selector or XPath to locate the element
   * @param index Zero-based index when multiple elements match (default: 0)
   */
  async expectHidden(selector: string, index: number = 0) {
    const ele = await this.getLocator(selector, index);
    await expect(ele).toBeHidden({ timeout: 5000 });
  }

  /**
   * Retrieves all element locators matching the selector
   * @param selector CSS selector or XPath to locate elements
   * @returns Promise resolving to an array of Playwright Locators
   */
  async getAllLocators(selector: string): Promise<Locator[]> {
    await this.waitForPageLoad();
    return this.page.locator(selector).all();
  }

  /**
   * Verifies that the element resolved by the selector or the provided Locator is not null.
   * @param selector - A selector string or Locator object pointing to the element to check.
   */
  async expectNotNull(selector: string | Locator) {
    if (typeof selector === "string") {
      await expect(await this.getLocator(selector)).not.toBe(null);
    } else {
      await expect(selector).not.toBe(null);
    }
  }

  /**
   * Verifies that an element's attribute does not contain the expected value
   * @param selector The selector for the element
   * @param attributeName The name of the attribute to check
   * @param attributevalue The value that should not be contained in the attribute
   * @param index Optional index for selecting a specific element when multiple match (default: 0)
   */
  async expectAttributeNotContains(
    selector: any,
    attributeName: any,
    attributevalue: string,
    index = 0
  ) {
    const ele = this.page.locator(selector).nth(index);
    const actualValue = await ele.getAttribute(attributeName);
    expect(actualValue).not.toContain(attributevalue);
  }

  /**
   * Retrieves the value of a specified attribute from an element
   * @param locator The selector for the element
   * @param attribute The name of the attribute to retrieve
   * @returns Promise resolving to the attribute value as a string
   */
  async getAttribute(
    locator: string,
    attribute: string,
    index: number = 0
  ): Promise<string> {
    const ele = await this.getLocator(locator, index);
    const attributeValue = await ele.getAttribute(attribute);
    if (attributeValue === null) {
      throw new Error(`Attribute ${attribute} not found on element ${locator}`);
    }
    return attributeValue;
  }

  /**
   * Validates that an actual object matches an expected object by comparing each key-value pair.
   * @param actualObject - The object to validate against the expected structure.
   * @param expectedObject - The object containing the expected key-value pairs.
   * @throws Will throw an assertion error if any key in expectedObject does not match the corresponding key in actualObject.
   */
  async validateObject(
    actualObject: Record<string, any>,
    expectedObject: Record<string, any>
  ) {
    for (const [key, expectedValue] of Object.entries(expectedObject)) {
      const actualValue = actualObject[key];
      expect(actualValue).toEqual(expectedValue);
    }
  }

  /**
   * Captures one or two API responses while executing a navigation step.
   * Waits for the step to complete and concurrently monitors for matching
   * successful (HTTP 200) responses to the provided URL(s).
   *
   * @param step - An asynchronous function or promise that triggers the page navigation/action.
   * @param requestUrl - Partial URL string to match the first required API response.
   * @param secondRequestUrl - Optional partial URL string to match a second API response.
   * @returns Promise resolving to an object containing:
   *   - firstResponse: Parsed JSON body of the first matched response.
   *   - secondResponse: Parsed JSON body of the second matched response, or null if not provided.
   */
  async captureResponseWhenPageLoad(
    step: any,
    firstRequestUrl: { url: string; method: string; status: number },
    secondRequestUrl?: { url: string; method: string; status: number }
    // requestUrl: string,
    // secondRequestUrl?: string
  ) {
    let firstResponseData: any = null;
    // Promise for the first API response
    const firstResponsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes(firstRequestUrl.url) &&
        response.status() === firstRequestUrl.status
    );

    // Promise for the second API response (optional)
    let secondResponsePromise: Promise<any> | null = null;
    if (secondRequestUrl) {
      secondResponsePromise = this.page.waitForResponse(
        (response) =>
          response.url().includes(secondRequestUrl.url) &&
          response.status() === secondRequestUrl.status
      );
    }

    // Execute the step (page navigation) concurrently with the API wait
    await step;

    // Wait for the first response
    const firstResponse = await firstResponsePromise;
    if (firstResponse.headers()["content-type"] != "application/json") {
      firstResponseData = firstResponse;
    } else {
      firstResponseData = JSON.stringify(await firstResponse.json());
    }

    // Wait for the second response if provided
    let secondResponseData = null;
    if (secondResponsePromise) {
      const secondResponse = await secondResponsePromise;
      if (firstResponse.headers()["content-type"] != "application/json") {
        secondResponseData = secondResponse;
      } else {
        secondResponseData = JSON.stringify(await secondResponse.json());
      }
    }

    // Return both responses
    return {
      firstResponse: firstResponseData,
      secondResponse: secondResponseData,
    };
  }
}
