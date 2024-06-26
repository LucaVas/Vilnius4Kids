import crypto from 'crypto';
import {
    ActionMessage,
    MailService,
    PasswordResetContent,
} from '@server/services/types';
import logger from '@server/logger';
import { PasswordChangeRequest } from '@server/entities';
import { DataSource, QueryFailedError } from 'typeorm';
import bcrypt from 'bcrypt';
import { RabbitMqService } from '../types';

export default (
    mailService: MailService,
    database: DataSource
): RabbitMqService => ({
    async processCommand(msg: ActionMessage) {
        logger.info(`Processing message: ${msg.command}`);
        switch (msg.command) {
            case 'resetPassword':
                await resetPassword(
                    mailService,
                    database,
                    msg.content as PasswordResetContent
                );
                break;
            default:
                logger.error(`Unknown command: ${msg.command}`);
                throw new Error(
                    `Report service does not support command: ${msg.command}`
                );
        }
    },
});

async function resetPassword(
    mailService: MailService,
    database: DataSource,
    content: PasswordResetContent
) {
    try {
        if (content.user.passwordChangeRequest) {
            await database
                .createQueryBuilder()
                .delete()
                .from(PasswordChangeRequest)
                .where('id = :id', {
                    id: content.user.passwordChangeRequest.id,
                })
                .execute();
        }

        const token = crypto.randomBytes(32).toString('hex');
        await database.getRepository(PasswordChangeRequest).save({
            user: content.user,
            passwordResetToken: await bcrypt.hash(token, 10),
        });

        await mailService.sendPasswordResetToken(
            token,
            content.user.email,
            content.user.username
        );
    } catch (e) {
        if (e instanceof QueryFailedError) {
            logger.error(
                `Error while executing resetting password transactions in database: ${e}`
            );
            return;
        }

        if (e instanceof Error) {
            if (e.message.includes('Error while sending email'))
                logger.error(
                    `Error while sending password reset token email: ${e}`
                );
            else logger.error(`Error while resetting password: ${e}`);
        }
    }
}
