import { publicProcedure } from '@server/trpc';
import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '@server/config';
import logger from '@server/logger';
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
            logger.error(`User with email ${email} does not exist.`);
            throw new TRPCError({
                message: `Invalid email or password. Please, try again.`,
                code: 'UNAUTHORIZED',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            logger.error(`Invalid password for user with email ${email}.`);
            throw new TRPCError({
                message: 'Invalid email or password. Please, try again.',
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
