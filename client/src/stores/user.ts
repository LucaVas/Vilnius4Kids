import {
  clearStoredAccessToken,
  getStoredAccessToken,
  getUserIdFromToken,
  storeAccessToken,
} from '@/utils/auth';
import { trpc } from '@/trpc';
import { computed, ref } from 'vue';

const authToken = ref(getStoredAccessToken(localStorage));

// Our client knowing about authUserId is not needed in our current setup
// but it would be useful in most real-world apps.
export const authUserId = computed(() =>
  authToken.value ? getUserIdFromToken(authToken.value) : null
);

// This could be a function that we call instead of a computed property.
export const isLoggedIn = computed(() => !!authToken.value);

// Exported API procedures.
/**
 * Log in a user and store the access token in the store and in the local storage.
 */
export async function login(userLogin: { email: string; password: string }) {
  // login might not be considered a mutation, but we are considering it as such
  // given that it creates a new "thing" - an access token.

  const { token } = await trpc.user.login.query(userLogin);

  authToken.value = token;
  storeAccessToken(localStorage, token);
}

export async function getUsername() {
  const { username } = await trpc.user.getUsername.query();
  return username;
}

export function logout() {
  authToken.value = null;
  clearStoredAccessToken(localStorage);
}

export const signup = trpc.user.signup.mutate;
