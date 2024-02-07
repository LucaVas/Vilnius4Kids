import type { Jwt, JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { authUserSchema } from '@server/entities/user/schema';
import { publicProcedure } from '..';

type VerifyToken = (token: string) => Jwt | JwtPayload | string;

const tokenSchema = z.object({
    user: authUserSchema,
});

export function buildAdminProcedure(verify: VerifyToken) {
    function getUserFromToken(token: string) {
        try {
            const tokenVerified = verify(token);
            const tokenParsed = tokenSchema.parse(tokenVerified);

            return tokenParsed.user;
        } catch (error) {
            return null;
        }
    }

    return publicProcedure.use(({ ctx, next }) => {
        if (ctx.authUser) {
            if (ctx.authUser.role !== 'admin') {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message:
                        'Only administrators have permission to access this resource.',
                });
            }
            return next({
                ctx: {
                    authUser: ctx.authUser,
                },
            });
        }

        if (!ctx.req) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Missing Express request object',
            });
        }

        const token = ctx.req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Unauthenticated. Please log in.',
            });
        }

        const authUser = getUserFromToken(token);

        if (!authUser) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Invalid token.',
            });
        }

        if (authUser.role !== 'admin') {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message:
                    'Only administrators have permission to access this resource.',
            });
        }

        return next({
            ctx: {
                authUser,
            },
        });
    });
}
