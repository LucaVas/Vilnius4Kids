import crypto from 'crypto';
import { createTestDatabase } from '@tests/utils/database';
import { User, VerificationToken } from '@server/entities';
import { fakeUser } from '@server/entities/tests/fakes';
import bcrypt from 'bcrypt';
import router from '../index';

const db = await createTestDatabase();
const { getVerificationToken } = router.createCaller({ db } as any);


describe('Get verification token', async () => {
    it('Get a token generated for user', async () => {
        // Given
        const verificationToken = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
        const user = await db.getRepository(User).save(fakeUser());
        await db.getRepository(VerificationToken).save({
            user,
            token: await bcrypt.hash(verificationToken, 10),
        });

        // WHEN
        const { token } = await getVerificationToken({
            email: user.email,
        });

        // THEN
        expect(token).not.toBeNull();
    });

    it('Throws error if user does not exist', async () => {
        const token = crypto.randomBytes(32).toString('hex');

        const user = await db.getRepository(User).save(fakeUser());
        await db.getRepository(VerificationToken).save({
            user,
            token: await bcrypt.hash(token, 10),
        });

        await expect(
            getVerificationToken({
                email: 'notexisting@email.com',
            })
        ).rejects.toThrow(
            /User with email notexisting@email.com does not exist/
        );
    });

    it('Throws error if token does not exist', async () => {

        const user = await db.getRepository(User).save(fakeUser());

        await expect(
            getVerificationToken({
                email: user.email,
            })
        ).rejects.toThrow(
            `No verification token for user with email ${user.email} was found.`
        );
    });

});
