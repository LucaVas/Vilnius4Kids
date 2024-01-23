import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
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
            throw new TRPCError({
                message: `User with ID [${authUser.id}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        user.playgrounds = user.playgrounds.filter(
            (playground) => playground.id !== id
        );

        await db.manager.save(user);

        return {
            message: `Playground with ID ${id} deleted successfully from favorites.`,
        };
    });
