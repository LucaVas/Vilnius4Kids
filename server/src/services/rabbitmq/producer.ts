import client, { Connection, Channel } from 'amqplib';
import logger from '@server/logger';
import config from '@server/config';
import { QueueOptions } from './types';

const { user, password, host, queues } = config.rabbitMq;

class RabbitMQConnection {
    connection: Connection;

    channel: Channel;

    private connected: Boolean;

    async connect() {
        if (this.connected && this.channel) return;
        this.connected = true;

        try {
            logger.info(`Connecting to Rabbit-MQ Server`);
            this.connection = await client.connect(
                `amqps://${user}:${password}@${host}/${user}`
            );

            logger.info(`✅ Rabbit MQ Connection is ready`);

            this.channel = await this.connection.createChannel();

            logger.info(`Created RabbitMQ Channel successfully`);
        } catch (error) {
            logger.error(`Not connected to MQ Server. Error: ${error}`);
            throw error;
        }
    }

    async sendToSubscriptionsQueue(message: any) {
        const queue = queues.find((q) => q.name === 'subscriptions');
        if (!queue) throw new Error('Subscriptions queue not found');

        await this.sendToQueue(queue.queueName, queue.options, message);
    }

    async sendToPasswordResetsQueue(message: any) {
        const queue = queues.find((q) => q.name === 'password-resets');
        if (!queue) throw new Error('Password resets queue not found');

        await this.sendToQueue(queue.queueName, queue.options, message);
    }

    async sendToReportsQueue(message: any) {
        const queue = queues.find((q) => q.name === 'reports');
        if (!queue) throw new Error('Reports queue not found');

        await this.sendToQueue(queue.queueName, queue.options, message);
    }

    private async sendToQueue(
        queue: string,
        options: QueueOptions,
        message: any
    ) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            await this.channel.assertQueue(queue, {
                durable: options.durable,
            });

            this.channel.sendToQueue(
                queue,
                Buffer.from(JSON.stringify(message))
            );
        } catch (error) {
            logger.error(
                `Error while sending message to queue ${queue}: ${error}`
            );
            throw error;
        }
    }
}

export default new RabbitMQConnection();
