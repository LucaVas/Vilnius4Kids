import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import logger from '@server/logger';
import { playgroundDeleteSchema } from '../../../entities/playground/schema';
import { User } from '../../../entities/user/user';

export default authenticatedProcedure
    .input(playgroundDeleteSchema)
    .mutation(async ({ input: { id }, ctx: { db, authUser } }) => {
        const user = await db.getRepository(User).findOne({
            relations: {
                playgrounds: true,
            },
            where: { id: authUser.id },
        });

        if (!user) {
            logger.error(`User with ID [${authUser.id}] does not exist.`);
            throw new TRPCError({
                message: `Error while deleting playground from favorites.`,
                code: 'NOT_FOUND',
            });
        }

        user.playgrounds = user.playgrounds.filter(
            (playground) => playground.id !== id
        );

        await db.manager.save(user);

        return {
            message: `Playground deleted successfully from favorites.`,
        };
    });
