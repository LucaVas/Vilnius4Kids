import { test, expect } from '@playwright/test';
import { signupNewUser } from './utils/api';
import { fakeUser } from './utils/fakeData';

const { email, username, password } = fakeUser();

test.beforeAll(async () => {
  await signupNewUser({ email, username, password });
});

// login before each test
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

// Issue #20
test.describe.serial('save, see and remove favorite playgrounds', () => {
  test('user can add a playground to favorites and then remove it', async ({ page }) => {
    await page.goto('/playgrounds');

    const map = page.getByTestId('playgrounds-map');
    await expect(map).not.toBeHidden({ timeout: 5000 });

    await page.locator('div[role="button"]').first().click();
    const infoBox = page.getByTestId('infobox');
    await expect(infoBox).not.toBeHidden();

    const saveBtn = page.getByRole('button', { name: /Save/i });
    await expect(saveBtn).not.toBeHidden();
    await saveBtn.click({ timeout: 5000 });
    const unsaveBtn = page.getByRole('button', { name: /Unsave/i });
    await expect(unsaveBtn).not.toBeHidden({ timeout: 5000 });

    await page.locator('a[href="/myHome"]').click();

    const playgroundCard = page.getByTestId('playground-card');
    await expect(playgroundCard).not.toBeHidden({ timeout: 5000 });
    await page.reload();
    await expect(playgroundCard).not.toBeHidden({ timeout: 5000 });

    await page.getByTestId('delete-playground-button').click();
    await expect(playgroundCard).toBeHidden({ timeout: 5000 });
    await page.reload();
    await expect(playgroundCard).toBeHidden({ timeout: 5000 });

  });

  //   test('can see project bugs', async ({ page }) => {
  //     // Give (Arrange)
  //     await loginNewUser(page, user);
  //     await page.goto('/dashboard');
  //     await page.getByTestId('viewProjectBugs').click();

  //     // expect to see the project id as the last part of the URL
  //     // slight coupling to the implementation, but it's fine for now
  //     await page.waitForURL(/.+\/\d+$/);
  //     const projectId = Number(page.url().split('/').pop());
  //     expect(projectId).toBeGreaterThan(0); // sanity check

  //     const bug = {
  //       projectId,
  //       code: '500',
  //       name: random.word({ capitalize: true }),
  //       stacktrace: random.sentence({ words: 10 }),
  //     };

  //     // creating a bug directly through the API
  //     const bugCreated = await reportBug(bug);
  //     expect(bugCreated).toMatchObject(bug); // sanity check

  //     // When (Act)
  //     // reload page to see fresh data
  //     await page.reload();

  //     // Then (Assert)
  //     // expect to see our created bug in the list of bugs
  //     const bugList = page.getByRole('list', { name: 'Bugs' });
  //     const bugLatest = bugList.getByRole('listitem').first();
  //     await expect(bugLatest).toContainText(bug.name);
  //     await expect(bugLatest).toContainText(bug.stacktrace);
  //   });

  //   test('can mark a bug as resolved', async ({ page }) => {
  //     // Give (Arrange)
  //     await loginNewUser(page, user);
  //     await page.goto('/dashboard');
  //     await page.getByTestId('viewProjectBugs').click();

  //     // When (Act)
  //     const bugList = page.getByRole('list', { name: 'Bugs' });
  //     const bugLatest = bugList.getByRole('listitem').first();
  //     // expect to see our created bug in the list of bugs
  //     // click on the button to mark the bug as resolved
  //     await bugLatest.getByTestId('resolveBug').click();

  //     // Then (Assert)
  //     // expect to see the bug marked as resolved
  //     await expect(bugLatest.getByTestId('bugResolved')).toContainText('Resolved');
  //   });
});
