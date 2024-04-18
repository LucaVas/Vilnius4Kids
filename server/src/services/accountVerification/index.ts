import crypto from 'crypto';
import {
    AccountVerificationContent,
    ActionMessage,
    MailService,
} from '@server/services/types';
import logger from '@server/logger';
import { VerificationToken } from '@server/entities';
import { DataSource } from 'typeorm';
import bcrypt from 'bcrypt';
import { Role } from '@server/entities/user/Role';
import { RabbitMqService } from '../types';

export default (
    mailService: MailService,
    database: DataSource
): RabbitMqService => ({
    async processCommand(msg: ActionMessage) {
        logger.info(`Processing message: ${msg.command}`);
        switch (msg.command) {
            case 'verifyAccount':
                await verifyAccount(
                    mailService,
                    database,
                    msg.content as AccountVerificationContent
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

async function verifyAccount(
    mailService: MailService,
    database: DataSource,
    content: AccountVerificationContent
) {
    const token = crypto.randomBytes(32).toString('hex');

    if (content.user.role === Role.USER) {
        await database.getRepository(VerificationToken).save({
            user: content.user,
            token: await bcrypt.hash(token, 10),
        });

        try {
            await mailService.sendVerificationToken(
                token,
                content.user.email,
                content.user.username
            );
        } catch (error) {
            logger.error(
                `Error while sending account verification token email: ${error}`
            );
        }
    }
}
