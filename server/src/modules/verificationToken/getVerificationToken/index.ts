import { publicProcedure } from '@server/trpc';
import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { verificationTokenSelectSchema } from '@server/entities/verification_token/schema';

export default publicProcedure
    .input(verificationTokenSelectSchema)
    .query(async ({ input: { email }, ctx: { db } }) => {
        const user = await db.getRepository(User).findOne({
            where: { email },
            relations: ['verificationToken'],
        });

        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `User with email ${email} does not exist.`,
            });
        }

        if (!user.verificationToken) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `No verification token for user with email ${email} was found.`,
            });
        }

        return {
            token: user.verificationToken.token,
        };
    });
