import { test, expect } from '@playwright/test';
import { signupNewUser } from '../utils/api';
import { fakeUser } from '../utils/fakeData';

/**
 * Created on: 2024-02-01
 * Related issues: #21
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

test.describe.serial('see playground page', () => {
  test('user can see a playground page from map', async ({ page }) => {
    await page.goto('/playgrounds');

    const map = page.getByTestId('playgrounds-map');
    await expect(map).not.toBeHidden({ timeout: 5000 });

    await page.locator('div[role="button"]').nth(5).click({ timeout: 50000 });
    const infoBox = page.getByTestId('infobox');
    await expect(infoBox).not.toBeHidden();

    const infoBoxAddressLocator = page.getByTestId('infobox-playground-address');
    const infoBoxAddress = await infoBoxAddressLocator.innerText();
    await expect(infoBoxAddressLocator).not.toBeHidden();

    const goToPlaygroundBtn = page.getByTestId('go-to-playground-button');
    await expect(goToPlaygroundBtn).not.toBeHidden();
    await goToPlaygroundBtn.click({ timeout: 5000 });

    const playgroundAddressLocator = page.getByTestId('playground-address');
    const playgroundAddress = await playgroundAddressLocator.innerText();
    await expect(playgroundAddressLocator).not.toBeHidden();

    expect(infoBoxAddress).toBe(playgroundAddress);
  });
});
