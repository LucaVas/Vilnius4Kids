import { Report } from '@server/entities';
import { reportIdSchema } from '@server/entities/report/schema';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';

export default authenticatedProcedure
    .input(reportIdSchema)
    .query(async ({ input: { id }, ctx: { db } }) => {
        const report = await db.getRepository(Report).findOneBy({ id });

        if (!report) {
            throw new TRPCError({
                message: `Report with ID [${id}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        return report;
    });
