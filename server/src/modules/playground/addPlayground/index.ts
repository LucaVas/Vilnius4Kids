import { Address, Playground } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { adminProcedure } from '@server/trpc/adminProcedure';
import { playgroundInsertSchema } from '../../../entities/playground/schema';

export default adminProcedure
    .input(playgroundInsertSchema)
    .mutation(
        async ({
            input: { isPrivate, isOpen, addressId, longitude, latitude, description },
            ctx: { db },
        }) => {
            const address = await db
                .getRepository(Address)
                .findOneBy({ id: addressId });

            if (!address) {
                throw new TRPCError({
                    message: `Address with ID [${addressId}] does not exist.`,
                    code: 'NOT_FOUND',
                });
            }

            const playground = await db.getRepository(Playground).save({
                isPrivate,
                isOpen,
                address,
                longitude,
                latitude,
                description
            });

            return {
                playground,
                message: 'Playground added successfully.',
            };
        }
    );
