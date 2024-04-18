import { RabbitMqService } from '@server/services/types';
import { ChannelFactory } from '../channelFactory';
import { MqProperties } from '../rabbitMqProperties';
import { RabbitMqConsumer } from './rabbitMqConsumerImpl';
import { RabbitMqConsumerI } from './rabbitMqConsumerI';

export class MqConsumerFactory {
    private mqProperties = new MqProperties();

    getSubscriptionsConsumer(
        subscriptionService: RabbitMqService
    ): RabbitMqConsumerI {
        return new RabbitMqConsumer(
            this.mqProperties.getSubscriptionQueueProperties(),
            new ChannelFactory(),
            subscriptionService
        );
    }

    getReportsConsumer(reportsService: RabbitMqService): RabbitMqConsumerI {
        return new RabbitMqConsumer(
            this.mqProperties.getReportsQueueProperties(),
            new ChannelFactory(),
            reportsService
        );
    }

    getPasswordResetConsumer(
        passwordResetService: RabbitMqService
    ): RabbitMqConsumerI {
        return new RabbitMqConsumer(
            this.mqProperties.getPasswordResetQueueProperties(),
            new ChannelFactory(),
            passwordResetService
        );
    }

    getAccountVerificationConsumer(
        accountVerificationService: RabbitMqService
    ): RabbitMqConsumerI {
        return new RabbitMqConsumer(
            this.mqProperties.getAccountVerificationQueueProperties(),
            new ChannelFactory(),
            accountVerificationService
        );
    }
}
