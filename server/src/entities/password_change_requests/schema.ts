import { z } from 'zod';
import { validates } from '@vilnius4kids/server/src/utils/validation';
import { PasswordChangeRequest } from './passwordChangeRequest';

export type BarePasswordChangeRequest = Omit<PasswordChangeRequest, 'user'>;

export const passwordChangeRequestSchema =
    validates<BarePasswordChangeRequest>().with({
        id: z.number().int().positive(),
        passwordResetToken: z.string(),
        createdAt: z.date(),
    });

export const passwordChangeRequestValidationSchema = passwordChangeRequestSchema
    .omit({
        id: true,
        createdAt: true,
    })
    .extend({ email: z.string().email() });

export const passwordChangeRequestSelectSchema =
    passwordChangeRequestValidationSchema
        .omit({
            passwordResetToken: true,
        })
        .partial();
