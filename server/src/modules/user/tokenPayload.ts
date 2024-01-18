import { Role } from '@server/entities/user/Role';
import type { AuthUser } from '@server/entities/user/schema';
import z from 'zod';

const tokenPayloadSchema = z.object({
    user: z.object({
        id: z.number(),
        username: z.string(),
        role: z.nativeEnum(Role),
    }),
});

type TokenPayload = z.infer<typeof tokenPayloadSchema>;

export function prepareTokenPayload(user: AuthUser): TokenPayload {
    return tokenPayloadSchema.parse({ user });
}

export function getUserFromToken(token: string): AuthUser {
    return JSON.parse(atob(token.split('.')[1])).user;
}

export function getUserIdFromToken(token: string) {
    return getUserFromToken(token).id;
}
