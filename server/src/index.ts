import buildSubscriptionService from '@server/services/subscription';
import buildEmailService from '@server/services/email';
import buildReportService from '@server/services/report';
import buildPasswordResetService from '@server/services/passwordReset';
import createApp from './app';
import { createDatabase } from './database';
import config from './config';
import logger from './logger';
import { MqConsumerFactory } from './services/rabbitmq/consumer/consumerFactory';

const consumerFactory = new MqConsumerFactory();

const database = createDatabase(config.database as any);
const emailService = buildEmailService();

// subscription
const subscriptionService = buildSubscriptionService(emailService, database);
const subscriptionConsumer =
    consumerFactory.getSubscriptionsConsumer(subscriptionService);

// report
const reportService = buildReportService(emailService, database);
const reportConsumer = consumerFactory.getReportsConsumer(reportService);

// password reset
const passwordResetService = buildPasswordResetService(emailService, database);
const passwordResetConsumer =
    consumerFactory.getPasswordResetConsumer(passwordResetService);

database.initialize().then(() => {
    const app = createApp(database);

    subscriptionConsumer.poll();
    reportConsumer.poll();
    passwordResetConsumer.poll();

    app.listen(config.port, () => {
        // eslint-disable-next-line no-console
        logger.info(`Server is running at http://localhost:${config.port}`);
    });
});
