import { Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';

export default authenticatedProcedure.query(async ({ ctx: { db } }) => {

    const [playgrounds, count] = await db
        .getRepository(Playground)
        .findAndCount();

    return {
        playgrounds,
        count,
    };
});
