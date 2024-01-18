import { z } from 'zod';

export const signupSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(5)
        .max(255)
        .email()
        .describe('User email'),
    username: z
        .string()
        .trim()
        .toLowerCase()
        .min(3)
        .max(60)
        .describe('User username'),
    password: z.coerce
        .string()
        .min(8)
        .max(64)
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        .trim()
        .describe('User password'),
    toRemember: z
        .boolean()
        .optional()
        .describe('Whether to remember user session'),
});
