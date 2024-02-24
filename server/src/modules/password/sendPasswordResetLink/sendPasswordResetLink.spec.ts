import { createTestDatabase } from '@tests/utils/database';
import { User } from '@server/entities';
import { fakeUser } from '@server/entities/tests/fakes';
import { Role } from '@server/entities/user/Role';
import router from '../index';

const db = await createTestDatabase();
const { sendPasswordResetLink } = router.createCaller({ db } as any);

describe('Send password reset link', async () => {
    it('Send a link for user', async () => {
        // Given
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER }));

        const { message } = await sendPasswordResetLink({ email: user.email });

        // THEN
        expect(message).toBe(
            'We have sent an email with a password reset link to your inbox.'
        );
    });

    it('Throws error if user does not exist', async () => {
        const notSavedUser = db
            .getRepository(User)
            .create(fakeUser({ role: Role.USER }));

        await expect(
            sendPasswordResetLink({ email: notSavedUser.email })
        ).rejects.toThrow(`Error while resetting user password.`);
    });
});
