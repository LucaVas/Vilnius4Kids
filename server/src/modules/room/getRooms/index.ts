import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { Room } from '@server/entities/room/room';
import { User } from '@server/entities';

export default authenticatedProcedure.query(
    async ({ ctx: { db, authUser } }) => {
        const user = await db
            .getRepository(User)
            .findOneBy({ id: authUser.id });

        return db.getRepository(Room).find({
            where: { user: user! },
        });
    }
);
