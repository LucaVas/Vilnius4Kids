import { test, expect } from '@playwright/test';
import { signupNewUser } from './utils/api';
import { fakeUser } from './utils/fakeData';

/**
 * Created on: 2024-01-28
 * Related issues: #23
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

test.describe.serial('rate playgrounds', () => {
  test('user can rate a playground and update their ratings', async ({ page }) => {
    await page.goto('/playgrounds');

    const map = page.getByTestId('playgrounds-map');
    await expect(map).not.toBeHidden({ timeout: 5000 });

    await page.locator('div[role="button"]').nth(5).click();
    const infoBox = page.getByTestId('infobox');
    await expect(infoBox).not.toBeHidden();

    const goToBtn = page.getByTestId('go-to-playground-button');
    await expect(goToBtn).not.toBeHidden();
    await goToBtn.click({ timeout: 5000 });

    const playgroundViewCard = page.getByTestId('playground-view-card');
    await expect(playgroundViewCard).not.toBeHidden({ timeout: 5000 });

    const ratingStars = page.getByTestId('rating-stars');
    await expect(ratingStars).not.toBeHidden();

    const starFour = page.getByTestId('rating-star-4');
    const starColor = await starFour.getAttribute('fill');

    // already rated
    if (starColor === '#fbbf24') {
      await page.getByTestId('rating-star-3').click();
      expect(await starFour.getAttribute('fill')).toEqual('#6a6969');
      await starFour.click();
      expect(await starFour.getAttribute('fill')).toEqual('#fbbf24');
    } else {
      await starFour.click();
      expect(await starFour.getAttribute('fill')).toEqual('#fbbf24');
    }
  });
});
