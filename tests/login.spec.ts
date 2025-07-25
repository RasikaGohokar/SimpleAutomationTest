import { expect } from '@playwright/test';
import { test } from './fixtures';
import { SELECTORS, TEXTS } from './constants';

test('Login with invalid credentials', async ({ page }) => {
  await page.goto(process.env.BASE_URL!);
  await page.locator(SELECTORS.username).fill('invalid');
  await page.locator(SELECTORS.password).fill('invalid');
  await page.locator(SELECTORS.loginButton).click();
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});

test('Create new user', async ({ page }) => {
  await page.goto(process.env.BASE_URL!);
  await page.getByText('Sign Up').click();
  await page.locator(SELECTORS.username).fill('user7');
  await page.locator(SELECTORS.password).fill('test7');
  await page.locator(SELECTORS.loginButton).click();
  await expect(page.getByText(TEXTS.signupSuccess)).toBeVisible();
});
