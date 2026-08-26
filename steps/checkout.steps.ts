import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const { When, Then } = createBdd();

When('I proceed to checkout', async ({ page }) => {
  const cartPage = new CartPage(page);
  await cartPage.checkout();
});

When(
  'I fill in my checkout information as {string}, {string}, {string}',
  async ({ page }, firstName: string, lastName: string, postalCode: string) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillInformation(firstName, lastName, postalCode);
  },
);

When('I finish the checkout', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.finish();
});

Then('I should see the confirmation message {string}', async ({ page }, message: string) => {
  const checkoutPage = new CheckoutPage(page);
  await expect(checkoutPage.confirmationHeader).toHaveText(message);
});
