import { ChannelFactory } from '../channelFactory';
import { MqProperties } from '../rabbitMqProperties';
import { RabbitMqProducer } from './rabbitMqProducerImpl';
import { RabbitMqProducerI } from './rabbitMqProducerI';

export class MqProducerFactory {
    private mqProperties = new MqProperties();

    getSubscriptionsProducer(): RabbitMqProducerI {
        return new RabbitMqProducer(
            this.mqProperties.getSubscriptionQueueProperties(),
            new ChannelFactory()
        );
    }

    getReportsProducer(): RabbitMqProducerI {
        return new RabbitMqProducer(
            this.mqProperties.getReportsQueueProperties(),
            new ChannelFactory()
        );
    }

    getResetPasswordProducer(): RabbitMqProducerI {
        return new RabbitMqProducer(
            this.mqProperties.getResetPasswordQueueProperties(),
            new ChannelFactory()
        );
    }
}