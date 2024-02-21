import { ReportCategory } from '@server/entities';
import { reportCategoryIdSchema } from '@server/entities/report_category/schema';
import { TRPCError } from '@trpc/server';
import { adminProcedure } from '@server/trpc/adminProcedure';
import logger from '@server/logger';

export default adminProcedure
    .input(reportCategoryIdSchema)
    .mutation(async ({ input: { id }, ctx: { db } }) => {
        const { affected } = await db.getRepository(ReportCategory).delete({
            id,
        });

        if (affected === 0) {
            logger.error(`Report category with ID [${id}] does not exist.`);
            throw new TRPCError({
                message: `Error while deleting report category.`,
                code: 'NOT_FOUND',
            });
        }

        return {
            message: `Report category deleted successfully.`,
        };
    });
