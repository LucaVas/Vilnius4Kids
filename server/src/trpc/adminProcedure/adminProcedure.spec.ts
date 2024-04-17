import { authContext, requestContext } from '@tests/utils/context';
import { User } from '@server/entities';
import { fakeUser } from '@server/entities/tests/fakes';
import { createTestDatabase } from '@tests/utils/database';
import { Role } from '@server/entities/user/Role';
import { router } from '..';
import { adminProcedure } from '.';

const routes = router({
    testCall: adminProcedure.query(() => 'passed'),
});

const VALID_TOKEN = 'valid-token';

vi.mock('jsonwebtoken', () => ({
    default: {
        verify: (token: string) => {
            if (token !== VALID_TOKEN) throw new Error('Invalid token');

            return {
                user: { id: 2, username: 'username-test', role: 'admin' },
            };
        },
    },
}));

const db = await createTestDatabase();
const adminUser = await db
    .getRepository(User)
    .save(fakeUser({ role: Role.ADMIN }));
const user = await db.getRepository(User).save(fakeUser({ role: Role.USER }));

it('should pass if user is an administrator', async () => {
    const authenticated = routes.createCaller(
        authContext(
            {
                db,
                req: {
                    header: () => `Bearer ${VALID_TOKEN}`,
                } as any,
            },
            adminUser
        )
    );

    const response = await authenticated.testCall();
    expect(response).toBe('passed');
});

it('should not pass if user is not an administrator', async () => {
    const unauthenticated = routes.createCaller(
        authContext(
            {
                db,
                req: {
                    header: () => `Bearer ${VALID_TOKEN}`,
                } as any,
            },
            user
        )
    );

    await expect(unauthenticated.testCall()).rejects.toThrow(
        /Only administrators have permission to access this resource/i
    );
});

it('should throw an error if user is not logged in', async () => {
    const unauthenticated = routes.createCaller(requestContext({ db }));

    await expect(unauthenticated.testCall()).rejects.toThrow(
        // any authentication-like error
        /login|log in|logged in|authenticate|unauthorized/i
    );
});

it('should throw an error if it is run without access to headers', async () => {
    const invalidToken = routes.createCaller(
        requestContext({
            db,
            req: undefined as any,
        })
    );

    await expect(invalidToken.testCall()).rejects.toThrow(/Express/i);
});

it('should throw an error if user provides invalid token', async () => {
    const invalidToken = routes.createCaller(
        requestContext({
            db,
            req: {
                header: () => 'Bearer invalid-token',
            } as any,
        })
    );

    await expect(invalidToken.testCall()).rejects.toThrow(/token/i);
});
