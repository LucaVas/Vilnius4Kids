import { publicProcedure } from '@server/trpc';
import bcrypt from 'bcrypt';
import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { signupSchema } from './schema';

export default publicProcedure
    .input(signupSchema)
    .mutation(async ({ input: { email, password }, ctx: { db } }) => {
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await db
                .getRepository(User)
                .save({ email, password: hashedPassword });

            return {
                id: user.id,
                email: user.email,
            };
        } catch (error) {
            if (!(error instanceof Error)) {
                throw error;
            }

            if (error.message.includes('duplicate key')) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: `Email ${email} is already taken, please try another.`,
                });
            }

            throw error;
        }
    });
