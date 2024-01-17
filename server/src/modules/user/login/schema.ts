import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().toLowerCase().trim().email().describe('User email'),
    password: z.coerce.string().trim().describe('User password'),
});