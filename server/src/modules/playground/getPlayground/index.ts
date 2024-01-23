import { Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';
import { playgroundIdSchema } from '../../../entities/playground/schema';

export default authenticatedProcedure
    .input(playgroundIdSchema)
    .query(async ({ input: { id }, ctx: { db } }) => {
        const playground = await db.getRepository(Playground).findOne({
            where: { id },
            relations: ['address', 'reports', 'users'],
        });

        if (!playground) {
            throw new TRPCError({
                message: `Playground with ID [${id}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        return playground
    });
