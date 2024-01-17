import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().toLowerCase().trim().email(),
    password: z.coerce.string().min(8).trim(),
    toRemember: z.boolean().optional(),
});
