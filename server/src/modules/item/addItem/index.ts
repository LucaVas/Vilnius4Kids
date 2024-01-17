import { Item, Room } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';
import { itemInsertSchema } from '../../../entities/item/schema';

export default authenticatedProcedure
    .input(itemInsertSchema)
    .mutation(async ({ input: item, ctx: { db } }) => {
        const room = await db
            .getRepository(Room)
            .findOneBy({ id: item.roomId });
        if (!room)
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Room with ID ${item.roomId} does not exist.`,
            });

        return db.getRepository(Item).save({
            ...item,
            room,
        });
    });
