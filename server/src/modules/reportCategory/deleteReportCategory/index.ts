import { ReportCategory } from '@server/entities';
import { reportCategoryIdSchema } from '@server/entities/report_category/schema';
import { TRPCError } from '@trpc/server';
import { adminProcedure } from '@server/trpc/adminProcedure';

export default adminProcedure
    .input(reportCategoryIdSchema)
    .mutation(async ({ input: { id }, ctx: { db } }) => {
        const { affected } = await db.getRepository(ReportCategory).delete({
            id,
        });

        if (affected === 0) {
            throw new TRPCError({
                message: `Report category with ID [${id}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        return {
            message: `Report category with ID [${id}] deleted successfully.`,
        };
    });
