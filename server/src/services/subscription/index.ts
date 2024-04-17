import {
    ActionMessage,
    MailService,
    SubscriptionContent,
} from '@server/services/types';
import logger from '@server/logger';
import { Subscription } from '@server/entities';
import { DataSource } from 'typeorm';
import { RabbitMqService } from '../types';

export default (
    mailService: MailService,
    database: DataSource
): RabbitMqService => ({
    async processCommand(msg: ActionMessage) {
        logger.info(`Processing message: ${msg.command}`);
        switch (msg.command) {
            case 'registerSubscription':
                await subscribeUser(mailService, database, msg.content);
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
    // save subscription
    const subscription = database.getRepository(Subscription).create({
        email: content.email,
        isUser: false,
        isContacted: false,
    });

    try {
        await mailService.sendSubscriptionEmail(content.email);
    } catch (error) {
        logger.error(`Error while sending subscription email: ${error}`);
    }

    subscription.isContacted = true;
    await database.getRepository(Subscription).save(subscription);
}
