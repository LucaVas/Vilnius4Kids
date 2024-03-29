import { Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';
import logger from '@server/logger';
import { playgroundIdSchema } from '../../../entities/playground/schema';

export default authenticatedProcedure
    .input(playgroundIdSchema)
    .query(async ({ input: { id }, ctx: { db } }) => {
        const playground = await db
            .getRepository(Playground)
            .createQueryBuilder('playground')
            .leftJoinAndSelect('playground.ratings', 'ratings')
            .where('playground.id = :id', { id })
            .getOne();

        if (!playground) {
            logger.error(`Playground with ID [${id}] does not exist.`);
            throw new TRPCError({
                message: `Error while retrieving rating for playground.`,
                code: 'NOT_FOUND',
            });
        }

        const rating = (
            playground.ratings.reduce(
                (acc, curr) => acc + Number(curr.rating),
                0
            ) / playground.ratings.length
        ).toFixed(2);

        return {
            count: playground.ratings.length,
            rating: rating === 'NaN' ? 0.0 : Number(rating),
        };
    });
