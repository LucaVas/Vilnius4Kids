import { router } from '@server/trpc';
import login from './login';
import signup from './signup';
import getUsername from './getUsername';
import isUserVerified from './isUserVerified';

export default router({
    login,
    signup,
    getUsername,
    isUserVerified,
});
