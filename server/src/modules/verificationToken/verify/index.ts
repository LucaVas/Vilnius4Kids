import { publicProcedure } from '@server/trpc';
import bcrypt from 'bcrypt';
import { User, VerificationToken } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { verificationTokenValidationSchema } from '@server/entities/verification_token/schema';
import logger from '@server/logger';

export default publicProcedure
    .input(verificationTokenValidationSchema)
    .mutation(async ({ input: { email, token }, ctx: { db } }) => {
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

        if (user.isRegistered) {
            logger.error(
                `User with email [${email}] has already been verified.`
            );
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Error while verifying user.',
            });
        }

        const isMatch = await bcrypt.compare(
            token,
            user.verificationToken.token
        );

        if (!isMatch) {
            logger.error(`Invalid token for user with email [${email}].`);
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Error while verifying user.',
            });
        }

        await Promise.all([
            db
                .getRepository(User)
                .update({ id: user.id }, { isRegistered: true }),
            db
                .getRepository(VerificationToken)
                .delete({ id: user.verificationToken.id }),
        ]);

        return {
            userId: user.id,
            message: 'User has been successfully verified.',
        };
    });
