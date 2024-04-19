import logger from '@server/logger';
import { Channel } from 'amqplib';
import { ConnectionFactory } from '@server/services/rabbitmq/connectionFactory';
import { MqProperties } from './rabbitMqProperties';

export class ChannelFactory {
    private connectionFactory: ConnectionFactory;

    private retryDelays: number;

    private maxRetries: number;

    constructor() {
        const properties = new MqProperties();
        const connectionFactory = new ConnectionFactory();
        this.retryDelays = properties.getChannelRetryPolicy().retryDelays;
        this.maxRetries = properties.getChannelRetryPolicy().maxRetries;
        this.connectionFactory = connectionFactory;
    }

    async provideChannel(
        queueName: string | undefined,
        retries = 0
    ): Promise<Channel> {
        if (!queueName) throw new Error('Queue name cannot be empty.');

        try {
            const conn = await this.connectionFactory.getConnection();
            return await conn.createChannel();
        } catch (e) {
            logger.error(`Error while getting a channel. Retrying... ${e}`);
            if (retries < this.maxRetries) {
                logger.info(
                    `Retrying to connect in ${
                        this.retryDelays
                    }... Attempts left: ${this.maxRetries - retries}`
                );
                setTimeout(() => {}, this.retryDelays);

                return this.provideChannel(queueName, retries + 1);
            }
            throw new Error(
                `Failed to get a channel for queue ${queueName}: Max number of attempts reached`
            );
        }
    }
}
