import { test, expect } from '@playwright/test';
import { signupNewUser } from './utils/api';
import { fakeAdmin } from './utils/fakeData';

/**
 * Created on: 2024-02-20
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

test.describe.serial('Work with addresses dashboard', () => {
  test('user can see addresses in dashboard', async ({ page }) => {
    await page.goto('/addresses');

    const table = page.getByTestId('addressesTable');
    await expect(table).not.toBeHidden();
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).not.toBe(0);
    expect(await page.locator('tr').count()).toBe(6); // 1 header + 5 playgrounds
  });

  test('user can filter addresses', async ({ page }) => {
    await page.goto('/addresses');

    const searchInput = page.getByRole('textbox', { name: 'Enter an address' });
    const table = page.getByTestId('addressesTable');
    await expect(table).not.toBeHidden();
    await expect(searchInput).not.toBeHidden();

    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).not.toBe(0);

    await searchInput.pressSequentially('fakeinput', { delay: 50 });
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(1);

    await searchInput.clear();
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(6);
  });

  test('user cannot create addresses without details', async ({ page }) => {
    await page.goto('/addresses');

    const newAddressButton = page.getByTestId('newAddressButton');
    await expect(newAddressButton).toBeVisible();
    await newAddressButton.click();

    const form = page.getByTestId('newAddressForm');
    await expect(form).toBeVisible();

    await page.getByText('Confirm').click();

    const errorMessage = page.getByTestId('errorMessage');
    await errorMessage.waitFor();

    expect(errorMessage).toContainText(/Validation error/);
  });

  test('user can create, edit and delete addresses', async ({ page }) => {
    await page.goto('/addresses');

    const searchInput = page.getByRole('textbox', { name: 'Enter an address' });

    const newAddressButton = page.getByTestId('newAddressButton');
    await expect(newAddressButton).toBeVisible();

    // create

    await newAddressButton.click();

    const form = page.getByTestId('newAddressForm');
    await expect(form).toBeVisible();

    await page.getByTestId('streetInput').nth(1).fill('Fake street');
    await page.getByTestId('numberInput').nth(1).fill('12');
    await page.getByTestId('zipCodeInput').nth(1).fill('12345');
    await page.getByTestId('districtInput').nth(1).fill('Fake district');
    await page.getByTestId('cityInput').nth(1).fill('Fake city');
    await page.getByText('Confirm').click();
    await page.waitForTimeout(1000);

    await searchInput.pressSequentially('fake district', { delay: 50 });
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(2);
    expect(page.locator('tr').nth(1).locator('td').first()).toContainText('fake district');
  });

  test('user can edit addresses', async ({ page }) => {
    await page.goto('/addresses');
    const searchInput = page.getByRole('textbox', { name: 'Enter an address' });

    await searchInput.pressSequentially('fake district', { delay: 50 });
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(2);
    expect(page.locator('tr').nth(1).locator('td').first()).toContainText('fake district');

    const editButton = page.getByTestId('editAddressButton');
    await expect(editButton).toBeVisible();
    await editButton.click();

    await page.getByTestId('cityInput').nth(1).fill('Fake city');
    await page.getByText('Confirm').click();
    await page.waitForTimeout(1000);

    await searchInput.pressSequentially('fake district', { delay: 50 });
    page.locator('tr').first().waitFor();
    const deleteButton = page.getByTestId('deleteAddressButton');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
  });

  test('user can delete addresses', async ({ page }) => {
    await page.goto('/addresses');
    const searchInput = page.getByRole('textbox', { name: 'Enter an address' });

    await searchInput.pressSequentially('fake district', { delay: 50 });
    page.locator('tr').first().waitFor();
    const deleteButton = page.getByTestId('deleteAddressButton');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await expect(page.locator('h3')).toContainText('Are you sure you want to delete this address?');
    await page.getByText('Confirm').click();

    await page.waitForTimeout(1000);

    await searchInput.fill('fake district');
    await searchInput.press('Enter');
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(1);
  });
});
