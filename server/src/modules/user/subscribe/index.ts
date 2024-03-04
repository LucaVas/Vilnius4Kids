import { publicProcedure } from '@server/trpc';
import { Subscription, User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { subscriptionInsertSchema } from '@server/entities/subscription/schema';
import mailSender from '@server/modules/emailService';
import logger from '@server/logger';

export default publicProcedure
    .meta({ description: 'Endpoint dedicated for subscription.' })
    .input(subscriptionInsertSchema)
    .mutation(async ({ input: { email }, ctx: { db } }) => {
        const [previousSubscription, user] = await Promise.all([
            db.getRepository(Subscription).findOne({
                where: { email },
            }),
            db.getRepository(User).findOne({
                where: { email },
            }),
        ]);

        if (previousSubscription) {
            logger.error(`User is already subscribed with email ${email}`);
            throw new TRPCError({
                message: `User already subscribed.`,
                code: 'BAD_REQUEST',
            });
        }

        const sender = mailSender(null, email);
        try {
            await sender.sendSubscriptionEmail();
        } catch (error) {
            logger.error(`Error while sending subscription email: ${error}`);
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
