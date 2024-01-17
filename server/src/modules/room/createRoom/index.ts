import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { insertRoomSchema } from '@server/entities/room/schema';
import { Room } from '@server/entities/room/room';
import { User } from '@server/entities';

export default authenticatedProcedure
    .input(insertRoomSchema)
    .mutation(async ({ input: room, ctx: { db, authUser } }) => {

        const user = await db.getRepository(User).findOneBy({ id: authUser.id });

        const roomWithArea = {
            ...room,
            user: user!,
            area: room.length * room.width,
        };
        return db.getRepository(Room).save(roomWithArea);
    });
