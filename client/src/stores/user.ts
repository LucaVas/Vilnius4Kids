import {
  clearStoredAccessToken,
  getStoredAccessToken,
  getUserIdFromToken,
  getUserRoleFromToken,
  storeAccessToken,
} from '@/utils/auth';
import { trpc } from '@/trpc';
import { computed, ref } from 'vue';

const authToken = ref(getStoredAccessToken(localStorage));
export const authUserId = computed(() =>
  authToken.value ? getUserIdFromToken(authToken.value) : null
);
export const isLoggedIn = computed(() => !!authToken.value);
export const invalidToken = computed(() => authToken.value);
export const isAdmin = computed(() =>
  authToken.value ? getUserRoleFromToken(authToken.value) === 'admin' : false
);

export async function login(userLogin: { email: string; password: string }) {
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
