import client, { Connection, Channel } from 'amqplib';
import logger from '@server/logger';
import config from '@server/config';
import { QueueOptions } from './types';

const { user, password, host, queues } = config.rabbitMq;

const handleIncomingNotification = (msg: string) => {
    try {
        const parsedMessage = JSON.parse(msg);
        logger.info(`Received Notification`, parsedMessage);
        // TODO: do something
    } catch (error) {
        logger.error(`Error While Parsing the message`);
    }
};

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

    private async consume(queue: string, options: QueueOptions) {
        await this.channel.assertQueue(queue, {
            durable: options.durable,
        });

        this.channel.consume(
            queue,
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

    async consumeFromSubscriptionsQueue() {
        const queue = queues.find((q) => q.name === 'subscription');
        if (!queue) throw new Error('Subscription queue not found');

        await this.consume(queue.queueName, queue.options);
    }

    async consumeFromReportsQueue() {
        const queue = queues.find((q) => q.name === 'reports');
        if (!queue) throw new Error('Reports queue not found');

        await this.consume(queue.queueName, queue.options);
    }

    async consumeFromPasswordResetsQueue() {
        const queue = queues.find((q) => q.name === 'password-resets');
        if (!queue) throw new Error('Password resets queue not found');

        await this.consume(queue.queueName, queue.options);
    }
}

export default new RabbitMQConnection();
