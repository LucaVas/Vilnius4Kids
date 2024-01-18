import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { User } from './user';
import { Role } from './Role';

export type BareUser = Omit<User, 'address' | 'playgrounds' | 'reports'>;
export type AuthUser = Pick<BareUser, 'id'>;

export const userSchema = validates<BareUser>().with({
  id: z.number().int().positive(),
  email: z.string().trim().toLowerCase().min(5).max(255).email(),
  username: z.string().trim().toLowerCase().min(3).max(60),
  password: z
    .string()
    .min(8)
    .max(64)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]$/),
  role: z.nativeEnum(Role),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userInsertSchema = userSchema.omit({ id: true, role: true, createdAt: true, updatedAt: true });
export const userUpdateSchema = userInsertSchema.partial()

export const authUserSchema = validates<AuthUser>().with({
  id: z.number().int().positive(),
});

export type UserInsert = z.infer<typeof userInsertSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserSelect = z.infer<typeof userSchema>;
