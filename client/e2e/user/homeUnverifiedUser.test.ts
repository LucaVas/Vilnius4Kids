import { test, expect } from '@playwright/test';
import { signupNewUser } from '../utils/api';
import { fakeUser, unverifiedFakeUser } from '../utils/fakeData';

/**
 * Created on: 2024-02-08
 * Related issues: #2
 */

const unverifiedUser = unverifiedFakeUser();
const verifiedUser = fakeUser();

test.beforeAll(async () => {
  Promise.all([
    await signupNewUser({
      email: unverifiedUser.email,
      username: unverifiedUser.username,
      password: unverifiedUser.password,
      role: unverifiedUser.role,
    }),
    await signupNewUser({
      email: verifiedUser.email,
      username: verifiedUser.username,
      password: verifiedUser.password,
      role: verifiedUser.role,
    }),
  ]);
});

test.describe.serial('unverified user home notification', () => {
  test('unverified user is notified at login', async ({ page }) => {
    await page.goto('/login');
    const myHomeLink = page.getByRole('link', { name: 'My playgrounds' });
    await expect(myHomeLink).toBeHidden();
    const form = page.getByRole('form', { name: 'Login' });
    await form.locator('input[type="email"]').fill(unverifiedUser.email);
    await form.locator('input[type="password"]').fill(unverifiedUser.password);
    await form.locator('button[type="submit"]').click();
    await expect(myHomeLink).toBeVisible();

    await page.goto('/myHome');

    const notVerifiedInfoMessage = page.getByTestId('notVerifiedInfoMessage');
    await expect(notVerifiedInfoMessage).not.toBeHidden();
    await expect(notVerifiedInfoMessage).toHaveText(
      'You have not verified your email address. Some features might be disabled.'
    );
    await page.reload();
    await expect(notVerifiedInfoMessage).not.toBeHidden();
    await page.goto('/playgrounds');
    await page.goto('/myHome');
    await expect(notVerifiedInfoMessage).not.toBeHidden();
  });

  test('verified user is not notified at login', async ({ page }) => {
    await page.goto('/login');
    const myHomeLink = page.getByRole('link', { name: 'My playgrounds' });
    await expect(myHomeLink).toBeHidden();
    const form = page.getByRole('form', { name: 'Login' });
    await form.locator('input[type="email"]').fill(verifiedUser.email);
    await form.locator('input[type="password"]').fill(verifiedUser.password);
    await form.locator('button[type="submit"]').click();
    await expect(myHomeLink).toBeVisible();

    await page.goto('/myHome');

    const notVerifiedInfoMessage = page.getByTestId('notVerifiedInfoMessage');
    await expect(notVerifiedInfoMessage).toBeHidden();
    await page.reload();
    await expect(notVerifiedInfoMessage).toBeHidden();
    await page.goto('/playgrounds');
    await page.goto('/myHome');
    await expect(notVerifiedInfoMessage).toBeHidden();
  });
});
