import { TRPCError } from '@trpc/server';
import { Address } from '@server/entities';
import { adminProcedure } from '@server/trpc/adminProcedure';
import { addressDeleteSchema } from '../../../entities/address/schema';

export default adminProcedure
    .input(addressDeleteSchema)
    .mutation(async ({ input: { id }, ctx: { db } }) => {
        const raw = await db.getRepository(Address).delete({ id });

        if (raw.affected === 0) {
            throw new TRPCError({
                message: `Address with ID [${id}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        return {
            message: `${raw.affected} address deleted successfully.`,
        };
    });
