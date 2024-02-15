import { TRPCError } from '@trpc/server';
import { Playground } from '@server/entities';
import { adminProcedure } from '@server/trpc/adminProcedure';
import { playgroundUpdateSchema } from '../../../entities/playground/schema';

export default adminProcedure
    .input(playgroundUpdateSchema)
    .mutation(async ({ input: { id, isPrivate, isOpen, description }, ctx: { db } }) => {
        const { affected, raw } = await db
            .getRepository(Playground)
            .createQueryBuilder()
            .update()
            .set({ isOpen, isPrivate, description })
            .where('id = :id', { id })
            .returning(['id', 'isOpen', 'isPrivate', 'description'])
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
