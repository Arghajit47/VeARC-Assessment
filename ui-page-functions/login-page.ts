import { Page } from "@playwright/test";
import InitializationPage from "../helper-functions/page";
import loginPageElements from "../page-elements/login-page-elements";
import LOGIN_PAGE_CONSTANTS from "../constants/loginPage";
import "dotenv/config";

export default class LoginPage {
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
   * Navigates to the specified webpage.
   * @param url - The URL to navigate to. Defaults to the BASE_URL environment variable.
   */
  async gotoWebpage(url: string = process.env.BASE_URL!) {
    await this.common.goto(url);
  }

  /**
   * Verifies that the current URL contains "/login".
   */
  async verifyLoginPageUrl() {
    await this.common.expectHaveURL(LOGIN_PAGE_CONSTANTS.LOGIN_URL);
  }

  /**
   * Clicks the login button in the navbar, waits for the page to load,
   * and verifies the login page is displayed.
   */
  async clickOnLoginButton() {
    await this.common.clickOnElement(loginPageElements.navbar.login);
    await this.common.waitForPageLoad("min");
    await this.verifyLoginPageIsDisplayed();
  }

  /**
   * Verifies all expected elements and texts are visible on the login page.
   */
  async verifyLoginPageIsDisplayed() {
    await this.common.expectInnerText(
      loginPageElements.headerText,
      LOGIN_PAGE_CONSTANTS.HEADER_TEXT
    );
    await this.common.expectInnerText(
      loginPageElements.newCustomerText,
      LOGIN_PAGE_CONSTANTS.NEW_CUSTOMER_TEXT
    );
    await this.common.expectInnerText(
      loginPageElements.returningCustomerText,
      LOGIN_PAGE_CONSTANTS.RETURNING_CUSTOMER_TEXT
    );
    await this.common.expectVisible(loginPageElements.passwordField);
    await this.common.expectVisible(loginPageElements.rememberMe);
    await this.common.expectVisible(loginPageElements.loginButton);
  }

  /**
   * Logs in with valid credentials.
   * @param username - The username to use. Defaults to VALID_USERNAME environment variable.
   * @param password - The password to use. Defaults to VALID_PASSWORD environment variable.
   */
  async loginWithValidCredentials(
    username: string = process.env.VALID_USERNAME!,
    password: string = process.env.VALID_PASSWORD!
  ) {
    await this.common.typeOnElement(loginPageElements.usernameField, username);
    await this.common.typeOnElement(loginPageElements.passwordField, password);
    await this.common.clickOnElement(loginPageElements.rememberMe);
    await this.common.clickOnElement(loginPageElements.loginButton);
  }
}
