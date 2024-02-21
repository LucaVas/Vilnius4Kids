import { Playground, User } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';
import logger from '@server/logger';
import { playgroundIdSchema } from '../../../entities/playground/schema';

export default authenticatedProcedure
    .input(playgroundIdSchema)
    .mutation(async ({ input: { id }, ctx: { db, authUser } }) => {
        const [playground, user] = await Promise.all([
            db.getRepository(Playground).findOne({
                where: {
                    id,
                },
                relations: {
                    address: true,
                },
            }),
            db.getRepository(User).findOneBy({ id: authUser.id }),
        ]);

        if (!playground) {
            logger.error(`Playground with ID [${id}] does not exist.`);
            throw new TRPCError({
                message: `Error while adding playground to favorites.`,
                code: 'NOT_FOUND',
            });
        }
        if (!user) {
            logger.error(`User with ID [${authUser.id}] does not exist.`);
            throw new TRPCError({
                message: `Error while adding playground to favorites.`,
                code: 'NOT_FOUND',
            });
        }

        await db
            .getRepository(Playground)
            .save({ ...playground, users: [user] });

        return {
            playground,
            message: 'Favorite playground added successfully.',
        };
    });
