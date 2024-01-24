import { Playground, Report } from '@server/entities';
import { reportIdSchema } from '@server/entities/report/schema';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';

export default authenticatedProcedure
    .input(reportIdSchema)
    .query(async ({ input: { id }, ctx: { db } }) => {

        const playground = await db.getRepository(Playground).findOneBy({ id });

        if (!playground) {
            throw new TRPCError({
                message: `Playground with ID [${id}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        const [reports, count] = await db
            .getRepository(Report)
            .findAndCountBy({ playground });

        return {
            count,
            reports,
        };
    });
