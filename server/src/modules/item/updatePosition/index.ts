import { publicProcedure } from '@server/trpc';
import { Item } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { updatePositionSchema } from '../../../entities/item/schema';

export default publicProcedure
    .input(updatePositionSchema)
    .mutation(async ({ input: { id, x, y }, ctx: { db } }) => {
        const found = await db.getRepository(Item).findOneBy({ id });
        if (!found)
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Item with id ${id} does not exist.`,
            });

        const item = await db.getRepository(Item).save({
            ...found,
            x,
            y,
        });

        return {
            item,
        };
    });
