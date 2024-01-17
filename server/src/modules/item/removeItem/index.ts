import { Item } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { idSchema } from '../../../entities/item/schema';

export default authenticatedProcedure
    .input(idSchema)
    .mutation(async ({ input: { id }, ctx: { db } }) => {
        const { affected } = await db
            .getRepository(Item)
            .update({ id }, { room: null });
        if (affected === 0)
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Item with id ${id} does not exist.`,
            });

        return {
            message: `Successfully remove ${affected} item from its room.`,
        };
    });
