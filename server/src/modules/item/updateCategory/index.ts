import { Category, Item } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { In } from 'typeorm';
import { itemCategoryUpdateSchema } from '../../../entities/item/schema';

export default authenticatedProcedure
    .input(itemCategoryUpdateSchema)
    .mutation(async ({ input: { id, categoryIds }, ctx: { db } }) => {
        const found = await db.getRepository(Item).findOneBy({ id });
        if (!found)
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Item with id ${id} does not exist.`,
            });

        const categories = await db
            .getRepository(Category)
            .findBy({ id: In(categoryIds) });

        return db.getRepository(Item).save({
            ...found,
            categories: categories.filter((c) => c !== null),
        });
    });
