import { router } from '../trpc';
import user from './user';
import address from './address';
import playground from './playground';
import rating from './rating';
import report from './report';
import reportCategory from './reportCategory';
import verificationToken from './verificationToken';
import password from './password';
import s3Images from './s3Images';

export const appRouter = router({
    user,
    address,
    playground,
    rating,
    report,
    reportCategory,
    verificationToken,
    password,
    s3Images,
});

export type AppRouter = typeof appRouter;
