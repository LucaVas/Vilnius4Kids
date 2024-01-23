import {
  clearStoredAccessToken,
  clearStoredUsername,
  getStoredAccessToken,
  getStoredUsername,
  getUserIdFromToken,
  storeAccessToken,
  storeUsername,
} from '@/utils/auth';
import { trpc } from '@/trpc';
import { computed, ref } from 'vue';

// We could wrap this inside of a Pinia store.
// We could use @tanstack/vue-query for query caching.
// You are free to experiment with more streamlined state management solutions
// in your own project.
// Here we will use a simple example that should be understandable for everyone.

// Intial state.
// Auth token is string OR null.
const authToken = ref(getStoredAccessToken(localStorage));
export const username = ref(getStoredUsername(localStorage))

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
  const { id, username, token } = await trpc.user.login.query(userLogin);

  authToken.value = token;
  storeAccessToken(localStorage, token);
  clearStoredUsername(localStorage);
  storeUsername(localStorage, username);
}

export function logout() {
  authToken.value = null;
  username.value = null;
  clearStoredAccessToken(localStorage);
  clearStoredUsername(localStorage);
}

export const signup = trpc.user.signup.mutate;
