import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

const { When, Then } = createBdd();

When('I add {string} to the cart', async ({ page }, productName: string) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addProductToCart(productName);
});

When('I open the cart', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goToCart();
});

When('I remove {string} from the cart', async ({ page }, productName: string) => {
  const cartPage = new CartPage(page);
  await cartPage.removeProduct(productName);
});

When('I continue shopping', async ({ page }) => {
  const cartPage = new CartPage(page);
  await cartPage.continueShopping();
});

Then('the cart badge should show {string}', async ({ page }, expectedCount: string) => {
  const inventoryPage = new InventoryPage(page);
  await expect(inventoryPage.cartBadge).toHaveText(expectedCount);
});

Then('my cart should not contain {string}', async ({ page }, productName: string) => {
  const cartPage = new CartPage(page);
  const names = await cartPage.getCartItemNames();
  expect(names).not.toContain(productName);
});

Then('the cart badge should not be visible', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await expect(inventoryPage.cartBadge).toHaveCount(0);
});
