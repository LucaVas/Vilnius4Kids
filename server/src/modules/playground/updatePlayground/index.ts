import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { Playground } from '@server/entities';
import { playgroundUpdateSchema } from '../../../entities/playground/schema';

export default authenticatedProcedure
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
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Playground with ID [${id}] does not exist.`,
            });
        }

        return {
            message: `Playground with ID [${id}] updated successfully.`,
            playground: raw[0],
        };
    });
