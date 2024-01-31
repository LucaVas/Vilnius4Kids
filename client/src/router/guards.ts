import { isLoggedIn } from '@/stores/user';

export const authenticate = () => {
  if (!isLoggedIn.value) return { name: 'Login' };

  return true;
};

export const hideForAuth = () => {
  if (isLoggedIn.value) return { name: 'MyHome' };

  return true;
};
