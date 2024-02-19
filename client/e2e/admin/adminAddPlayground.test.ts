import { test, expect } from '@playwright/test';
import { signupNewUser } from 'utils/api';
import { fakeAdmin } from 'utils/fakeData';

/**
 * Created on: 2024-02-19
 * Related issues: #41
 */

const { email, username, password, role } = fakeAdmin();

test.beforeAll(async () => {
  await signupNewUser({ email, username, password, role });
});

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  const dashboardLink = page.getByRole('link', { name: 'Playgrounds' });
  await expect(dashboardLink).toBeHidden();
  const form = page.getByRole('form', { name: 'Login' });
  await form.locator('input[type="email"]').fill(email);
  await form.locator('input[type="password"]').fill(password);
  await form.locator('button[type="submit"]').click();
  await expect(dashboardLink).toBeVisible();
});

test.describe.serial('Work with playgrounds dahsboard', () => {
  test('user can see playgrounds in dashboard', async ({ page }) => {
    await page.goto('/playgrounds');

    const table = page.getByTestId('playgroundsTable');
    await expect(table).not.toBeHidden();
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).not.toBe(0);
    expect(await page.locator('tr').count()).toBe(6); // 1 header + 5 playgrounds
  });

  test('user can filter playgrounds', async ({ page }) => {
    await page.goto('/playgrounds');

    const searchInput = page.getByRole('textbox', { name: 'Enter a playground name' });
    const table = page.getByTestId('playgroundsTable');
    await expect(table).not.toBeHidden();
    await expect(searchInput).not.toBeHidden();

    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).not.toBe(0);

    await searchInput.pressSequentially('fakeinput', { delay: 100 });
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(1);

    await searchInput.clear();
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(6);
  });

  
});
