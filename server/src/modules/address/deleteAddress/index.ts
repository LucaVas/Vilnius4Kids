import { TRPCError } from '@trpc/server';
import { Address } from '@server/entities';
import { adminProcedure } from '@server/trpc/adminProcedure';
import logger from '@server/logger';
import { addressDeleteSchema } from '../../../entities/address/schema';

export default adminProcedure
    .input(addressDeleteSchema)
    .mutation(async ({ input: { id }, ctx: { db } }) => {
        const raw = await db.getRepository(Address).delete({ id });

        if (raw.affected === 0) {
            logger.error(`Address with ID [${id}] does not exist.`);
            throw new TRPCError({
                message: `Error while deleting address.`,
                code: 'NOT_FOUND',
            });
        }

        return {
            message: `${raw.affected} address deleted successfully.`,
        };
    });
