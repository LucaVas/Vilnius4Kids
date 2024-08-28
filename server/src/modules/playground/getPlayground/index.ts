import { Playground } from '@server/entities';
import { TRPCError } from '@trpc/server';
import logger from '@server/logger';
import { publicProcedure } from '@server/trpc';
import { playgroundIdSchema } from '../../../entities/playground/schema';

export default publicProcedure
    .input(playgroundIdSchema)
    .query(async ({ input: { id }, ctx: { db } }) => {
        const playground = await db.getRepository(Playground).findOne({
            where: { id },
            relations: ['address'],
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
