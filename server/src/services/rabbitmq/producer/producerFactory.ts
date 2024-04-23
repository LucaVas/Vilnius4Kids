import { ChannelFactory } from '../factories/channelFactory';
import { MqProperties } from '../rabbitMqProperties';
import { RabbitMqProducer } from './rabbitMqProducerImpl';
import type { RabbitMqProducerI } from './rabbitMqProducerI';

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

    getPasswordResetProducer(): RabbitMqProducerI {
        return new RabbitMqProducer(
            this.mqProperties.getPasswordResetQueueProperties(),
            new ChannelFactory()
        );
    }

    getAccountVerificationProducer(): RabbitMqProducerI {
        return new RabbitMqProducer(
            this.mqProperties.getAccountVerificationQueueProperties(),
            new ChannelFactory()
        );
    }

    getUserDeletionProducer(): RabbitMqProducerI {
        return new RabbitMqProducer(
            this.mqProperties.getUserDeletionQueueProperties(),
            new ChannelFactory()
        );
    }
}
