import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { Playground } from './playground';

export type BarePlayground = Omit<Playground, 'address' | 'users' | 'reports' | 'rating'>;

export const playgroundSchema = validates<BarePlayground>().with({
  id: z.number().int().positive(),
  isPrivate: z.boolean(),
  isOpen: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const playgroundInsertSchema = playgroundSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const playgroundUpdateSchema = playgroundInsertSchema.partial()

export type PlaygroundSelect = z.infer<typeof playgroundSchema>;
export type PlaygroundInsert = z.infer<typeof playgroundInsertSchema>;
export type PlaygroundUpdate = z.infer<typeof playgroundUpdateSchema>;
