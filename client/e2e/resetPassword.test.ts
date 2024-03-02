import { test, expect } from '@playwright/test';
import { fakeUser } from './utils/fakeData';

/**
 * Created on: 2024-02-25
 * Related issues: #16
 */

const { email } = fakeUser();

test.describe.serial('reset password', () => {
  test('user can go to reset password page', async ({ page }) => {
    await page.goto(`/resetPassword`);

    const form = page.getByRole('form', { name: 'Reset password' });
    await expect(form).toBeVisible();
  });

  test('user cannot reset password if repeated password does not match', async ({ page }) => {
    await page.goto(`/resetPassword`);

    const form = page.getByRole('form', { name: 'Reset password' });
    await form.locator('input[id="password"]').fill(email);
    await form.locator('input[id="repeatPassword"]').fill('Pass123abc');

    await page.click('[type="submit"]');
    const error = page.getByTestId('error-message');
    await expect (error).toBeVisible()
    await expect(error).toHaveText('Passwords do not match');
  });
});
