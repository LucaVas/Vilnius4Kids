import { publicProcedure } from '@server/trpc';
import { Subscription, User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { subscriptionInsertSchema } from '@server/entities/subscription/schema';
import logger from '@server/logger';
import { MqProducerFactory } from '@server/services/rabbitmq/producer/producerFactory';

const producerFactory = new MqProducerFactory();
export const subscriptionsProducer = producerFactory.getSubscriptionsProducer();

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

        if (previousSubscription || user) {
            logger.error(`User is already subscribed with email ${email}`);
            throw new TRPCError({
                message: `User already subscribed.`,
                code: 'BAD_REQUEST',
            });
        }

        try {
            subscriptionsProducer.push({
                command: 'registerSubscription',
                content: {
                    email,
                },
                timestamp: new Date(),
            });
        } catch (e) {
            logger.error(
                `Error while sending email subscription to RabbitMQ: ${e}`
            );
            throw new TRPCError({
                message: `Error while subscribing. Please try again later.`,
                code: 'INTERNAL_SERVER_ERROR',
            });
        }

        return {
            message: `Thank you for subscribing!`,
            email,
        };
    });
