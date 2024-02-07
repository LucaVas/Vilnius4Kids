import { TRPCError } from '@trpc/server';
import { Playground } from '@server/entities';
import { adminProcedure } from '@server/trpc/adminProcedure';
import { playgroundDeleteSchema } from '../../../entities/playground/schema';

export default adminProcedure
    .input(playgroundDeleteSchema)
    .mutation(async ({ input: { id }, ctx: { db } }) => {
        const raw = await db.getRepository(Playground).delete({ id });

        if (raw.affected === 0) {
            throw new TRPCError({
                message: `Playground with ID [${id}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        return {
            message: `${raw.affected} playground deleted successfully.`,
        };
    });
