import { test, expect } from '@playwright/test';
import { signupNewUser } from './utils/api';
import { fakeUser } from './utils/fakeData';

/**
 * Created on: 2024-01-31
 * Related issues: #24
 */

const { email, username, password, role } = fakeUser();

test.beforeAll(async () => {
  await signupNewUser({ email, username, password, role });
});

test.describe.serial('username tag in navbar', () => {
  test('a user can see his username tag in the navbar', async ({ page }) => {
    await page.goto('/login');

    const form = page.getByRole('form', { name: 'Login' });
    await form.locator('input[type="email"]').fill(email);
    await form.locator('input[type="password"]').fill(password);
    await form.locator('button[type="submit"]').click();

    const usernameTag = page.getByTestId('username-tag');
    await expect(usernameTag).toBeVisible({ timeout: 10000 });
    await expect(usernameTag).toHaveText(username.toLowerCase());

    const logoutLink = page.getByRole('link', { name: 'Logout' });
    await logoutLink.click();
    await expect(usernameTag).not.toBeVisible();
    await page.reload();
    await expect(usernameTag).not.toBeVisible();
  });
});
