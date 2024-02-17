import { Report } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';

export default authenticatedProcedure.query(async ({ ctx: { db } }) => {
    const reports = await db
        .getRepository(Report)
        .createQueryBuilder('report')
        .leftJoinAndSelect('report.playground', 'playground')
        .leftJoinAndSelect('playground.address', 'address')
        .orderBy('report.createdAt', 'DESC')
        .getMany();

    if (!reports) {
        throw new TRPCError({
            message: `No reports available.`,
            code: 'NOT_FOUND',
        });
    }

    return reports;
});
