import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import logger from '@server/logger';

export default authenticatedProcedure.query(
    async ({ ctx: { db, authUser } }) => {
        const user = await db
            .getRepository(User)
            .findOneBy({ id: authUser.id });

        if (!user) {
            logger.error(`User with ID ${authUser.id} does not exist.`);
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `There was an error while checking for user verification.`,
            });
        }

        return {
            isVerified:
                user.role === 'admin' || user.role === 'tester'
                    ? true
                    : user.isRegistered,
        };
    }
);
