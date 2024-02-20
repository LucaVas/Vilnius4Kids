import { test, expect } from '@playwright/test';
import { signupNewUser } from '../utils/api';
import { unverifiedFakeUser } from '../utils/fakeData';

/**
 * Created on: 2024-02-07
 * Related issues: #2
 */

const { email, username, password, role } = unverifiedFakeUser();

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

test.describe.serial('report playgrounds', () => {
  test('unverified user cannot make a report and cannot see his reports', async ({ page }) => {
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
    await expect(playgroundViewCard).not.toBeHidden({ timeout: 15000 });

    const reportButton = page.getByTestId('report-button');
    await expect(reportButton).not.toBeHidden();
    await reportButton.click();

    const notVerifiedMessage = page.getByTestId('notVerifiedMessage');
    await expect(notVerifiedMessage).not.toBeHidden({ timeout: 5000 });
    await expect(notVerifiedMessage).toHaveText(
      'Only verified users can report on playgrounds. Make sure to confirm your email first.'
    );

    const myReportsLink = page.getByRole('link', { name: 'My reports' });
    await expect(myReportsLink).toBeHidden();

    await page.goto('/myReports');
    await expect(page).toHaveURL(/myHome/);
  });
});
