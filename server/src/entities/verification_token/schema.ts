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

export const verificationTokenSelectSchema =
    verificationTokenValidationSchema.omit({
        token: true,
    }).partial();
