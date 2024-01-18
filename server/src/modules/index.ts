import { router } from '../trpc';
import user from './user';
import address from './address';
import playground from './playground';
import rating from './rating';

export const appRouter = router({
    user,
    address,
    playground,
    rating
});

export type AppRouter = typeof appRouter;
