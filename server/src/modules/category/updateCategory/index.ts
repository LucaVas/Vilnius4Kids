import { Category } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { categorySchema } from '../../../entities/category/schema';

export default authenticatedProcedure
    .input(categorySchema)
    .mutation(async ({ input: { id, name }, ctx: { db } }) => {
        const { affected } = await db
            .getRepository(Category)
            .update({ id }, { name });

        if (affected === 0) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Category "${name}" does not exist.`,
            });
        }

        const categoryUpdated = await db
            .getRepository(Category)
            .findOneByOrFail({ name });

        return categoryUpdated;
    });
