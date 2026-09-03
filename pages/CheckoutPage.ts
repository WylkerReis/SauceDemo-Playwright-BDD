import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // Step one: information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  // Step two: overview
  readonly finishButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  // Shared: both the information and overview steps have a cancel button
  readonly cancelButton: Locator;

  // Step three: confirmation
  readonly confirmationHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.confirmationHeader = page.locator('.complete-header');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  /** Parses the "Item total: $X" / "Tax: $X" / "Total: $X" labels on the order review step. */
  async getPriceSummary(): Promise<{ subtotal: number; tax: number; total: number }> {
    const parse = async (locator: Locator) => {
      const text = (await locator.textContent()) ?? '';
      const match = text.match(/\$([\d.]+)/);
      return match ? Number(match[1]) : NaN;
    };
    return {
      subtotal: await parse(this.subtotalLabel),
      tax: await parse(this.taxLabel),
      total: await parse(this.totalLabel),
    };
  }
}
