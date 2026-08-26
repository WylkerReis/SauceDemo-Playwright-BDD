import { type Page, type Locator } from '@playwright/test';

/**
 * Elements shared across multiple SauceDemo pages — currently just the
 * error banner, which uses the same [data-test="error"] element on both
 * the login page and the checkout information page.
 */
export class BasePage {
  readonly page: Page;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.errorMessage = page.locator('[data-test="error"]');
  }
}
