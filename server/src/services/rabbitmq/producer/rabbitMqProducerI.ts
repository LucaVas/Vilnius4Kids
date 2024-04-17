import { ActionMessage } from '@server/services/types';

export interface RabbitMqProducerI {
    push(msg: ActionMessage): Promise<boolean>;
}
