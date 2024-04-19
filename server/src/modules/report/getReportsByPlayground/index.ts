import { Playground, Report } from '@server/entities';
import { reportIdSchema } from '@server/entities/report/schema';
import logger from '@server/logger';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';

export default authenticatedProcedure
    .input(reportIdSchema)
    .query(async ({ input: { id }, ctx: { db } }) => {
        const playground = await db.getRepository(Playground).findOneBy({ id });

        if (!playground) {
            logger.error(`Playground with ID [${id}] does not exist.`);
            throw new TRPCError({
                message: 'Error while retrieving report.',
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
