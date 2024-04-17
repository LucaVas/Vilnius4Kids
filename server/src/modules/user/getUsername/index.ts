import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import logger from '@server/logger';

export default authenticatedProcedure
    .meta({ description: "Endpoint dedicated to retrieve user's username." })
    .query(async ({ ctx: { db, authUser } }) => {
        const user = await db.getRepository(User).findOne({
            select: { username: true },
            where: { id: authUser?.id },
        });

        if (!user) {
            logger.error(`User with ID ${authUser.id} does not exist.`);
            throw new TRPCError({
                message: `There was an error while retrieving username.`,
                code: 'NOT_FOUND',
            });
        }

        return {
            username: user.username,
        };
    });
