import { Report, User } from '@server/entities';
import { reportIdSchema } from '@server/entities/report/schema';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';

export default authenticatedProcedure
    .input(reportIdSchema)
    .query(async ({ input: { id }, ctx: { db } }) => {
        const user = await db.getRepository(User).findOneBy({ id });

        if (!user) {
            throw new TRPCError({
                message: `User with ID [${id}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        const [reports, count] = await db
            .getRepository(Report)
            .findAndCountBy({ user });

        return {
            count,
            reports,
        };
    });
