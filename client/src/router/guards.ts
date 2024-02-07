import { isAdmin, isLoggedIn } from '@/stores/user';

export const authenticate = () => {
  if (!isLoggedIn.value) return { name: 'Login' };

  return true;
};

export const showForAdmin = () => {
  if (!isAdmin.value) return { name: 'MyHome' };

  return true;
};

export const hideForAuth = () => {
  if (isLoggedIn.value) return { name: 'MyHome' };

  return true;
};
