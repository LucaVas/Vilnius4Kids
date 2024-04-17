import { Message } from 'amqplib';

export interface RabbitMqConsumerI {
    poll(): void;
    acknowledge(msg: Message): void;
}
