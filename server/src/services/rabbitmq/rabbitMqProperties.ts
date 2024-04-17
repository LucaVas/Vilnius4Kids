import config from '@server/config';

const {
    user,
    password,
    host,
    mqChannelRetryDelays,
    mqChannelMaxRetries,
    mqConnectionRetryDelays,
    mqConnectionMaxRetries,
    queues,
} = config.rabbitMq;

export type QueueProperties = {
    name: string;
    queueName: string;
    options: {
        durable: boolean;
        persistent: boolean;
    };
};
type Queues = QueueProperties[];

export class MqProperties {
    private user: string;

    private password: string;

    private host: string;

    private queues: Queues;

    private mqChannelRetryDelays: number;

    private mqChannelMaxRetries: number;

    private mqConnectionRetryDelays: number;

    private mqConnectionMaxRetries: number;

    constructor() {
        this.user = user;
        this.password = password;
        this.host = host;
        this.queues = queues;
        this.mqChannelRetryDelays = mqChannelRetryDelays;
        this.mqChannelMaxRetries = mqChannelMaxRetries;
        this.mqConnectionRetryDelays = mqConnectionRetryDelays;
        this.mqConnectionMaxRetries = mqConnectionMaxRetries;
    }

    getHost() {
        return `amqps://${this.user}:${this.password}@${this.host}/${this.user}`;
    }

    getChannelRetryPolicy() {
        return {
            retryDelays: this.mqChannelRetryDelays,
            maxRetries: this.mqChannelMaxRetries,
        };
    }

    getConnectionRetryPolicy() {
        return {
            retryDelays: this.mqConnectionRetryDelays,
            maxRetries: this.mqConnectionMaxRetries,
        };
    }

    getSubscriptionQueueProperties(): QueueProperties {
        const queue = this.queues.find((q) => q.name === 'subscription');
        if (!queue) throw new Error('Subscription queue not found');
        return queue;
    }

    getReportsQueueProperties(): QueueProperties {
        const queue = this.queues.find((q) => q.name === 'reports');
        if (!queue) throw new Error('Reports queue not found');
        return queue;
    }

    getResetPasswordQueueProperties(): QueueProperties {
        const queue = this.queues.find((q) => q.name === 'reset-password');
        if (!queue) throw new Error('Reset password queue not found');
        return queue;
    }
}
