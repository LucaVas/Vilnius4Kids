import { publicProcedure } from '@server/trpc';
import bcrypt from 'bcrypt';
import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { verificationTokenValidationSchema } from '@server/entities/verification_token/schema';


export default publicProcedure
    .input(verificationTokenValidationSchema)
    .mutation(
        async ({ input: { email, token }, ctx: { db } }) => {

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

            const isMatch = await bcrypt.compare(token, user.verificationToken.token);

            if (!isMatch) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Invalid token, please try again.',
                });
            }

            await db.getRepository(User).update({ id: user.id }, { isRegistered: true });

            return {
                message: 'User has been successfully verified.',
            };
        }
    );
