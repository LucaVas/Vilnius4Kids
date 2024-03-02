import { createTestDatabase } from '@tests/utils/database';
import { PasswordChangeRequest, User } from '@server/entities';
import { fakeUser } from '@server/entities/tests/fakes';
import { Role } from '@server/entities/user/Role';
import bcrypt from 'bcrypt';
import router from '../index';

const db = await createTestDatabase();
const { reset } = router.createCaller({ db } as any);

describe('Reset password', async () => {
    it('Resets a user password', async () => {
        // Given
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER }));

        const changeRequest = await db
            .getRepository(PasswordChangeRequest)
            .save({
                passwordResetToken: await bcrypt.hash('test-token', 10),
                user,
            });

        const { message } = await reset({
            password: 'NewPassword123',
            email: user.email,
            token: 'test-token',
        });

        const userAfterChange = await db
            .getRepository(User)
            .findOneBy({ id: user.id });

        const changeRequestAfterChange = await db
            .getRepository(PasswordChangeRequest)
            .findOneBy({ id: changeRequest.id });
        // THEN
        expect(message).toBe(
            'Password reset successfully. You can log in now.'
        );
        expect(userAfterChange).not.toBeNull();
        expect(changeRequestAfterChange).toBeNull();
        expect(user.password).not.toBe('NewPassword123');
        expect(userAfterChange?.password).not.toBe(user.password);
    });

    it('Throws error if user does not exist', async () => {
        const notSavedUser = db
            .getRepository(User)
            .create(fakeUser({ role: Role.USER }));

        await expect(
            reset({
                password: 'Password123.',
                email: notSavedUser.email,
                token: 'test-token',
            })
        ).rejects.toThrow(`Error while resetting user password.`);
    });

    it('Throws error if password change request does not exist', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER }));

        await expect(
            reset({
                password: 'Password123.',
                email: user.email,
                token: 'test-token',
            })
        ).rejects.toThrow(`Error while resetting user password.`);
    });

    it('Throws error if token is invalid', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER }));

        await db.getRepository(PasswordChangeRequest).save({
            passwordResetToken: 'test-token',
            user,
        });

        await expect(
            reset({
                password: 'Password123.',
                email: user.email,
                token: 'invalid-token',
            })
        ).rejects.toThrow(`Error while resetting user password.`);
    });
});
