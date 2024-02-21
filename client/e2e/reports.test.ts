import { test, expect } from '@playwright/test';
import { signupNewUser } from './utils/api';
import { fakeUser } from './utils/fakeData';

/**
 * Created on: 2024-01-25
 * Related issues: #3
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

test.describe.serial('report playgrounds', () => {
  test('user can make a report from a playground and report it', async ({ page }) => {
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

    await page
      .getByRole('button', { name: /Safety Hazards/i })
      .first()
      .click();
    await page
      .getByRole('button', { name: /Unsafe equipment/i })
      .first()
      .click();

    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeHidden();

    await page.getByRole('button', { name: /Submit report/i }).click();

    await expect(errorMessage).not.toBeHidden();

    await page.locator('textarea').fill('Test report description');
    await page.getByRole('button', { name: /Submit report/i }).click();
    const successMessage = page.getByTestId('success-message');
    await expect(successMessage).not.toBeHidden({ timeout: 5000 });

    await page.getByRole('link', { name: 'My playgrounds' }).click();
    await page.getByRole('link', { name: 'My reports' }).click();

    const reportRow = page.getByTestId('report-row');
    await expect(reportRow).not.toBeHidden({ timeout: 5000 });
  });
});
