import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

const { Then } = createBdd();

Then('each product should display its own distinct image', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const srcs = await inventoryPage.getItemImageSrcs();
  expect(new Set(srcs).size).toBe(srcs.length);
});

Then('I should see the checkout overview page', async ({ page }) => {
  await expect(page).toHaveURL(/checkout-step-two/);
});

Then(
  'logging in as {string} with password {string} should complete within {int} seconds',
  async ({ page }, username: string, password: string, seconds: number) => {
    const loginPage = new LoginPage(page);
    const start = Date.now();
    await loginPage.login(username, password);
    await expect(page).toHaveURL(/inventory/);
    expect(Date.now() - start).toBeLessThan(seconds * 1000);
  },
);
