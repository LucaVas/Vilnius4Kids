import { router } from '@server/trpc';
import sendResetToken from './sendResetToken';
import reset from './reset';

export default router({
    sendResetToken,
    reset
});
