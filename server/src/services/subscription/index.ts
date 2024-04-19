import {
    ActionMessage,
    MailService,
    SubscriptionContent,
} from '@server/services/types';
import logger from '@server/logger';
import { Subscription } from '@server/entities';
import { DataSource, QueryFailedError } from 'typeorm';
import { RabbitMqService } from '../types';

export default (
    mailService: MailService,
    database: DataSource
): RabbitMqService => ({
    async processCommand(msg: ActionMessage) {
        logger.info(`Processing message: ${msg.command}`);
        switch (msg.command) {
            case 'registerSubscription':
                await subscribeUser(
                    mailService,
                    database,
                    msg.content as SubscriptionContent
                );
                break;
            default:
                logger.error(`Unknown command: ${msg.command}`);
                throw new Error(
                    `Subscription service does not support command: ${msg.command}`
                );
        }
    },
});

async function subscribeUser(
    mailService: MailService,
    database: DataSource,
    content: SubscriptionContent
) {
    try {
        // save subscription
        const subscription = database.getRepository(Subscription).create({
            email: content.email,
            isUser: false,
            isContacted: false,
        });
        await mailService.sendSubscriptionEmail(content.email);

        subscription.isContacted = true;
        await database.getRepository(Subscription).save(subscription);
    } catch (e) {
        if (e instanceof QueryFailedError) {
            logger.error(`Error while saving subscription in database: ${e}`);
            return;
        }

        if (e instanceof Error) {
            if (e.message.includes('Error while sending email'))
                logger.error(`Error while sending subscription email: ${e}`);
            else logger.error(`Error during subscription: ${e}`);
        }
    }
}
