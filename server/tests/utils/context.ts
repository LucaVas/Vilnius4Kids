import { fakeUser } from '@server/entities/tests/fakes';
import { authUserSchema, type AuthUser } from '@server/entities/user/schema';
import type { Context, ContextMinimal } from '@server/trpc';

export const requestContext = (
    context: Partial<Context> & ContextMinimal
): Context => ({
    req: {
        header: () => undefined,
        get: () => undefined,
    } as any,
    res: {
        cookie: () => undefined,
    } as any,
    ...context,
});

export const authContext = (
    context: Partial<Context> & ContextMinimal,
    user: AuthUser = fakeUser()
): Context => ({
    authUser: authUserSchema.parse(user),
    ...context,
});
