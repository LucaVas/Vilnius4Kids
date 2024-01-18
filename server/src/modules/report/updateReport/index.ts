import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { Report } from '@server/entities';
import { reportUpdateSchema } from '../../../entities/report/schema';

export default authenticatedProcedure
    .input(reportUpdateSchema)
    .mutation(async ({ input: { id, description, status }, ctx: { db } }) => {

        const { affected, raw } = await db
            .getRepository(Report)
            .createQueryBuilder()
            .update()
            .set({ description, status })
            .where('id = :id', { id })
            .returning('*')
            .execute();

        if (affected === 0) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Report with ID [${id}] does not exist.`,
            });
        }

        return {
            message: `Report with ID [${id}] updated successfully.`,
            report: raw[0],
        };
    });
