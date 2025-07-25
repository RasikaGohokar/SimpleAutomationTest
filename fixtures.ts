import { test as base, Page } from '@playwright/test';
import { BASE_URL, SELECTORS } from './constants';
import * as dotenv from 'dotenv';
dotenv.config();

// Extend the base test with a login fixture
type LoginFixture = {
  loginPage: Page;
};

export const test = base.extend({
  baseURL: BASE_URL,
});

export const testWithLogin = base.extend<LoginFixture>({
  loginPage: async ({ page }, use) => {
    await page.goto(BASE_URL);
    await page.locator(SELECTORS.username).fill('user1');
    await page.locator(SELECTORS.password).fill('test1');
    await page.locator(SELECTORS.loginButton).click();
    await use(page);
  },
});