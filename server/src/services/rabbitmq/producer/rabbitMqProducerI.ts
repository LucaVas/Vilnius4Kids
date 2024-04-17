export interface RabbitMqProducerI {
    push(msg: string): Promise<boolean>;
}
