import { Address, Playground } from '@server/entities';
import { TRPCError } from '@trpc/server';
import logger from '@server/logger';
import { publicProcedure } from '@server/trpc';
import { playgroundReferralSchema } from '../../../entities/playground/schema';

export default publicProcedure
    .input(playgroundReferralSchema)
    .mutation(
        async ({
            input: {
                isPrivate,
                isOpen,
                fullAddress,
                latitude,
                longitude,
                comments,
            },
            ctx: { db },
        }) => {
            setTimeout(() => {
                logger.info(`
                ${isPrivate},
                ${isOpen},
                ${fullAddress},
                ${latitude},
                ${longitude},
                ${comments}`);
            }, 2000);

            return {
                message: 'Playground added successfully.',
            };
        }
    );
