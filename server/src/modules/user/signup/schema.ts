import { Role } from '@server/entities/user/Role';
import { z } from 'zod';

export const signupSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(5, 'Email must be at least 5 characters long')
        .max(255, 'Email must be at most 255 characters long')
        .email({ message: 'Invalid email'})
        .describe('User email'),
    username: z
        .string()
        .trim()
        .toLowerCase()
        .min(3, 'Username must be at least 3 characters long')
        .max(60, 'Username must be at most 60 characters long')
        .describe('User username'),
    password: z.coerce
        .string()
        .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number'
        )
        .max(64, 'Password must be at most 64 characters long')
        .trim()
        .describe('User password'),
    role: z.nativeEnum(Role).optional(),
    toRemember: z
        .boolean()
        .optional()
        .describe('Whether to remember user session'),
});
