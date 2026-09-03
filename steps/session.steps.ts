import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';

const { When, Then } = createBdd();

When('I log out', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.logout();
});

When('I visit the inventory page directly without logging in', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.gotoDirectly();
});

Then('I should see the login page', async ({ page }) => {
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
