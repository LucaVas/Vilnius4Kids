import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';

export default authenticatedProcedure
    .query(async ({ ctx: { db, authUser } }) => {
        const user = await db.getRepository(User).findOne({
            where: { id: authUser.id },
            relations: ['verificationToken'],
        });

        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `User with ID ${authUser.id} does not exist.`,
            });
        }

        return {
            token: user.verificationToken ? user.verificationToken.token : null,
        };
    });
