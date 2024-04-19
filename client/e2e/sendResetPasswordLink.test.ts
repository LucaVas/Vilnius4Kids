import { test, expect } from '@playwright/test';
import { signupNewUser } from './utils/api';
import { fakeUser } from './utils/fakeData';

/**
 * Created on: 2024-02-24
 * Related issues: #16
 */

const { email, username, password, role } = fakeUser();

test.describe.serial('send reset password link', () => {
  test('user can go to user verification page', async ({ page }) => {
    await page.goto('/login');

    const resetPasswordButton = page.getByTestId('reset-password-button');
    await expect(resetPasswordButton).not.toBeHidden();
    expect(await resetPasswordButton.textContent()).toEqual('Forgot password?');

    await resetPasswordButton.click();

    const resetPasswordForm = page.getByRole('form', { name: 'Find account' });
    await expect(resetPasswordForm).not.toBeHidden();
  });

  test('user cannot reset password if email does not exist', async ({ page }) => {
    await page.goto('/reset');

    const resetPasswordForm = page.getByRole('form', { name: 'Find account' });
    await expect(resetPasswordForm).not.toBeHidden();
    await resetPasswordForm.locator('input[type="email"]').fill('non_existing_user@mail.com');

    await resetPasswordForm.locator('button[type="submit"]').click();

    const errorMessage = page.getByTestId('error-message');
    expect(await errorMessage.textContent()).toEqual('Error while resetting user password.');
  });

  test('user can send reset password link', async ({ page }) => {
    await signupNewUser({ email, username, password, role });

    await page.goto('/reset');

    const resetPasswordForm = page.getByRole('form', { name: 'Find account' });
    await resetPasswordForm.locator('input[type="email"]').fill(email);

    await resetPasswordForm.locator('button[type="submit"]').click();

    const successMessage = page.getByTestId('success-message');
    expect(await successMessage.textContent()).toEqual(
      'Thank you! We will send an email with a password reset link to your inbox.'
    );
  });
});
