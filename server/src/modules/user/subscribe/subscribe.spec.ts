import { createTestDatabase } from '@tests/utils/database';
import { Subscription } from '@server/entities';
import userRouter from '..';
import { subscriptionsProducer } from '.';

const db = await createTestDatabase();
const { subscribe } = userRouter.createCaller({ db } as any);

describe('Subscribe', async () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('User can subscribe', async () => {
        const spy = vi.spyOn(subscriptionsProducer, 'push');

        const { message, email } = await subscribe({
            email: 'test@test.com',
        });

        expect(message).toBe('Thank you for subscribing!');
        expect(email).toBe('test@test.com');

        expect(spy).toBeCalledTimes(1);
    });

    it('Throws error with invalid email', async () => {
        await expect(
            subscribe({
                email: 'test@test',
            })
        ).rejects.toThrow(/email/);
    });

    it('Throws error if user is already subscribed', async () => {
        const email = 'test@test.com';

        await db.getRepository(Subscription).save({
            email,
            isUser: false,
            isContacted: false,
        });

        await expect(
            subscribe({
                email,
            })
        ).rejects.toThrow('User already subscribed.');
    });
});
