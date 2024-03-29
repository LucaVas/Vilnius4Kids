import { router } from '../trpc';
import user from './user';
import address from './address';
import playground from './playground';
import rating from './rating';
import report from './report';
import reportCategory from './reportCategory';
import verificationToken from './verificationToken';
import password from './password';

export const appRouter = router({
    user,
    address,
    playground,
    rating,
    report,
    reportCategory,
    verificationToken,
    password,
});

export type AppRouter = typeof appRouter;
