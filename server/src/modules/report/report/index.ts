import { Playground, Report, ReportStatusChangeLog } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';
import { ReportStatus } from '@server/entities/report/ReportStatus';
import { reportInsertSchema } from '../../../entities/report/schema';

export default authenticatedProcedure
    .input(reportInsertSchema)
    .mutation(async ({ input: { playgroundId, description }, ctx: { db } }) => {
        const playground = await db
            .getRepository(Playground)
            .findOneBy({ id: playgroundId });

        if (!playground) {
            throw new TRPCError({
                message: `Playground with ID [${playgroundId}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        const newReport = await db
            .getRepository(Report)
            .save({ description, playground });

        await db.getRepository(ReportStatusChangeLog).insert({
            report: newReport,
            playground,
            status: ReportStatus.OPEN,
            changeStatusMessage: description,
        });

        return {
            newReport,
            message: 'Report added successfully.',
        };
    });
