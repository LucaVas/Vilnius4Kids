import { publicProcedure } from '@server/trpc';
import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const subscribeSchema = z.object({
    email: z.string().toLowerCase().trim().describe('Email to subscribe.'),
});

export default publicProcedure
    .meta({ description: 'Endpoint dedicated for subscription.' })
    .input(subscribeSchema)
    .mutation(async ({ input: { email }, ctx: { db } }) => {
        const user = await db.getRepository(User).findOne({
            where: { email },
        });

        if (user) {
            throw new TRPCError({
                message: `Something went wrong ...`,
                code: 'BAD_REQUEST',
            });
        }

        // TODO: implement subscription logic and send email

        return {
            message: `Thank you for subscribing!`,
            email,
        };
    });
