import { z } from 'zod';
import { validates } from '@vilnius4kids/server/src/utils/validation';
import { VerificationToken } from './verificationToken';

export type BareVerificationToken = Omit<VerificationToken, 'user'>;

export const verificationTokenSchema = validates<BareVerificationToken>().with({
    id: z.number().int().positive(),
    token: z.string(),
    createdAt: z.date(),
});

export const verificationTokenValidationSchema = verificationTokenSchema
    .omit({
        id: true,
        createdAt: true,
    })
    .extend({ email: z.string().email() });

export const verificationTokenSelectSchema = verificationTokenValidationSchema
    .omit({
        token: true,
    })
    .partial();

export const passwordResetSchema = verificationTokenSchema
    .omit({
        id: true,
        createdAt: true,
    })
    .extend({
        email: z.string().email(),
        password: z.coerce
            .string()
            .regex(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number'
            )
            .max(64, 'Password must be at most 64 characters long')
            .trim()
            .describe('User password'),
    });
