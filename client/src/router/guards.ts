import { isAdmin, isLoggedIn } from '@/stores/user';
import { trpc } from '@/trpc';

export const authenticate = () => {
  if (!isLoggedIn.value) return { name: 'Login' };

  return true;
};

export const showForVerified = async () => {
  const { isVerified } = await trpc.user.isUserVerified.query();
  if (!isVerified) return { name: 'MyHome' };

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
