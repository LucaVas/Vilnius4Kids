import { Report } from '@server/entities';
import { reportIdSchema } from '@server/entities/report/schema';
import logger from '@server/logger';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';

export default authenticatedProcedure
    .input(reportIdSchema)
    .query(async ({ input: { id }, ctx: { db } }) => {
        const report = await db
            .getRepository(Report)
            .createQueryBuilder('report')
            .leftJoinAndSelect('report.playground', 'playground')
            .leftJoinAndSelect('playground.address', 'address')
            .leftJoinAndSelect('report.category', 'category')
            .leftJoinAndSelect('report.changeLogs', 'changeLogs')
            .where('report.id = :id', { id })
            .getOne();

        if (!report) {
            logger.error(`Report with ID [${id}] does not exist.`);
            throw new TRPCError({
                message: 'Error while retrieving report.',
                code: 'NOT_FOUND',
            });
        }

        return report;
    });
