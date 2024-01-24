import { ReportCategory } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { reportCategoryInsertSchema } from '@server/entities/report_category/schema';

export default authenticatedProcedure
    .input(reportCategoryInsertSchema)
    .mutation(async ({ input: { name, topic, description }, ctx: { db } }) => {
        const category = await db.getRepository(ReportCategory).save({
            name, topic, description
        });

        return {
            category,
            message: 'Report category added successfully.',
        };
    });
