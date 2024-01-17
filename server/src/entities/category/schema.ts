import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { Category } from './category';

export type BareCategory = Omit<Category, 'items'>;

export const categorySchema = validates<BareCategory>().with({
    id: z.number().int().positive(),
    name: z
        .string()
        .min(2, {
            message: 'Category name must be at least 2 characters long.',
        })
        .trim(),
});

export const categoryInsertSchema = categorySchema.omit({ id: true });
export type CategoryInsert = z.infer<typeof categoryInsertSchema>;
export type CategoryUpdate = z.infer<typeof categorySchema>;
