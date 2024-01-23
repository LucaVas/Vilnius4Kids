import { ReportCategory } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { reportCategoryInsertSchema } from '@server/entities/reportCategory/schema';

export default authenticatedProcedure
    .input(reportCategoryInsertSchema)
    .mutation(async ({ input: { name }, ctx: { db } }) => {
        const category = await db.getRepository(ReportCategory).save({
            name,
        });

        return {
            category,
            message: 'Report category added successfully.',
        };
    });
