import logger from '@server/logger';
import { Connection } from 'amqplib';

export class ConnectionFactory {
    private retryDelays: number;

    private client: any;

    private host: string;

    private maxRetries: number;

    constructor(retryDelays: number, maxRetries: number, client: any) {
        this.retryDelays = Math.abs(retryDelays); // avoid negative argument
        this.maxRetries = Math.abs(maxRetries); // avoid negative argument
        this.client = client;
    }

    newConnection(host: string): Promise<Connection> {
        return this.client.connect(host);
    }

    async getConnection(retries = 0): Promise<Connection> {
        try {
            logger.info(`Attempting to get a connection to host ${this.host}`);
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
