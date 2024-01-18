import { Playground, Rating } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';
import { ratingInsertSchema } from '../../../entities/rating/schema';

export default authenticatedProcedure
    .input(ratingInsertSchema)
    .mutation(async ({ input: { playgroundId, rating }, ctx: { db } }) => {
        const playground = await db
            .getRepository(Playground)
            .findOneBy({ id: playgroundId });

        if (!playground) {
            throw new TRPCError({
                message: `Playground with ID [${playgroundId}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        const newRating = await db.getRepository(Rating).save({
            rating,
            playground,
        });

        return {
            newRating,
            message: 'Playground rated successfully.',
        };
    });
