import { Address, Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';
import { playgroundInsertSchema } from '../../../entities/playground/schema';

export default authenticatedProcedure
    .input(playgroundInsertSchema)
    .mutation(
        async ({ input: { isPrivate, isOpen, addressId }, ctx: { db } }) => {
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
                address
            });

            return {
                playground,
                message: 'Playground added successfully.',
            };
        }
    );
