import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { updateRoomSchema } from '@server/entities/room/schema';
import { Room } from '@server/entities/room/room';
import { TRPCError } from '@trpc/server';

export default authenticatedProcedure
    .input(updateRoomSchema)
    .mutation(async ({ input: room, ctx: { db } }) => {
        const { affected } = await db.getRepository(Room).update(room.id, room);
        if (affected === 0) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Room with id ${room.id} not found.`,
            });
        }

        return db.getRepository(Room).findOneByOrFail({ id: room.id });
    });
