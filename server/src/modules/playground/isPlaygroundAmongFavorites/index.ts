import { Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { playgroundIdSchema } from '@server/entities/playground/schema';

export default authenticatedProcedure
    .input(playgroundIdSchema)
    .query(async ({ input: { id }, ctx: { db, authUser } }) => {
        const playground = await db.getRepository(Playground).findOne({
            where: {
                id,
                users: {
                    id: authUser.id,
                },
            },
        });

        return playground !== null;
    });
