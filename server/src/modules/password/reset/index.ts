import { publicProcedure } from '@server/trpc';
import bcrypt from 'bcrypt';
import { PasswordChangeRequest, User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { passwordResetSchema } from '@server/entities/verification_token/schema';
import logger from '@server/logger';
import config from '@server/config';

const { passwordCost } = config.auth;

export default publicProcedure
    .input(passwordResetSchema)
    .mutation(async ({ input: { email, token, password }, ctx: { db } }) => {
        // check if user exists
        const user = await db.getRepository(User).findOne({
            where: { email },
            relations: {
                passwordChangeRequest: true,
            }
        });

        if (!user) {
            logger.error(`User with email [${email}] does not exist.`);
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Error while resetting user password.',
            });
        }
        
        // check if user has open password change request
        if (!user.passwordChangeRequest) {
            logger.error(
                `User with email [${email}] has no open password change request.`
            );
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Error while resetting user password.',
            });
        }

        logger.info(user);

        // check if password reset token is valid
        const isMatch = await bcrypt.compare(
            token,
            user.passwordChangeRequest.passwordResetToken
        );

        if (!isMatch) {
            logger.error(
                `Invalid password reset token for user with email [${email}].`
            );
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Error while resetting user password.',
            });
        }

        // hash new password
        const hashedPassword = await bcrypt.hash(password, passwordCost);

        await Promise.all([
            // save new password
            await db.getRepository(User).save({
                ...user,
                password: hashedPassword,
            }),
            // delete password change request
            db
                .getRepository(PasswordChangeRequest)
                .delete({ id: user.passwordChangeRequest.id }),
        ]);

        return {
            userId: user.id,
            message: 'Password reset successfully. You can log in now.',
        };
    });
