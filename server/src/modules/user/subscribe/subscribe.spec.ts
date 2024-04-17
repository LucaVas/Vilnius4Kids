import { createTestDatabase } from '@tests/utils/database';
import { Subscription } from '@server/entities';
import userRouter from '..';

const db = await createTestDatabase();
const { subscribe } = userRouter.createCaller({ db } as any);

describe('Subscribe', async () => {
    it('Signs can subscribe', async () => {
        const { message, email } = await subscribe({
            email: 'test@test.com',
        });

        const subscription = await db
            .getRepository(Subscription)
            .findOneBy({ email: 'test@test.com' });

        expect(message).toBe('Thank you for subscribing!');
        expect(email).toBe('test@test.com');
        expect(subscription).not.toBeNull();
    });

    it('Throws error with invalid email', async () => {
        await expect(
            subscribe({
                email: 'test@test',
            })
        ).rejects.toThrow(/email/);
    });

    it('Throws error if user is already subscribed', async () => {
        await expect(
            subscribe({
                email: 'test@test.com',
            })
        ).rejects.toThrow('User already subscribed.');
    });
});
