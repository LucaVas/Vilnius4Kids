import { test, expect } from '@playwright/test';
import { loginNewUser } from 'utils/api';
import { fakeUser } from 'utils/fakeData';

/**
 * Created on: 2024-01-20
 * Related issues: #13
 */

const { email, username, password } = fakeUser();

test.describe.serial('signup and login sequence', () => {
  test('visitor can signup', async ({ page }) => {
    await page.goto('/signup');
    const successMessage = page.getByTestId('successMessage');
    await expect(successMessage).toBeHidden();

    const form = page.getByRole('form', { name: 'Signup' });
    await form.locator('input[id="username"]').fill(username);
    await form.locator('input[type="email"]').fill(email);
    await form.locator('input[type="password"]').fill(password);
    await form.locator('button[type="submit"]').click();

    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });

  test('visitor can not access his homepage before login', async ({ page }) => {
    await page.goto('/myHome');

    // user is redirected to login page
    await page.waitForURL('/login');
  });

  test('visitor can login', async ({ page }) => {
    await page.goto('/login');
    const myHomeLink = page.getByRole('link', { name: 'My playgrounds' });
    await expect(myHomeLink).toBeHidden();

    const form = page.getByRole('form', { name: 'Login' });
    await form.locator('input[type="email"]').fill(email);
    await form.locator('input[type="password"]').fill(password);
    await form.locator('button[type="submit"]').click();

    await expect(myHomeLink).toBeVisible();

    await page.reload();
    await expect(myHomeLink).toBeVisible();
  });
});

test('visitor can log out', async ({ page }) => {
  await loginNewUser(page);

  await page.goto('/myHome');
  const logoutLink = page.getByRole('link', { name: 'Logout' });

  await logoutLink.click();

  await expect(logoutLink).toBeHidden();

  await expect(page).toHaveURL('/login');

  await page.goto('/myHome');
  await expect(logoutLink).toBeHidden();
  await expect(page).toHaveURL('/login');
});
