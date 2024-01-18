import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { Address } from '@server/entities';
import { addressUpdateSchema } from '../../../entities/address/schema';

export default authenticatedProcedure
    .input(addressUpdateSchema)
    .mutation(
        async ({
            input: { id, number, street, zipCode, city },
            ctx: { db },
        }) => {
            const { affected, raw } = await db
                .getRepository(Address)
                .createQueryBuilder()
                .update()
                .set({ number, street, zipCode, city })
                .where('id = :id', { id })
                .returning(['number', 'street', 'zipCode', 'city'])
                .execute();

            if (affected === 0) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `Address with ID [${id}] does not exist.`,
                });
            }

            return {
                message: `Address with ID [${id}] updated successfully.`,
                address: raw[0]
        }
    });
