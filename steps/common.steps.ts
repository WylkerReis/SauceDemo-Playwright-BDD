import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BasePage } from '../pages/BasePage';

const { Given, Then } = createBdd();

// Shared login helper used as a Background step by features that need an
// already-authenticated session (cart, sorting, checkout).
Given('I am logged in as {string}', async ({ page }, username: string) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
});

// Shared error assertion, reused by both the login and checkout flows since
// SauceDemo renders both with the same error banner element.
Then('I should see an error message {string}', async ({ page }, message: string) => {
  const basePage = new BasePage(page);
  await expect(basePage.errorMessage).toHaveText(message);
});
