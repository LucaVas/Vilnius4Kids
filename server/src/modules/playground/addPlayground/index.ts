import { Address, Playground } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { adminProcedure } from '@server/trpc/adminProcedure';
import logger from '@server/logger';
import { playgroundInsertSchema } from '../../../entities/playground/schema';

export default adminProcedure
    .input(playgroundInsertSchema)
    .mutation(
        async ({
            input: { isPrivate, isOpen, addressId, longitude, latitude },
            ctx: { db },
        }) => {
            const address = await db
                .getRepository(Address)
                .findOneBy({ id: addressId });

            if (!address) {
                logger.error(`Address with ID [${addressId}] does not exist.`);
                throw new TRPCError({
                    message: `Error while inserting playground.`,
                    code: 'NOT_FOUND',
                });
            }

            const playground = await db.getRepository(Playground).save({
                isPrivate,
                isOpen,
                address,
                longitude,
                latitude,
            });

            return {
                playground,
                message: 'Playground added successfully.',
            };
        }
    );
