import logger from '@server/logger';
import { Channel } from 'amqplib';
import { ChannelFactory } from '../channelFactory';
import type { QueueProperties } from '../rabbitMqProperties';
import { RabbitMqProducerI } from './rabbitMqProducerI';

export class RabbitMqProducer implements RabbitMqProducerI {
    private queueName: string;

    private persistent: boolean;

    private channel: Channel;

    private channelFactory: ChannelFactory;

    constructor(properties: QueueProperties, channelFactory: ChannelFactory) {
        this.queueName = properties.queueName;
        this.persistent = properties.options.persistent;
        this.channelFactory = channelFactory;
    }

    async push(msg: string): Promise<boolean> {
        try {
            // makes sure the queue is declared before attempting to produce from it
            if (!this.channel) {
                await this.getChannel();
            }

            this.channel.assertQueue(this.queueName, {
                durable: true,
            });

            return this.channel.sendToQueue(
                this.queueName,
                Buffer.from(JSON.stringify(msg)),
                {
                    persistent: this.persistent,
                }
            );
        } catch (e) {
            logger.error(
                `Error while sending message to queue ${this.queueName}: ${e}`
            );
            throw e;
        }
    }

    async restartChannel(): Promise<void> {
        (await this.getChannel()).on('close', () => {
            logger.info(`Restarting channel for producer ${this}`);
            this.closeChannel(); // ensure channel is actually closed
            this.getChannel();
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
}
