import type { AuthUser } from '@vilnius4kids/server/src/shared/entities';

const TOKEN_KEY = 'token';
const USERNAME_KEY = 'username';

export function getUserFromToken(token: string): AuthUser {
  return JSON.parse(atob(token.split('.')[1])).user;
}

// username
export function storeUsername(storage: Storage, username: string) {
  storage.setItem(USERNAME_KEY, username);
}

export function getStoredUsername(storage: Storage): string | null {
  return storage.getItem(USERNAME_KEY);
}

export function clearStoredUsername(storage: Storage) {
  storage.removeItem(USERNAME_KEY);
}

// token
export function clearStoredAccessToken(storage: Storage) {
  storage.removeItem(TOKEN_KEY);
}

export function storeAccessToken(storage: Storage, token: string) {
  storage.setItem(TOKEN_KEY, token);
}

export function getStoredAccessToken(storage: Storage): string | null {
  return storage.getItem(TOKEN_KEY);
}


export function getUserIdFromToken(token: string) {
  return getUserFromToken(token).id;
}


