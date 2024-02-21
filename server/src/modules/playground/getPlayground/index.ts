import { Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';
import logger from '@server/logger';
import { playgroundIdSchema } from '../../../entities/playground/schema';

export default authenticatedProcedure
    .input(playgroundIdSchema)
    .query(async ({ input: { id }, ctx: { db } }) => {
        const playground = await db.getRepository(Playground).findOne({
            where: { id },
            relations: ['address', 'reports', 'users'],
        });

        if (!playground) {
            logger.error(`Playground with ID [${id}] does not exist.`);
            throw new TRPCError({
                message: `Error while retrieving playground.`,
                code: 'NOT_FOUND',
            });
        }

        return playground;
    });
