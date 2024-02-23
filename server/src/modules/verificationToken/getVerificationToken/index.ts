import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import logger from '@server/logger';

export default authenticatedProcedure
    .query(async ({ ctx: { db, authUser } }) => {
        const user = await db.getRepository(User).findOne({
            where: { id: authUser.id },
            relations: ['verificationToken'],
        });

        if (!user) {
            logger.error(`User with ID [${authUser.id}] does not exist.`)
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Error while retrieving verification token.',
            });
        }

        return {
            token: user.verificationToken ? user.verificationToken.token : null,
        };
    });
