import { test, expect } from '@playwright/test';
import { signupNewUser } from './utils/api';
import { fakeUser } from './utils/fakeData';

/**
 * Created on: 2024-01-29
 * Related issues: #20
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

test.describe.serial('save, see and remove favorite playgrounds', () => {
  test('user can add a playground to favorites and then remove it', async ({ page }) => {
    await page.goto('/playgrounds');

    const map = page.getByTestId('playgrounds-map');
    await expect(map).not.toBeHidden();

    await page.locator('div[role="button"]').nth(5).click();
    const infoBox = page.getByTestId('infobox');
    await expect(infoBox).not.toBeHidden();

    const saveBtn = page.getByRole('button', { name: /Save/i });
    await expect(saveBtn).not.toBeHidden();
    await saveBtn.click();
    const unsaveBtn = page.getByRole('button', { name: /Unsave/i });
    await expect(unsaveBtn).not.toBeHidden();

    await page.getByRole('link', { name: 'My playgrounds' }).first().click();

    const playgroundCard = page.getByTestId('playground-card');
    await expect(playgroundCard).not.toBeHidden();
    await page.reload();
    await expect(playgroundCard).not.toBeHidden();

    await page.getByTestId('delete-playground-button').click();
    await expect(playgroundCard).toBeHidden();
    await page.reload();
    await expect(playgroundCard).toBeHidden();
  });
});
