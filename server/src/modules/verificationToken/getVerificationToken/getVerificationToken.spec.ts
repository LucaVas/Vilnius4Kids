import crypto from 'crypto';
import { createTestDatabase } from '@tests/utils/database';
import { User, VerificationToken } from '@server/entities';
import { fakeUser } from '@server/entities/tests/fakes';
import bcrypt from 'bcrypt';
import { Role } from '@server/entities/user/Role';
import { authContext } from '@tests/utils/context';
import router from '../index';

const db = await createTestDatabase();

describe('Get verification token', async () => {
    it('Get a token generated for user', async () => {
        // Given
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER }));
        const { getVerificationToken } = router.createCaller(
            authContext({ db }, user)
        );
        const verificationToken = await bcrypt.hash(
            crypto.randomBytes(32).toString('hex'),
            10
        );
        await db.getRepository(VerificationToken).save({
            user,
            token: await bcrypt.hash(verificationToken, 10),
        });

        // WHEN
        const { token } = await getVerificationToken();

        // THEN
        expect(token).not.toBeNull();
    });

    it('Throws error if user does not exist', async () => {
        const notSavedUser = db
            .getRepository(User)
            .create(fakeUser({ role: Role.USER }));
        const verificationToken = await bcrypt.hash(
            crypto.randomBytes(32).toString('hex'),
            10
        );
        await db.getRepository(VerificationToken).save({
            notSavedUser,
            token: await bcrypt.hash(verificationToken, 10),
        });
        const { getVerificationToken } = router.createCaller(
            authContext({ db }, notSavedUser)
        );

        await expect(getVerificationToken()).rejects.toThrow(
            `Error while retrieving verification token.`
        );
    });

    it('Returns null if token does not exist', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER }));
        const { getVerificationToken } = router.createCaller(
            authContext({ db }, user)
        );

        const { token } = await getVerificationToken();

        // THEN
        expect(token).toBeNull();
    });
});
