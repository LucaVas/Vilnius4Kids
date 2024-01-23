import { ReportCategory } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import {
    reportCategoryIdSchema,
} from '@server/entities/reportCategory/schema';
import { TRPCError } from '@trpc/server';

export default authenticatedProcedure
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
