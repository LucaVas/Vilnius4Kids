import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().trim().toLowerCase().min(5).max(255).email(),
    username: z.string().trim().toLowerCase().min(3).max(60),
    password: z.coerce
        .string()
        .min(8)
        .max(64)
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        .trim(),
    toRemember: z.boolean().optional(),
});
