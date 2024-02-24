import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { PasswordChangeRequest, User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import logger from '@server/logger';
import { passwordChangeRequestValidationSchema } from '@server/entities/password_change_requests/schema';
import mailSender from '@server/modules/emailService';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';

export default authenticatedProcedure
    .input(passwordChangeRequestValidationSchema)
    .mutation(async ({ input: { email }, ctx: { db } }) => {
        const user = await db.getRepository(User).findOne({
            where: { email },
            relations: ['verificationToken'],
        });

        if (!user) {
            logger.error(`User with email [${email}] does not exist.`);
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Error while verifying user.',
            });
        }

        const token = crypto.randomBytes(32).toString('hex');

        await db.getRepository(PasswordChangeRequest).save({
            user,
            passwordResetToken: await bcrypt.hash(token, 10),
        });

        try {
            const sender = mailSender(user.username, user.email);
            sender.sendToken(token);
        } catch (error) {
            logger.error(
                `Error while sending password verification token: ${error}`
            );
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error while sending password verification token.',
            });
        }

        return {
            message:
                'We have sent an email with a password reset link to your inbox.',
        };
    });
