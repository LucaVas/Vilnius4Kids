import { Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';

export default authenticatedProcedure.query(async ({ ctx: { db } }) => {
    const playgrounds = await db.getRepository(Playground).find({
        relations: {
            address: true,
            users: true,
        },
    }) 

    return {
        playgrounds,
        count: playgrounds.length,
    };
});
