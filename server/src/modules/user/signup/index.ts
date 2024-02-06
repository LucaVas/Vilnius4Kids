import crypto from 'crypto';
import { publicProcedure } from '@server/trpc';
import bcrypt from 'bcrypt';
import { User, VerificationToken } from '@server/entities';
import { TRPCError } from '@trpc/server';
import config from '@server/config';
import { Role } from '@server/entities/user/Role';
import mailSender from '@server/modules/emailService';
import { signupSchema } from './schema';

const { passwordCost } = config.auth;

export default publicProcedure
    .input(signupSchema)
    .mutation(
        async ({ input: { email, username, password, role }, ctx: { db } }) => {
            const hashedPassword = await bcrypt.hash(password, passwordCost);
            const token = crypto.randomBytes(32).toString('hex');

            try {
                const user = await db.getRepository(User).save({
                    email,
                    username,
                    password: hashedPassword,
                    role: role ?? Role.USER,
                });

                await db.getRepository(VerificationToken).save({
                    user,
                    token: await bcrypt.hash(token, 10),
                });

                const sender = mailSender(user.username, user.email);
                sender.sendToken(token);

                return {
                    id: user.id,
                };
            } catch (error) {
                if (!(error instanceof Error)) {
                    throw error;
                }

                if (error.message.includes('duplicate key')) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: `Email or username are already taken, please try different ones.`,
                    });
                }

                throw error;
            }
        }
    );
