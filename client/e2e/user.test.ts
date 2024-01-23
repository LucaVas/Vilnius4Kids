import { test, expect } from '@playwright/test'
import { loginNewUser } from 'utils/api'
import { fakeUser } from 'utils/fakeData'

const { email, username, password } = fakeUser()

test.describe.serial('signup and login sequence', () => {
  test('visitor can signup', async ({ page }) => {
    // Given (ARRANGE)
    await page.goto('/signup')
    const successMessage = page.getByTestId('successMessage')
    await expect(successMessage).toBeHidden() // sanity check

    // When (ACT)
    const form = page.getByRole('form', { name: 'Signup' })
    await form.locator('input[id="username"]').fill(username);
    await form.locator('input[type="email"]').fill(email);
    await form.locator('input[type="password"]').fill(password)
    await form.locator('button[type="submit"]').click()

    // Then (ASSERT)
    await expect(successMessage).toBeVisible({ timeout: 5000 })
  })

  test('visitor can not access his homepage before login', async ({ page }) => {
    await page.goto('/myHome')

    // user is redirected to login page
    await page.waitForURL('/login')
  })

  test('visitor can login', async ({ page }) => {
    // Given (ARRANGE)
    await page.goto('/login')
    const myHomeLink = page.getByRole('link', { name: 'My playgrounds' });
    await expect(myHomeLink).toBeHidden()

    // When (ACT)
    const form = page.getByRole('form', { name: 'Login' })
    await form.locator('input[type="email"]').fill(email)
    await form.locator('input[type="password"]').fill(password)
    await form.locator('button[type="submit"]').click()

    // Then (ASSERT)
    await expect(myHomeLink).toBeVisible()

    // Refresh the page to make sure that the user is still logged in.
    await page.reload()
    await expect(myHomeLink).toBeVisible()
  })
})

// Running logout test in isolation.
test('visitor can log out', async ({ page }) => {
  // Given (ARRANGE)
  await loginNewUser(page)

  await page.goto('/myHome')
  const logoutLink = page.getByRole('link', { name: 'Logout' })

  // When (ACT)
  await logoutLink.click()

  // Then (ASSERT)
  await expect(logoutLink).toBeHidden()

  // Ensure that we are redirected to the login page.
  // This test would break if we changed the login page URL,
  // but this is a significant change that we would want to
  // be aware of.
  await expect(page).toHaveURL('/login')

  // Refresh the page to make sure that the user is still logged out.
  await page.goto('/myHome')
  await expect(logoutLink).toBeHidden()
  await expect(page).toHaveURL('/login')
})
