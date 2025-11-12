# Playwright QA Assessment Project

## Overview

This repository contains an automated testing solution for a Playwright  
QA Pre-Interview Assessment. The project implements automated tests for an  
e-commerce flow using Playwright with TypeScript, following the Page Object  
Model design pattern.

## Assessment Tasks Completed

### 1. Setup & Framework

- ✅ Initialized a Playwright project with TypeScript support
- ✅ Configured tests to run in both headed and headless modes
- ✅ Added custom reporter (playwright-pulse-report) that logs test  
  results in JSON format

### 2. Functional Test Automation

- ✅ Implemented login functionality with valid credentials
- ✅ Added products to the cart
- ✅ Verified cart count and product details
- ✅ Completed checkout process with success validation

## Project Structure

```PlainText
├── constants/                 # Test data and constants, static texts
├── helper-functions/          # Utility and helper functions
├── page-elements/             # Locators and selectors
├── tests/                     # Test specifications
├── ui-page-functions/         # Page object models
├── playwright.config.ts       # Playwright configuration
├── pulse-report/              # Test execution reports (generated after tests,
                               # custom reporter)
```

## Setup Instructions

1. Clone this repository

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your test credentials if needed
```

## Running Tests

### Run all tests in headless mode

```bash
npm test
```

### Run tests in headed mode

```bash
npm run test:headed
```

### Run tests in headless mode

```bash
npm run test:headless
```

### Run specific test file

```bash
npx playwright test example.spec.ts
```

## Custom Reporter

In this project, I have implemented my own custom reporter called 'playwright-pulse-report' to provide detailed test execution results. [Pulse Report](https://www.npmjs.com/package/@arghajit/playwright-pulse-report) provides:

- JSON-formatted test results
- HTML report output
- Test execution details

Reports are generated in the `/pulse-report` directory after test execution.

## Test Data

**Test Environment:**

- URL: `https://demowebshop.tricentis.com/`

**Note:** For technical reasons, a different user profile was used for testing instead of the one specified in the assessment tasks.

## Technical Details

### Key Implementation Features

- Page Object Model (POM) design pattern
- Reusable locators and methods
- Strong assertions with meaningful error messages
- Effective handling of waits and selectors
- TypeScript implementation

## Additional Information

- Playwright configuration includes multiple browser support (Chromium, Firefox, and WebKit)
- Tests are designed to be run in CI/CD environments (GitHub Actions workflow included, and already setup)
- The project demonstrates best practices for Playwright test automation
