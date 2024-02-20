import { test, expect } from '@playwright/test';
import { signupNewUser } from '../utils/api';
import { fakeUser } from '../utils/fakeData';

/**
 * Created on: 2024-01-31
 * Related issues: #25
 */

const { email, username, password, role } = fakeUser();

test.beforeAll(async () => {
  await signupNewUser({ email, username, password, role });
});

test.describe.serial('redirection for authorized users', () => {
  test('user is redirected from home, login and signup if already logged in', async ({ page }) => {
    await page.goto('/login');
    const myHomeLink = page.getByRole('link', { name: 'My playgrounds' });
    await expect(myHomeLink).toBeHidden();

    const form = page.getByRole('form', { name: 'Login' });
    await form.locator('input[type="email"]').fill(email);
    await form.locator('input[type="password"]').fill(password);
    await form.locator('button[type="submit"]').click();

    await expect(myHomeLink).toBeVisible();

    await page.goto('/login');
    const loginForm = page.getByTestId('login-form');
    await expect(loginForm).not.toBeVisible();

    await page.goto('/signup');
    const signupForm = page.getByTestId('signup-form');
    await expect(signupForm).not.toBeVisible();

    await page.goto('/');
    const heroSection = page.getByTestId('homepage-hero-section');
    await expect(heroSection).not.toBeVisible();
  });
});
