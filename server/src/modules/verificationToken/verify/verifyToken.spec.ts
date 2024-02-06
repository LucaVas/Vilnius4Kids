import crypto from 'crypto';
import { createTestDatabase } from '@tests/utils/database';
import { User, VerificationToken } from '@server/entities';
import { fakeUser } from '@server/entities/tests/fakes';
import bcrypt from 'bcrypt';
import router from '../index';

const db = await createTestDatabase();
const { verify } = router.createCaller({ db } as any);

describe('Verify token', async () => {
    it('Verify a user if token is valid', async () => {
        const token = crypto.randomBytes(32).toString('hex');

        const user = await db.getRepository(User).save(fakeUser());
        await db.getRepository(VerificationToken).save({
            user,
            token: await bcrypt.hash(token, 10),
        });

        const { message } = await verify({
            email: user.email,
            token,
        });

        expect(message).toBe('User has been successfully verified.');
    });

    it('Throws error with invalid token', async () => {
        const token = crypto.randomBytes(32).toString('hex');

        const user = await db.getRepository(User).save(fakeUser());
        await db.getRepository(VerificationToken).save({
            user,
            token: await bcrypt.hash(token, 10),
        });

        await expect(
            verify({
                email: user.email,
                token: 'invalid-token',
            })
        ).rejects.toThrow(/Invalid token/);
    });
});
