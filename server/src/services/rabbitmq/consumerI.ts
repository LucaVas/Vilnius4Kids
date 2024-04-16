export interface Consumer {
    poll(): void;
    getQueueName(): void;
}
