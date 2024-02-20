import { test, expect } from '@playwright/test';
import { fakeAdmin } from './utils/fakeData';
import { signupNewUser } from 'utils/api';

/**
 * Created on: 2024-02-19
 * Related issues: #41
 */

const { email, username, password, role } = fakeAdmin();

test.beforeAll(async () => {
  await signupNewUser({ email, username, password, role });
});

test.describe.serial('login sequence', () => {

  test('admin can not access his dashboard before login', async ({ page }) => {
    await page.goto('/myHome');

    // user is redirected to login page
    await page.waitForURL('/login');
  });

  test('admin can login', async ({ page }) => {
    await page.goto('/login');
    const playgroundsLink = page.getByRole('link', { name: 'Playgrounds' });
    await expect(playgroundsLink).toBeHidden();

    const form = page.getByRole('form', { name: 'Login' });
    await form.locator('input[type="email"]').fill(email);
    await form.locator('input[type="password"]').fill(password);
    await form.locator('button[type="submit"]').click();

    await expect(playgroundsLink).toBeVisible();

    await page.reload();
    await expect(playgroundsLink).toBeVisible();
  });
});

test('admin can log out', async ({ page }) => {
  const dashboardLink = page.getByRole('link', { name: 'Playgrounds' });

  await page.goto('/login');

  const loginForm = page.getByRole('form', { name: 'Login' });
  await loginForm.locator('input[type="email"]').fill(email);
  await loginForm.locator('input[type="password"]').fill(password);
  await loginForm.locator('button[type="submit"]').click();

  await expect(dashboardLink).toBeVisible();

  await page.goto('/dashboard');
  const logoutButton = page.getByTestId('logoutButton');
  await logoutButton.click({ timeout: 30000 });

  await expect(logoutButton).toBeHidden();

  await expect(page).toHaveURL('/login');

  await page.goto('/dashboard');
  await expect(logoutButton).toBeHidden();
  await expect(page).toHaveURL('/login');
});
