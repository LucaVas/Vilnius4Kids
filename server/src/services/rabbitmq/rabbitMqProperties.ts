import config from '@server/config';

const { env } = config;

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
        if (env === 'test') return `amqp://${this.host}`;
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
        const queue = this.queues.find((q) => q.name === 'subscriptions');
        if (!queue) throw new Error('Subscription queue not found');
        return queue;
    }

    getReportsQueueProperties(): QueueProperties {
        const queue = this.queues.find((q) => q.name === 'reports');
        if (!queue) throw new Error('Reports queue not found');
        return queue;
    }

    getPasswordResetQueueProperties(): QueueProperties {
        const queue = this.queues.find((q) => q.name === 'password-resets');
        if (!queue) throw new Error('Password reset queue not found');
        return queue;
    }

    getAccountVerificationQueueProperties(): QueueProperties {
        const queue = this.queues.find(
            (q) => q.name === 'account-verifications'
        );
        if (!queue) throw new Error('Account verification queue not found');
        return queue;
    }

    getUserDeletionQueueProperties(): QueueProperties {
        const queue = this.queues.find((q) => q.name === 'user-deletions');
        if (!queue) throw new Error('User deletion queue not found');
        return queue;
    }
}
