import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';

export default authenticatedProcedure.query(
    async ({ ctx: { db, authUser } }) => {
        const user = await db
            .getRepository(User)
            .findOneBy({ id: authUser.id });

        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `User with ID ${authUser.id} does not exist.`,
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
