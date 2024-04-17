import { z } from 'zod';
import { validates } from '@vilnius4kids/server/src/utils/validation';
import { Rating } from './rating';

export type BareRating = Omit<Rating, 'playground' | 'user'>;

export const ratingSchema = validates<BareRating>().with({
    id: z.number().int().positive(),
    rating: z
        .number()
        .positive({ message: 'Rating must be positive.' })
        .max(5)
        .describe('Single rating of playground.'),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const ratingInsertSchema = ratingSchema
    .omit({ id: true, votes: true, createdAt: true, updatedAt: true })
    .extend({ playgroundId: z.number().int().positive() });

export type RatingSelect = z.infer<typeof ratingSchema>;
export type RatingInsert = z.infer<typeof ratingInsertSchema>;
