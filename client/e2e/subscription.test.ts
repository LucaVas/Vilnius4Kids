import { test, expect } from '@playwright/test';
import { fakeUser } from 'utils/fakeData';

/**
 * Created on: 2024-03-04
 * Related issues: #73
 */

const { email } = fakeUser();

test.describe.serial('user subscription process', () => {
  test('visitor can subscribe', async ({ page }) => {
    await page.goto('/');
    const successMessage = page.getByTestId('success-message');
    const errorMessage = page.getByTestId('error-message');

    await expect(successMessage).toBeHidden();
    await expect(errorMessage).toBeHidden();

    await page.getByTestId('subscription-email').fill(email);

    await page.locator('button[type="submit"]').click();

    await expect(successMessage).toBeVisible();
  });

  test('visitor cannot subscribe twice', async ({ page }) => {
    await page.goto('/');
    const successMessage = page.getByTestId('success-message');
    const errorMessage = page.getByTestId('error-message');

    await expect(successMessage).toBeHidden();
    await expect(errorMessage).toBeHidden();

    await page.getByTestId('subscription-email').fill(email);

    await page.locator('button[type="submit"]').click();

    await expect(errorMessage).toBeVisible();
    await expect(successMessage).not.toBeVisible();
  });
});
