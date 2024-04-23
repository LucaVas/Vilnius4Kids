import { DataSource, QueryFailedError } from 'typeorm';
import logger from '@server/logger';
import { User } from '@server/entities';
import {
    MailService,
    RabbitMqService,
    ActionMessage,
    UserDeletionContent,
} from '../types';
import { s3bucket, s3client } from '../s3';

export default (
    mailService: MailService,
    database: DataSource
): RabbitMqService => ({
    async processCommand(msg: ActionMessage) {
        logger.info(`Processing message: ${msg.command}`);
        switch (msg.command) {
            case 'deleteUser':
                await deleteUser(
                    mailService,
                    database,
                    msg.content as UserDeletionContent
                );
                break;
            default:
                logger.error(`Unknown command: ${msg.command}`);
                throw new Error(
                    `User deletion service does not support command: ${msg.command}`
                );
        }
    },
});

async function deleteUser(
    mailService: MailService,
    database: DataSource,
    content: UserDeletionContent
) {
    try {
        // get images from database
        const user = await database
            .getRepository(User)
            .findOne({
                where: { id: content.user.id },
                relations: ['reports'],
            });

        if (user && user.reports.length > 0) {
            // delete images from s3 bucket
            user.reports.forEach((report) =>
                report.images.forEach(async (image) => {
                    logger.debug(`Starting deleting process for image with key ${image.key}`)
                    const params = {
                        Bucket: s3bucket,
                        Key: image.key,
                    };
                    try {
                        // check if image exists
                        await s3client.headObject(params).promise();
                        logger.debug(`File with key ${image.key} found in S3`);
                        try {
                            // delete image
                            await s3client.deleteObject(params).promise();
                            logger.debug(
                                `File with key ${image.key} deleted Successfully`
                            );
                        } catch (err) {
                            logger.error(
                                `Error while deleting image with key ${image.key}: ${err}`
                            );
                        }
                    } catch (err) {
                        logger.warn('Image not found in bucket.');
                    }
                })
            );
        }

        // delete user from database
        await database.getRepository(User).delete({ id: content.user.id });

        // send email confirmation
        await mailService.sendUserDeletionEmail(
            content.user.email,
            content.user.username
        );
    } catch (e) {
        if (e instanceof QueryFailedError) {
            logger.error(`Error while deleting user from database: ${e}`);
            return;
        }

        if (e instanceof Error) {
            if (e.message.includes('Error while sending email'))
                logger.error(`Error while sending user deletion email: ${e}`);
            else logger.error(`Error while deleting user: ${e}`);
        }
    }
}
