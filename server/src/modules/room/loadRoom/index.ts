import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { Room } from '@server/entities/room/room';
import { roomIdSchema } from '@server/entities/room/schema';

export default authenticatedProcedure
    .input(roomIdSchema)
    .query(async ({ input: { id }, ctx: { db } }) =>
        db
            .getRepository(Room)
            .findOne({ where: { id }, relations: { items: true } })
    );
