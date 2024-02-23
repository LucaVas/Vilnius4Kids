import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { Address } from '@server/entities';
import logger from '@server/logger';
import { addressUpdateSchema } from '../../../entities/address/schema';

export default authenticatedProcedure
    .input(addressUpdateSchema)
    .mutation(
        async ({
            input: { id, number, street, zipCode, city, district },
            ctx: { db },
        }) => {
            const { affected, raw } = await db
                .getRepository(Address)
                .createQueryBuilder()
                .update()
                .set({ number, street, zipCode, city, district })
                .where('id = :id', { id })
                .returning(['number', 'street', 'zipCode', 'city', 'district'])
                .execute();

            if (affected === 0) {
                logger.error(`Address with ID [${id}] does not exist.`);
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `Error while updating address.`,
                });
            }

            return {
                message: `Address updated successfully.`,
                address: raw[0],
            };
        }
    );
