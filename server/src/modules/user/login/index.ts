import { publicProcedure } from '@server/trpc';
import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '@server/config';
import { prepareTokenPayload } from '../tokenPayload';
import { loginSchema } from './schema';

const { expiresIn, tokenKey } = config.auth;

export default publicProcedure
    .meta({ description: 'Endpoint dedicated for user login.' })
    .input(loginSchema)
    .query(async ({ input: { email, password }, ctx: { db } }) => {
        const user = (await db.getRepository(User).findOne({
            select: { id: true, username: true, role: true, password: true },
            where: { email },
        })) as Omit<User, 'email'> | undefined;

        if (!user) {
            throw new TRPCError({
                message: `User with email ${email} does not exist.`,
                code: 'UNAUTHORIZED',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new TRPCError({
                message: 'Invalid password, please try again.',
                code: 'UNAUTHORIZED',
            });
        }

        const payload = prepareTokenPayload(user);

        const token = jwt.sign(payload, tokenKey, { expiresIn });

        return {
            id: user.id,
            token,
            username: user.username,
        };
    });
