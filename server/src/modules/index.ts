import { router } from '../trpc';
import user from './user';
import address from './address';
import playground from './playground';
import rating from './rating';
import report from './report';
import reportCategory from './reportCategory';
import verify from './verificationToken/verify';

export const appRouter = router({
    user,
    address,
    playground,
    rating,
    report,
    reportCategory,
    verify
});

export type AppRouter = typeof appRouter;
