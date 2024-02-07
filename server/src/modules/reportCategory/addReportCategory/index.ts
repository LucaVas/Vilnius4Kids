import { ReportCategory } from '@server/entities';
import { reportCategoryInsertSchema } from '@server/entities/report_category/schema';
import { adminProcedure } from '@server/trpc/adminProcedure';

export default adminProcedure
    .input(reportCategoryInsertSchema)
    .mutation(async ({ input: { name, topic, description }, ctx: { db } }) => {
        const category = await db.getRepository(ReportCategory).save({
            name,
            topic,
            description,
        });

        return {
            category,
            message: 'Report category added successfully.',
        };
    });
