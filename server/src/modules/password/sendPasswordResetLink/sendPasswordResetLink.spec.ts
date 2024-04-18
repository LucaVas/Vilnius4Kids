import { createTestDatabase } from '@tests/utils/database';
import { PasswordChangeRequest, User } from '@server/entities';
import { fakeUser } from '@server/entities/tests/fakes';
import { Role } from '@server/entities/user/Role';
import bcrypt from 'bcrypt';
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
            'Thank you! We will send an email with a password reset link to your inbox.'
        );
    });

    it('Replaces a change request if it already exists', async () => {
        // Given
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER }));

        const firstChangeRequest = await db
            .getRepository(PasswordChangeRequest)
            .save({
                user,
                passwordResetToken: await bcrypt.hash('test-token', 10),
            });

        await sendPasswordResetLink({ email: user.email });

        // THEN
        const secondChangeRequest = await db
            .getRepository(PasswordChangeRequest)
            .findOneBy({ user });
        expect(firstChangeRequest.id).not.toBe(secondChangeRequest?.id);
        expect(firstChangeRequest.passwordResetToken).not.toBe(
            secondChangeRequest?.passwordResetToken
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
