import { ChannelFactory } from '../channelFactory';
import { MqProperties } from '../RabbitMqProperties';
import { RabbitMqConsumer } from './rabbitMqConsumerImpl';
import { RabbitMqConsumerI } from './rabbitMqConsumerI';

export class MqConsumerFactory {
    private mqProperties = new MqProperties();

    getSubscriptionsConsumer(): RabbitMqConsumerI {
        return new RabbitMqConsumer(
            this.mqProperties.getSubscriptionQueueProperties(),
            new ChannelFactory()
        );
    }

    getReportsConsumer(): RabbitMqConsumerI {
        return new RabbitMqConsumer(
            this.mqProperties.getReportsQueueProperties(),
            new ChannelFactory()
        );
    }

    getResetPasswordConsumer(): RabbitMqConsumerI {
        return new RabbitMqConsumer(
            this.mqProperties.getResetPasswordQueueProperties(),
            new ChannelFactory()
        );
    }
}
