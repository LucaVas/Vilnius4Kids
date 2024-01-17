import { Category } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { categoryInsertSchema } from '../../../entities/category/schema';

export default authenticatedProcedure
    .input(categoryInsertSchema)
    .mutation(async ({ input: { name }, ctx: { db } }) => {
        const category = await db.getRepository(Category).save({ name });

        return {
            id: category.id,
            name: category.name,
        };
    });
