import { Item } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { idSchema } from '../../../entities/item/schema';

export default authenticatedProcedure
    .input(idSchema)
    .mutation(async ({ input: { id }, ctx: { db } }) => {
        const itemFound = await db.getRepository(Item).findOneBy({ id });
        if (!itemFound)
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Item with id ${id} does not exist.`,
            });

        return db.getRepository(Item).save({ ...itemFound, room: null });
    });
