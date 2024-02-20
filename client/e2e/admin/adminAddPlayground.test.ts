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

  test('user can create, edit and delete a playgrounds', async ({ page }) => {
    await page.goto('/playgrounds');

    const searchInput = page.getByRole('textbox', { name: 'Enter a playground name' });

    const newPlaygroundButton = page.getByTestId('newPlaygroundButton');
    await expect(newPlaygroundButton).toBeVisible();

    // create
    
    await newPlaygroundButton.click();

    const form = page.getByTestId('newPlaygroundForm');
    await expect(form).toBeVisible();

    await page.getByTestId('latitudeInput').nth(1).fill('123');
    await page.getByTestId('longitudeInput').nth(1).fill('456');
    await page.getByLabel('Address').selectOption('test street 12, test district ,12345 test city');
    await page.getByLabel('Description').fill('test description');

    await page.getByText('Confirm').click();

    await page.waitForTimeout(1000);

    // edit

    await searchInput.pressSequentially('test district', { delay: 100 });
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(2);
    expect(page.locator('tr').nth(1).locator('td').first()).toContainText('test district');

    const editButton = page.getByTestId('editPlaygroundButton');
    await expect(editButton).toBeVisible();
    await editButton.click();

    await expect(page.getByTestId('latitudeInput').nth(1)).toHaveValue(/[0-9]/);
    await expect(page.getByTestId('longitudeInput').nth(1)).toHaveValue(/[0-9]/);
    await expect(page.getByLabel('Description')).toHaveValue('test description');

    await page.getByLabel('Description').fill('new description');

    await page.getByText('Confirm').click();

    await page.waitForTimeout(1000);

    // delete

    await searchInput.pressSequentially('test district', { delay: 100 });
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(2);
    expect(page.locator('tr').nth(1).locator('td').first()).toContainText('test district');
    await expect(editButton).toBeVisible();
    await editButton.click();

    await expect(page.getByLabel('Description')).toHaveValue('new description');

    await page.getByText('Cancel').click();

    const deleteButton = page.getByTestId('deletePlaygroundButton');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await expect(page.locator('h3')).toContainText(
      'Are you sure you want to delete this playground?'
    );
    await page.getByText('Confirm').click();

    await page.waitForTimeout(1000);

    await searchInput.pressSequentially('test district', { delay: 100 });
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(1);
  });
});
