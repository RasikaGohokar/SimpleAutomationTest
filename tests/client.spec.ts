import { expect } from '@playwright/test';
import { test,testWithLogin } from './fixtures';
import { BASE_URL, SELECTORS, TEXTS } from './constants';

test('Login with invalid credentials', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.locator(SELECTORS.username).fill("user1");
  await page.locator(SELECTORS.password).fill("test1");
  await page.locator(SELECTORS.loginButton).click();
  await expect(page.getByText(/*TEXTS.invalidCredentials*/"Invalid credentials")).toBeVisible();
});

test('Create new user', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.locator(SELECTORS.signupPageButton).click();
  await expect(page.getByText("Sign Up")).toBeVisible();

  await page.locator(SELECTORS.username).fill("user1");
  await page.locator(SELECTORS.password).fill("test1");
  await page.locator(SELECTORS.signupButton).click();

  await expect(page.getByText(TEXTS.signupSuccess)).toBeVisible();
  await expect(page.getByText(TEXTS.todoTitle)).toBeVisible({ timeout: 6000 });

  await page.locator(SELECTORS.logoutButton).click();
  await expect(page.getByText(TEXTS.logoutSuccess)).toBeVisible();
});

test('Login with existing user', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.locator(SELECTORS.username).fill("user1");
  await page.locator(SELECTORS.password).fill("test1");
  await page.locator(SELECTORS.loginButton).click();

  await expect(page.getByText(TEXTS.loginSuccess)).toBeVisible();
});

testWithLogin('Add/edit/delete todo item', async ({ loginPage }) => {
  await loginPage.locator(SELECTORS.todoInput).fill('sample1');
  await loginPage.locator(SELECTORS.todoAddButton).click();
  await expect(loginPage.getByText('sample1')).toBeVisible();

  await loginPage.locator(SELECTORS.todoEditButton).click();
  await loginPage.locator(SELECTORS.todoEditInput).fill('sample2');
  await loginPage.locator(SELECTORS.todoSaveButton).click();
  await expect(loginPage.getByText('sample2')).toBeVisible();

  await loginPage.locator(SELECTORS.todoDeleteButton).click();
  await expect(loginPage.getByText(TEXTS.deletedMessage)).toBeVisible();
});