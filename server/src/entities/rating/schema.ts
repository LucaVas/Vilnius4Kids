import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { Rating } from './rating';

export type BareRating = Omit<Rating, 'playground'>;

export const ratingSchema = validates<BareRating>().with({
  id: z.number().int().positive(),
  rating: z.number().positive(),
  votes: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ratingInsertSchema = ratingSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const ratingUpdateSchema = ratingInsertSchema.partial()

export type RatingSelect = z.infer<typeof ratingSchema>;
export type RatingInsert = z.infer<typeof ratingInsertSchema>;
export type RatingUpdate = z.infer<typeof ratingUpdateSchema>;
