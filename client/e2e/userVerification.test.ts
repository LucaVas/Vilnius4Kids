import { test, expect } from '@playwright/test';
import { fakeUser } from 'utils/fakeData';

/**
 * Created on: 2024-02-07
 * Related issues: #2
 */

const { email, username, password } = fakeUser();

test.describe.serial('verification token sequence', () => {
  test('visitor sees token information at signup', async ({ page }) => {
    await page.goto('/signup');
    const successMessage = page.getByTestId('successMessage');
    const tokenMessage = page.getByTestId('tokenMessage');
    await expect(successMessage).toBeHidden();
    await expect(tokenMessage).toBeHidden();

    const form = page.getByRole('form', { name: 'Signup' });
    await form.locator('input[id="username"]').fill(username);
    await form.locator('input[type="email"]').fill(email);
    await form.locator('input[type="password"]').fill(password);
    await form.locator('button[type="submit"]').click();

    await expect(successMessage).toBeVisible({ timeout: 5000 });
    await expect(tokenMessage).toBeVisible({ timeout: 5000 });
    });

});
