import { router } from '@server/trpc';
import sendResetToken from './sendResetToken';

export default router({
    sendResetToken,
});
