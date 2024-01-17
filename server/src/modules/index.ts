import { router } from '../trpc';
import user from './user';
import item from './item';
import room from './room';
import chat from './message/chat';

export const appRouter = router({
    user,
    item,
    room,
    chat,
});

export type AppRouter = typeof appRouter;
