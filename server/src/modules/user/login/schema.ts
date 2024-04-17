import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().toLowerCase().trim().describe('User email'),
    password: z.coerce.string().trim().describe('User password'),
});
