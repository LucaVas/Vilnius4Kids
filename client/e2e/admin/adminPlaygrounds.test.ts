import { test, expect } from '@playwright/test';
import { signupNewUser } from '../utils/api';
import { fakeAdmin } from '../utils/fakeData';

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

    await searchInput.pressSequentially('fakeinput', { delay: 50 });
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(1);

    await searchInput.clear();
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(6);
  });

  test('create test address', async ({ page }) => {
    await page.goto('/addresses');

    const addressSearchInput = page.getByRole('textbox', { name: 'Enter an address' });

    const newAddressButton = page.getByTestId('newAddressButton');
    await expect(newAddressButton).toBeVisible();
    await newAddressButton.click();

    const addressForm = page.getByTestId('newAddressForm');
    await expect(addressForm).toBeVisible();

    await page.getByTestId('streetInput').nth(1).fill('test street');
    await page.getByTestId('numberInput').nth(1).fill('1');
    await page.getByTestId('zipCodeInput').nth(1).fill('12345');
    await page.getByTestId('districtInput').nth(1).fill('test district');
    await page.getByTestId('cityInput').nth(1).fill('test city');

    await page.getByText('Confirm').click();

    await page.waitForTimeout(1000);

    await addressSearchInput.fill('test district');
    await addressSearchInput.press('Enter');
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(2);
  });

  test('user can create, edit and delete a playgrounds', async ({ page }) => {
    // create
    await page.goto('/playgrounds');

    const searchInput = page.getByRole('textbox', { name: 'Enter a playground name' });
    const newPlaygroundButton = page.getByTestId('newPlaygroundButton');
    await expect(newPlaygroundButton).toBeVisible();

    await newPlaygroundButton.click();

    const form = page.getByTestId('newPlaygroundForm');
    await expect(form).toBeVisible();

    await page.getByTestId('latitudeInput').nth(1).fill('123');
    await page.getByTestId('longitudeInput').nth(1).fill('456');
    await page.getByLabel('Address').selectOption('test street 1, test district, 12345 test city');
    await page.getByLabel('Description').fill('test description');

    await page.getByText('Confirm').click();

    await page.waitForTimeout(1000);

    // edit

    await searchInput.pressSequentially('test district', { delay: 50 });
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

    await searchInput.pressSequentially('test district', { delay: 50 });
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(2);
    expect(page.locator('tr').nth(1).locator('td').first()).toContainText('test district');
    await expect(editButton).toBeVisible();
    await editButton.click();

    await expect(page.getByLabel('Description')).toHaveValue('new description');

    await page.getByText('Cancel').click();

    await searchInput.pressSequentially('test district', { delay: 50 });
    page.locator('tr').first().waitFor();
    const deleteButton = page.getByTestId('deletePlaygroundButton');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await expect(page.locator('h3')).toContainText(
      'Are you sure you want to delete this playground?'
    );
    await page.getByText('Confirm').click();

    await page.waitForTimeout(1000);

    await searchInput.fill('test district');
    await searchInput.press('Enter');
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(1);
  });

  test('user cannot create playground on existing location', async ({ page }) => {
    await page.goto('/playgrounds');

    const newPlaygroundButton = page.getByTestId('newPlaygroundButton');
    await expect(newPlaygroundButton).toBeVisible();
    await newPlaygroundButton.click();

    const form = page.getByTestId('newPlaygroundForm');
    await expect(form).toBeVisible();

    await page.getByTestId('latitudeInput').nth(1).fill('123');
    await page.getByTestId('longitudeInput').nth(1).fill('456');
    await page.getByLabel('Address').selectOption('test street 1, test district, 12345 test city');
    await page.getByLabel('Description').fill('test description');

    await page.getByText('Confirm').click();

    await page.waitForTimeout(1000);

    await newPlaygroundButton.click();

    await page.getByTestId('latitudeInput').nth(1).fill('123');
    await page.getByTestId('longitudeInput').nth(1).fill('456');
    await page.getByLabel('Address').selectOption('test street 1, test district, 12345 test city');
    await page.getByLabel('Description').fill('test description');

    await page.getByText('Confirm').click();

    const errorMessage = page.getByTestId('errorMessage');
    await errorMessage.waitFor();

    expect(errorMessage).toContainText(
      'Playground already exists at this location'
    );

    await page.getByText('Cancel').click();

    await page.waitForTimeout(1000);

    const searchInput = page.getByRole('textbox', { name: 'Enter a playground name' });
    await searchInput.pressSequentially('test district', { delay: 50 });
    page.locator('tr').first().waitFor();
    const deleteButton = page.getByTestId('deletePlaygroundButton');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await expect(page.locator('h3')).toContainText(
      'Are you sure you want to delete this playground?'
    );
    await page.getByText('Confirm').click();

    await page.waitForTimeout(1000);

    await searchInput.fill('test district');
    await searchInput.press('Enter');
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(1);
  });

  test('delete test address', async ({ page }) => {
    // delete test address
    await page.goto('/addresses');

    const addressSearchInput = page.getByRole('textbox', { name: 'Enter an address' });

    await addressSearchInput.fill('test district');
    await addressSearchInput.press('Enter');
    page.locator('tr').first().waitFor();
    const deleteAddressButton = page.getByTestId('deleteAddressButton');
    await expect(deleteAddressButton).toBeVisible();
    await deleteAddressButton.click();

    await expect(page.locator('h3')).toContainText('Are you sure you want to delete this address?');
    await page.getByText('Confirm').click();

    await page.waitForTimeout(1000);

    await addressSearchInput.fill('test district');
    await addressSearchInput.press('Enter');
    page.locator('tr').first().waitFor();
    expect(await page.locator('tr').count()).toBe(1);
  });
});
