import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { Item } from './item';

export type BareItem = Omit<Item, 'categories' | 'room'>;

export const itemSchema = validates<BareItem>().with({
    id: z.number().int().positive(),
    name: z
        .string()
        .min(2, {
            message: 'Item name must be at least 2 characters long.',
        })
        .trim(),
    description: z
        .string()
        .min(10, {
            message: 'Item description must be at least 10 characters long.',
        })
        .trim(),
    imageUrl: z.string().url(),
    price: z.number().int().positive(),
    width: z.number().positive(),
    length: z.number().positive(),
    x: z.number().positive(),
    y: z.number().positive(),
});

export const itemInsertSchema = itemSchema.omit({ id: true }).extend({
    roomId: z.number().int().positive(),
});;
export const itemUpdateSchema = itemSchema.partial().required({ id: true });
export const idSchema = itemSchema.pick({ id: true });

export const itemCategoryUpdateSchema = idSchema.extend({
    categoryIds: z.array(z.number().int().positive()),
});

export const itemRoomUpdateSchema = idSchema.extend({
    roomId: z.number().int().positive(),
});

export const itemShopUpdateSchema = idSchema.extend({
    shopId: z.number().int().positive(),
});

export const updatePositionSchema = idSchema.extend({
    x: z.number().positive({ message: 'Coordinate X must be positive.' }),
    y: z.number().positive({ message: 'Coordinate Y must be positive.' }),
});
export type ItemInsert = z.infer<typeof itemInsertSchema>;
export type ItemUpdate = z.infer<typeof itemUpdateSchema>;
export type ItemUpdatePosition = z.infer<typeof updatePositionSchema>;
