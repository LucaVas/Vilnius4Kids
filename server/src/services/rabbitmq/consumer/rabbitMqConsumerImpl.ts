import logger from '@server/logger';
import { Channel, Message } from 'amqplib';
import { RabbitMqService } from '@server/services/types';
import type { ActionMessage } from '@server/services/types';
import { ChannelFactory } from '../factories/channelFactory';
import type { QueueProperties } from '../rabbitMqProperties';
import { RabbitMqConsumerI } from './rabbitMqConsumerI';

const handleIncomingMessage = (msg: string): ActionMessage => {
    try {
        const parsedMessage = JSON.parse(msg) as ActionMessage;
        logger.info(`Received new message: ${msg}`);
        return parsedMessage;
    } catch (error) {
        logger.error(
            `Error while parsing action message: ${msg}; Error: ${error}`
        );
        throw new Error(`Error while parsing action message`);
    }
};

export class RabbitMqConsumer implements RabbitMqConsumerI {
    private properties: QueueProperties;

    private queueName: string;

    private channel: Channel;

    private channelFactory: ChannelFactory;

    private service: RabbitMqService;

    constructor(
        properties: QueueProperties,
        channelFactory: ChannelFactory,
        service: RabbitMqService
    ) {
        this.properties = properties;
        this.queueName = properties.queueName;
        this.channelFactory = channelFactory;
        this.service = service;
    }

    async poll(): Promise<void> {
        logger.info(
            `Consumer for ${this.properties.name} starting to poll queue ${this.queueName}`
        );
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
                    const parsedMessage = handleIncomingMessage(
                        msg.content.toString()
                    );
                    this.service.processCommand(parsedMessage);
                    this.channel.ack(msg);
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
