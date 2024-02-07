import { Playground, Rating, User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { verifiedProcedure } from '@server/trpc/verifiedProcedure';
import { ratingInsertSchema } from '../../../entities/rating/schema';

export default verifiedProcedure
    .input(ratingInsertSchema)
    .mutation(
        async ({ input: { playgroundId, rating }, ctx: { db, authUser } }) => {
            const [playground, user] = await Promise.all([
                db.getRepository(Playground).findOneBy({ id: playgroundId }),
                db.getRepository(User).findOneBy({ id: authUser.id }),
            ]);

            if (!playground) {
                throw new TRPCError({
                    message: `Playground with ID [${playgroundId}] does not exist.`,
                    code: 'NOT_FOUND',
                });
            }

            if (!user) {
                throw new TRPCError({
                    message: `User with ID [${authUser.id}] does not exist.`,
                    code: 'NOT_FOUND',
                });
            }

            const availableRating = await db
                .getRepository(Rating)
                .createQueryBuilder('rating')
                .select('rating')
                .where('rating.playground_id = :playgroundId', { playgroundId })
                .andWhere('rating.user_id = :user', { user: user.id })
                .getOne();

            let newRating;
            if (!availableRating) {
                newRating = await db
                    .getRepository(Rating)
                    .createQueryBuilder()
                    .insert()
                    .returning('*')
                    .values({
                        playground,
                        user,
                        rating: Number(rating),
                    })
                    .execute();
            } else {
                newRating = await db
                    .getRepository(Rating)
                    .createQueryBuilder()
                    .update(Rating)
                    .set({ rating: Number(rating) })
                    .where('id = :id', { id: availableRating.id })
                    .returning('*')
                    .execute();
            }

            return {
                newRating: Number(newRating.raw[0].rating),
                message: 'Playground rated successfully.',
            };
        }
    );
