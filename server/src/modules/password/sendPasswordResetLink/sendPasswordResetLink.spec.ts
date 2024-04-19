import { createTestDatabase } from '@tests/utils/database';
import { PasswordChangeRequest, User } from '@server/entities';
import { fakeUser } from '@server/entities/tests/fakes';
import { Role } from '@server/entities/user/Role';
import bcrypt from 'bcrypt';
import buildPasswordResetService from '@server/services/passwordReset';
import { MailService } from '@server/services/types';
import router from '../index';
import { passwordResetProducer } from '.';

const db = await createTestDatabase();
const { sendPasswordResetLink } = router.createCaller({ db } as any);
// Define a mock implementation for the MailService interface
const mockMailService: MailService = {
    sendSubscriptionEmail: vi.fn().mockResolvedValue(undefined),
    sendPasswordResetToken: vi.fn().mockResolvedValue(undefined),
    sendReport: vi.fn().mockResolvedValue(undefined),
    sendVerificationToken: vi.fn().mockResolvedValue(undefined),
};
const passwordResetService = buildPasswordResetService(mockMailService, db);

describe('Send password reset link', async () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('Send a link for user', async () => {
        const spy = vi.spyOn(passwordResetProducer, 'push');
        // Given
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER }));

        const { message } = await sendPasswordResetLink({ email: user.email });

        // THEN
        expect(spy).toBeCalledTimes(1);
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

        // // THEN
        await passwordResetService.processCommand({
            command: 'resetPassword',
            content: {
                user,
            },
            timestamp: new Date(),
        });
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

    it('Throws error if RabbitMQ producer fails', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER }));

        const spy = vi.spyOn(passwordResetProducer, 'push');
        spy.mockRejectedValue(new Error('RabbitMQ error'));

        await expect(sendPasswordResetLink({ email: user.email })).rejects.toThrow(
            `Error while sending password reset token.`
        );
    });
});
