import { Item, Room } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { itemRoomUpdateSchema } from '../../../entities/item/schema';

export default authenticatedProcedure
    .input(itemRoomUpdateSchema)
    .mutation(async ({ input: { id, roomId }, ctx: { db } }) => {
        const found = await db.getRepository(Item).findOneBy({ id });
        if (!found)
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Item with id ${id} does not exist.`,
            });

        const room = await db
            .getRepository(Room)
            .findOneBy({ id: roomId });
        if (!room)
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Room with id ${roomId} does not exist.`,
            });

        return db.getRepository(Item).save({
            ...found,
            room,
        });
    });
