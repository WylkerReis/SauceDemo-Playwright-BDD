import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';

const { When, Then } = createBdd();

When('I sort products by {string}', async ({ page }, option: string) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.sortBy(option);
});

Then('the products should be displayed in ascending price order', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const prices = await inventoryPage.getDisplayedPrices();
  const sorted = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sorted);
});

Then('the products should be displayed in descending name order', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const names = await inventoryPage.getDisplayedNames();
  const sorted = [...names].sort((a, b) => b.localeCompare(a));
  expect(names).toEqual(sorted);
});
