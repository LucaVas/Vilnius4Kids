import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { roomIdSchema } from '@server/entities/room/schema';
import { Room } from '@server/entities/room/room';
import { TRPCError } from '@trpc/server';

export default authenticatedProcedure
    .input(roomIdSchema)
    .mutation(async ({ input: { id }, ctx: { db } }) => {
        const { affected } = await db.getRepository(Room).delete(id);
        if (affected === 0) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Room with id ${id} not found.`,
            });
        }

        return {
            message: `Room with ID ${id} deleted successfully.`,
        };
    });
