import { test, expect } from '@playwright/test';
import { signupNewUser } from './utils/api';
import { fakeUser } from './utils/fakeData';

/**
 * Created on: 2024-02-24
 * Related issues: #16
 */

// const { email, username, password, role } = fakeUser();

// test.beforeAll(async () => {
//   await signupNewUser({ email, username, password, role });
// });

// test.beforeEach(async ({ page }) => {
//   await page.goto('/login');
//   const myHomeLink = page.getByRole('link', { name: 'My playgrounds' });
//   await expect(myHomeLink).toBeHidden();
//   const form = page.getByRole('form', { name: 'Login' });
//   await form.locator('input[type="email"]').fill(email);
//   await form.locator('input[type="password"]').fill(password);
//   await form.locator('button[type="submit"]').click();
//   await expect(myHomeLink).toBeVisible();
// });

test.describe.serial('reset password', () => {
  test('user can go to reset password page', async ({ page }) => {
    await page.goto('/login');

    const resetPasswordButton = page.getByTestId('reset-password-button');
    expect (resetPasswordButton).not.toBeHidden();
    expect(await resetPasswordButton.textContent()).toEqual('Forgot password?');

    await resetPasswordButton.click();

    const resetPasswordForm = page.getByRole('form', { name: 'Find account' });
    expect(resetPasswordForm).not.toBeHidden();
  });
});
