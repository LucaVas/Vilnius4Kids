import { Playground } from '@server/entities';
import { publicProcedure } from '@server/trpc';

export default publicProcedure.query(async ({ ctx: { db } }) => {
    const playgrounds = await db.getRepository(Playground).find({
        relations: {
            address: true,
            users: true,
        },
    });

    return {
        playgrounds,
        count: playgrounds.length,
    };
});
