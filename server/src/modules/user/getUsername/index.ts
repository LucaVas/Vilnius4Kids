import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';

export default authenticatedProcedure
    .meta({ description: "Endpoint dedicated to retrieve user's username." })
    .query(async ({ ctx: { db, authUser } }) => {
        const user = await db.getRepository(User).findOne({
            select: { username: true },
            where: { id: authUser?.id },
        });

        if (!user) {
            throw new TRPCError({
                message: `User with ID ${authUser.id} does not exist.`,
                code: 'UNAUTHORIZED',
            });
        }

        return {
            username: user.username
        };
    });
