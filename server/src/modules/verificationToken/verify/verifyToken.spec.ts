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
        
        // Given
        const token = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
        const user = await db.getRepository(User).save(fakeUser());
        await db.getRepository(VerificationToken).save({
            user,
            token: await bcrypt.hash(token, 10),
        });

        expect(user.isRegistered).toBe(false);

        // WHEN
        const { userId, message } = await verify({
            email: user.email,
            token,
        });

        // THEN
        const verifiedUser = await db.getRepository(User).findOneBy({ id: 1 })
        expect(message).toBe('User has been successfully verified.');
        expect(userId).toBe(user.id);
        expect(verifiedUser?.isRegistered).toBe(true);
    });

    it('Deletes a token when user is verified', async () => {
        const token = crypto.randomBytes(32).toString('hex');

        const user = await db.getRepository(User).save(fakeUser());
        await db.getRepository(VerificationToken).save({
            user,
            token: await bcrypt.hash(token, 10),
        });

        await verify({
            email: user.email,
            token,
        });

        const tokenExists = await db.getRepository(VerificationToken).findOne({
            where: { user },
        });
        expect(tokenExists).toBeNull();
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

    it('Throws errors if user tries to be verified more than once', async () => {
        const token = crypto.randomBytes(32).toString('hex');

        const user = await db.getRepository(User).save(fakeUser());
        await db.getRepository(VerificationToken).save({
            user,
            token: await bcrypt.hash(token, 10),
        });

        await verify({
            email: user.email,
            token,
        });

        const verifiedUser = await db.getRepository(User).findOneBy({ id: user.id });
        expect(verifiedUser?.isRegistered).toBe(true)

        await expect(
            verify({
                email: user.email,
                token,
            })
        ).rejects.toThrow(/User has already been verified/);
    });
});
