import { Report, User } from '@server/entities';
import { reportOptionalIdSchema } from '@server/entities/report/schema';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';

export default authenticatedProcedure
    .input(reportOptionalIdSchema)
    .query(async ({ input, ctx: { db, authUser } }) => {
        const id = input?.id || authUser.id;
        const user = await db.getRepository(User).findOneBy({ id: 8 });

        if (!user) {
            throw new TRPCError({
                message: `User with ID [${id}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        const reports = await db
            .getRepository(Report)
            .createQueryBuilder('report')
            .leftJoinAndSelect('report.playground', 'playground')
            .leftJoinAndSelect('playground.address', 'address')
            .where('report.user = :id', { id: user.id })
            .getMany();

        return {
            count: reports.length,
            reports,
        };
    });
