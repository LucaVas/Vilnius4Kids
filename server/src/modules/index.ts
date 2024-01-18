import { router } from '../trpc';
import user from './user';
import address from './address';
import playground from './playground';
import rating from './rating';
import report from './report';

export const appRouter = router({
    user,
    address,
    playground,
    rating,
    report
});

export type AppRouter = typeof appRouter;
