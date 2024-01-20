import { Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';

export default authenticatedProcedure.query(async ({ ctx: { db, authUser } }) => {

    const playgrounds = await db.getRepository(Playground).find({
        where: {
            users: {
                id: authUser.id,
            },
        },
        relations: {
            address: true,
        },
    });

    return {
        playgrounds,
    };
});
