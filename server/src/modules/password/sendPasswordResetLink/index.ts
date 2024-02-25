import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { PasswordChangeRequest, User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import logger from '@server/logger';
import { sendResetLinkSchema } from '@server/entities/password_change_requests/schema';
import mailSender from '@server/modules/emailService';
import { publicProcedure } from '@server/trpc';

export default publicProcedure
    .input(sendResetLinkSchema)
    .mutation(async ({ input: { email }, ctx: { db } }) => {
        const user = await db.getRepository(User).findOne({
            where: { email },
            relations: {
                passwordChangeRequest: true,
            },
        });

        if (!user) {
            logger.error(`User with email [${email}] does not exist.`);
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Error while resetting user password.',
            });
        }

        if (user.passwordChangeRequest) {
            await db
                .createQueryBuilder()
                .delete()
                .from(PasswordChangeRequest)
                .where('id = :id', { id: user.passwordChangeRequest.id })
                .execute();
        }

        const token = crypto.randomBytes(32).toString('hex');
        await db.getRepository(PasswordChangeRequest).save({
            user,
            passwordResetToken: await bcrypt.hash(token, 10),
        });

        try {
            const sender = mailSender(user.username, user.email);
            sender.sendPasswordResetToken(token);
        } catch (error) {
            logger.error(`Error while sending password reset token: ${error}`);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error while sending password reset token.',
            });
        }

        return {
            message:
                'We have sent an email with a password reset link to your inbox.',
        };
    });
