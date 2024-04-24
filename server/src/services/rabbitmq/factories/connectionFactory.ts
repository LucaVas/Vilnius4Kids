import logger from '@server/logger';
import client, { type Connection } from 'amqplib';
import { MqProperties } from '../rabbitMqProperties';

export class ConnectionFactory {
    private retryDelays: number;

    private client: typeof client;

    private host: string;

    private maxRetries: number;

    constructor() {
        const properties = new MqProperties();
        this.client = client;
        this.retryDelays = properties.getConnectionRetryPolicy().retryDelays;
        this.maxRetries = properties.getConnectionRetryPolicy().maxRetries;
        this.host = properties.getHost();
    }

    newConnection(host: string): Promise<Connection> {
        return this.client.connect(host);
    }

    async getConnection(retries = 0): Promise<Connection> {
        try {
            logger.info(
                `Attempting to get a connection to RabbitMQ host..`
            );
            return await this.newConnection(this.host);
        } catch (e) {
            logger.error(`Error while connecting to RabbitMQ server: ${e}`);
            if (retries < this.maxRetries) {
                logger.info(
                    `Retrying to connect in ${
                        this.retryDelays
                    }... Attempts left: ${this.maxRetries - retries}`
                );
                setTimeout(() => {}, this.retryDelays);

                return this.getConnection(retries + 1);
            }
            throw new Error(
                `Failed to get a connection: Max number of attempts reached`
            );
        }
    }
}
