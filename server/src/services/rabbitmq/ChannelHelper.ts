import logger from '@server/logger';
import { Channel } from 'amqplib';
import { ConnectionFactory } from './ConnectionFactory';

export class ChannelHelper {
    private ConnectionFactory: ConnectionFactory;

    private retryDelays: number;

    private maxRetries: number;

    async provideChannel(queueName: string | undefined): Promise<Channel> {
        if (!queueName) throw new Error('Queue name cannot be empty.');

        let channel: Channel;

        const retries = 0;
        while (retries < this.maxRetries) {
            try {
                channel =
                    (await this.ConnectionFactory.getConnection().createChannel()) as Channel;
                return channel;
            } catch (e) {
                logger.error(`Error while getting a channel. Retrying... ${e}`);
            }

            try {
                setTimeout(() => {}, this.retryDelays);
            } catch (e) {
                logger.error(`Error while waiting for retry: ${e}`);
            }

            this.maxRetries += 1;
        }

        throw new Error(
            `Failed to get a channel for queue ${queueName}: Max number of attempts reached`
        );
    }
}
