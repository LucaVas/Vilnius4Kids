import { Address } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { addressInsertSchema } from '../../../entities/address/schema';

export default authenticatedProcedure
    .input(addressInsertSchema)
    .mutation(
        async ({ input: { number, street, zipCode, city }, ctx: { db } }) => {
            const address = await db
                .getRepository(Address)
                .save({ number, street, zipCode, city });

            return {
                address,
                message: 'Address added successfully.',
            };
        }
    );
