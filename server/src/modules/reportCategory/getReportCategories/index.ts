import { ReportCategory } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';

export default authenticatedProcedure.query(async ({ ctx: { db } }) => {
    const [categories, number] = await db
        .getRepository(ReportCategory)
        .findAndCount();

    return {
        categories,
        count: number,
    };
});
