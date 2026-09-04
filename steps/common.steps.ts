import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BasePage } from '../pages/BasePage';

const { Given, Then } = createBdd();

Given('I am logged in as {string}', async ({ page }, username: string) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
});

Then('I should see an error message {string}', async ({ page }, message: string) => {
  const basePage = new BasePage(page);
  await expect(basePage.errorMessage).toHaveText(message);
});
