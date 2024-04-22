import { test, expect } from '@playwright/test';
import { signupNewUser } from 'utils/api';
import { fakeUser } from 'utils/fakeData';

/**
 * Created on: 2024-04-22
 * Related issues: #80
 */

const { email, username, password, role } = fakeUser();

test.beforeAll(async () => {
  await signupNewUser({ email, username, password, role });
});

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  const myHomeLink = page.getByRole('link', { name: 'My playgrounds' });
  await expect(myHomeLink).toBeHidden();
  const form = page.getByRole('form', { name: 'Login' });
  await form.locator('input[type="email"]').fill(email);
  await form.locator('input[type="password"]').fill(password);
  await form.locator('button[type="submit"]').click();
  await expect(myHomeLink).toBeVisible();
});

test.describe('upload images', () => {
  test('User cannot upload an invalid file', async ({ page }) => {
    const errorMessage = page.getByTestId('error-message');

    await page.goto('/report');
    await page.getByRole('button', { name: 'Report an issue' }).click();
    await page
      .getByRole('row', { name: 'Pavilnys Vandens g. 9 7 Report' })
      .getByRole('button')
      .click();
    await page.getByRole('button', { name: 'Safety Hazards' }).click();
    await page.getByRole('button', { name: 'Unsafe equipment' }).click();
    await page.getByPlaceholder('What is the nature of this').fill('Test report');
    await page.locator('input[type="file"]').click();
    await page
      .locator('input[type="file"]')
      .setInputFiles('./utils/files/random_song.mp3');
    await page.locator('text=random_song.mp3').click();
    await page.getByRole('button', { name: 'Submit report' }).click();

    await expect(errorMessage).not.toBeHidden();
    await expect(errorMessage).toHaveText('One or more file types are not allowed.');
  });

  test('User can upload a file', async ({ page }) => {
    const successMessage = page.getByTestId('success-message');

    await page.goto('/report');
    await page.getByRole('button', { name: 'Report an issue' }).click();
    await page
      .getByRole('row', { name: 'Pavilnys Vandens g. 9 7 Report' })
      .getByRole('button')
      .click();
    await page.getByRole('button', { name: 'Safety Hazards' }).click();
    await page.getByRole('button', { name: 'Unsafe equipment' }).click();
    await page.getByPlaceholder('What is the nature of this').fill('Test report');
    await page.locator('input[type="file"]').click();
    await page
      .locator('input[type="file"]')
      .setInputFiles('./utils/files/random_image.jpeg');
    await page.locator('text=random_image.jpeg').click();

    await page.locator('text=random_image.jpeg').click();
    await page.getByRole('button', { name: 'Submit report' }).click();

    await expect(successMessage).not.toBeHidden();
  });
});
