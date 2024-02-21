import { TRPCError } from '@trpc/server';
import { Playground } from '@server/entities';
import { adminProcedure } from '@server/trpc/adminProcedure';
import logger from '@server/logger';
import { playgroundUpdateSchema } from '../../../entities/playground/schema';

export default adminProcedure
    .input(playgroundUpdateSchema)
    .mutation(async ({ input: { id, isPrivate, isOpen }, ctx: { db } }) => {
        const { affected, raw } = await db
            .getRepository(Playground)
            .createQueryBuilder()
            .update()
            .set({ isOpen, isPrivate })
            .where('id = :id', { id })
            .returning(['id', 'isOpen', 'isPrivate'])
            .execute();

        if (affected === 0) {
            logger.error(`Playground with ID [${id}] does not exist.`);
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Error while updating playground.`,
            });
        }

        return {
            message: `Playground updated successfully.`,
            playground: raw[0],
        };
    });
