import { router } from '../trpc';
import user from './user';
import address from './address';

export const appRouter = router({
    user,
    address
});

export type AppRouter = typeof appRouter;
