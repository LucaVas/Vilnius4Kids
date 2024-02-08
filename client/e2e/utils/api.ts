import { apiOrigin, apiPath } from './config';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@vilnius4kids/server/src/shared/trpc';
import { fakeAddress, fakeUser } from './fakeData';
import type { Page } from '@playwright/test';
import { superjson } from './superjson/common';

const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${apiOrigin}${apiPath}`,
    }),
  ],
});

export async function signupNewUser(userSignup = fakeUser()) {
  try {
    await trpc.user.signup.mutate(userSignup);
  } catch (error) {
    // ignore cases when user already exists
  }
}

export async function addTestPlayground() {
  try {
    const address = await trpc.address.addAddress.mutate(fakeAddress())
    await trpc.playground.addPlayground.mutate({
      isPrivate: false,
      isOpen: true,
      addressId: address.id,
      latitude: 58.2344,
      longitude: 21.3443,
      description: 'Test description',
    });
  } catch (error) {
    console.error('ERROR', error)
  }
}

export async function findVerificationToken() {
  const { token } = await trpc.verificationToken.getVerificationToken.query()
  return token !== null
}

/**
 * Logs in a new user by signing them up and logging them in with the provided
 * user login information.
 */
export async function loginNewUser(page: Page, userLogin = fakeUser()) {
  try {
    await trpc.user.signup.mutate(userLogin);
  } catch (error) {
    // ignore cases when user already exists
  }

  const { accessToken } = await trpc.user.login.query({
    email: userLogin.email,
    password: userLogin.password,
  });
  await page.goto('/');

  await page.evaluate(
    ({ accessToken }) => {
      localStorage.setItem('token', accessToken);
    },
    { accessToken }
  );

  return userLogin;
}
