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

When('I cancel the checkout', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.cancel();
});

Then('I should see the confirmation message {string}', async ({ page }, message: string) => {
  const checkoutPage = new CheckoutPage(page);
  await expect(checkoutPage.confirmationHeader).toHaveText(message);
});

Then('I should see the cart page', async ({ page }) => {
  await expect(page).toHaveURL(/cart\.html/);
});

Then('the order total should equal the subtotal plus tax', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  const { subtotal, tax, total } = await checkoutPage.getPriceSummary();
  expect(total).toBeCloseTo(subtotal + tax, 2);
});
