import logger from '@server/logger';
import { Channel, Message } from 'amqplib';
import { ChannelFactory } from '../channelFactory';
import type { QueueProperties } from '../rabbitMqProperties';
import { RabbitMqConsumerI } from './rabbitMqConsumerI';

const handleIncomingNotification = (msg: string) => {
    try {
        const parsedMessage = JSON.parse(msg);
        logger.info(`Received Notification`, parsedMessage);
        // TODO: do something
    } catch (error) {
        logger.error(`Error While Parsing the message`);
    }
};

export class RabbitMqConsumer implements RabbitMqConsumerI {
    private properties: QueueProperties;

    private queueName: string;

    private channel: Channel;

    private channelFactory: ChannelFactory;

    constructor(properties: QueueProperties, channelFactory: ChannelFactory) {
        this.properties = properties;
        this.channelFactory = channelFactory;
    }

    async poll() {
        // makes sure the queue is declared before attempting to consume from it
        if (!this.channel) {
            await this.getChannel();
        }

        this.channel.assertQueue(this.queueName, {
            durable: true,
        });

        this.channel.prefetch(1); // make sure only one task is processed at a time
        this.channel.consume(
            this.queueName,
            (msg) => {
                if (msg) {
                    handleIncomingNotification(msg?.content?.toString());
                    this.channel.ack(msg);
                } else {
                    logger.error(`Invalid incoming message`);
                }
            },
            {
                noAck: false,
            }
        );
    }

    async restartChannel(): Promise<void> {
        (await this.getChannel()).on('close', () => {
            logger.info(`Restarting channel for consumer ${this}`);
            this.closeChannel(); // ensure channel is actually closed
            this.poll();
        });
    }

    async getChannel(): Promise<Channel> {
        if (!this.channel) {
            try {
                this.channel = await this.channelFactory.provideChannel(
                    this.queueName
                );
            } catch (e) {
                logger.error(
                    `Error while creating new channel for queue ${this.queueName}: ${e}`
                );
            }
        }
        return this.channel;
    }

    closeChannel(): void {
        try {
            if (this.channel) this.channel.close();
        } catch (e) {
            logger.warn(
                `Error while closing channel for queue ${this.queueName}: ${e}`
            );
        }
    }

    acknowledge(msg: Message): void {
        try {
            this.channel.ack(msg);
        } catch (e) {
            logger.error(
                `Error while acknowledging message: Content: ${msg.content}; Error: ${e}`
            );
        }
    }
}
