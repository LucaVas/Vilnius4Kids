import { publicProcedure } from '@server/trpc';
import { Subscription, User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { subscriptionInsertSchema } from '@server/entities/subscription/schema';
import mailSender from '@server/modules/emailService';

export default publicProcedure
    .meta({ description: 'Endpoint dedicated for subscription.' })
    .input(subscriptionInsertSchema)
    .mutation(async ({ input: { email }, ctx: { db } }) => {
        const user = await db.getRepository(User).findOne({
            where: { email },
        });

        const sender = mailSender(null, email);
        try {
            await sender.sendSubscriptionEmail();
        } catch (error) {
            throw new TRPCError({
                message: `Error while sending subscription email.`,
                code: 'INTERNAL_SERVER_ERROR',
            });
        }

        const subscription = db.getRepository(Subscription).create({
            email,
            isUser: !!user,
            isContacted: true,
        });

        if (user) {
            subscription.user = user;
        }

        await db.getRepository(Subscription).save(subscription);

        return {
            message: `Thank you for subscribing!`,
            email,
        };
    });
