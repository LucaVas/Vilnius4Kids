import { Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';
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
            throw new TRPCError({
                message: `Playground with ID [${id}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        const rating = (
            playground.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
            playground.ratings.length
        ).toFixed(2);

        return {
            count: playground.ratings.length,
            rating: rating === 'NaN' ? 0.00 : Number(rating),
        };
    });
