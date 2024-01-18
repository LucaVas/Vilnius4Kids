import { router } from '@server/trpc';
import rate from './rate';
import getRating from './getRating';

export default router({
    rate,
    getRating
});
