import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { User } from './user';

export type BareUser = Omit<User, 'rooms' | 'messages'>;
export type AuthUser = Pick<BareUser, 'id'>;

export const userSchema = validates<BareUser>().with({
  id: z.number().int().positive(),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(64),
});

export const userInsertSchema = userSchema.omit({ id: true });
export const authUserSchema = validates<AuthUser>().with({
  id: z.number().int().positive(),
});

export type UserInsert = z.infer<typeof userInsertSchema>;
export type UserSelect = z.infer<typeof userSchema>;
