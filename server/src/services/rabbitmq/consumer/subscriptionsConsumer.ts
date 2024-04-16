import logger from '@server/logger';
import { Channel, Message } from 'amqplib';
import { ChannelHelper } from '../ChannelHelper';

export class SubscriptionsConsumer {
    private queueName: string;

    private channel: Channel;

    private channelHelper: ChannelHelper;

    constructor(queueName: string, channelHelper: any) {
        this.queueName = queueName;
        this.channelHelper = channelHelper;
    }

    async consume(): Promise<void> {
        (await this.getChannel()).consume(
            this.queueName,
            (err, callback) => {}
        );
    }

    restartChannel(): void {
        if (this.channel.connection === 'closed') {
            logger.info(`Restarting channel for consumer ${this}`);
            this.closeChannel(); // ensure channel is actually closed
            this.consume();
        }
    }

    async getChannel(): Promise<Channel> {
        if (!this.channel) {
            try {
                this.channel = await this.channelHelper.provideChannel(
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

    akcnowledge(msg: Message): void {
        // TODO: acknowledge message
        try {
            this.channel.ack(msg);
        } catch (e) {
            logger.error(
                `Error while acknowledging message: Content: ${msg.content}; Error: ${e}`
            );
        }
    }

    shutdown(): void {
        logger.info('Shutting down consumer');
        this.channelHelper.shutdown();
        // do not close channel, as consumer can be still called by rabbitmq
    }
}
