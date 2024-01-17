import { Category } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { categoryInsertSchema } from '../../../entities/category/schema';

export default authenticatedProcedure
    .input(categoryInsertSchema)
    .mutation(async ({ input: { name }, ctx: { db } }) => {
        const raw = await db.getRepository(Category).delete({ name });

        if (raw.affected === 0) {
            throw new TRPCError({
                message: `Category "${name}" does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        return {
            message: `${raw.affected} category deleted successfully.`,
        };
    });
