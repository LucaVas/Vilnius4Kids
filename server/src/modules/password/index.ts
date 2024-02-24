import { router } from '@server/trpc';
import sendPasswordResetLink from './sendPasswordResetLink';
import reset from './reset';

export default router({
    sendPasswordResetLink,
    reset,
});
