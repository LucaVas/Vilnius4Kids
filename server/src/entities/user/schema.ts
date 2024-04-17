import { z } from 'zod';
import { validates } from '@vilnius4kids/server/src/utils/validation';
import { User } from './user';
import { Role } from './Role';

export type BareUser = Omit<
    User,
    | 'address'
    | 'playgrounds'
    | 'reports'
    | 'ratings'
    | 'verificationToken'
    | 'subscription'
    | 'passwordChangeRequest'
>;
export type AuthUser = Pick<BareUser, 'id' | 'username' | 'role'>;

export const userSchema = validates<BareUser>().with({
    id: z.number().int().positive(),
    email: z.string().trim().toLowerCase().min(5).max(255).email(),
    username: z.string().trim().toLowerCase().min(3).max(60),
    password: z
        .string()
        .min(8)
        .max(64)
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    role: z.nativeEnum(Role),
    isRegistered: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const userInsertSchema = userSchema.omit({
    id: true,
    role: true,
    isRegistered: true,
    createdAt: true,
    updatedAt: true,
});
export const userLoginSchema = userSchema.omit({
    id: true,
    isRegistered: true,
    createdAt: true,
    updatedAt: true,
});

export const userUpdateSchema = userInsertSchema.partial();

export const authUserSchema = validates<AuthUser>().with({
    id: z.number().int().positive(),
    username: z.string().trim().toLowerCase().min(3).max(60),
    role: z.nativeEnum(Role),
});

export type UserInsert = z.infer<typeof userInsertSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserSelect = z.infer<typeof userSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
