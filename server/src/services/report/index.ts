import {
    ActionMessage,
    MailService,
    ReportContent,
    UpdateReportContent,
} from '@server/services/types';
import logger from '@server/logger';
import { Report, ReportStatusChangeLog } from '@server/entities';
import { DataSource } from 'typeorm';
import { ReportStatus } from '@server/entities/report/ReportStatus';
import { RabbitMqService } from '../types';

export default (
    mailService: MailService,
    database: DataSource
): RabbitMqService => ({
    async processCommand(msg: ActionMessage) {
        logger.info(`Processing message: ${msg.command}`);
        switch (msg.command) {
            case 'registerReport':
                await registerReport(
                    mailService,
                    database,
                    msg.content as ReportContent
                );
                break;
            case 'updateReport':
                await updateReport(
                    mailService,
                    database,
                    msg.content as UpdateReportContent
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

async function updateReport(
    mailService: MailService,
    database: DataSource,
    content: UpdateReportContent
) {
    const { affected, raw } = await database
        .getRepository(Report)
        .createQueryBuilder()
        .update()
        .set({ description: content.description, status: content.status })
        .where('id = :id', { id: content.report.id })
        .returning('*')
        .execute();

    if (affected === 0) {
        logger.error(`No reports were updated.`);
        return;
    }

    await database.getRepository(ReportStatusChangeLog).insert({
        report: raw[0],
        playground: raw[0].playground,
        status: content.status,
        changeStatusMessage: content.description,
    });

    try {
        await mailService.sendReport(
            raw[0].id,
            content.user.email,
            content.user.username
        );
    } catch (error) {
        logger.error(`Error while sending update report email: ${error}`);
    }
}

async function registerReport(
    mailService: MailService,
    database: DataSource,
    content: ReportContent
) {
    const newReport = await database.getRepository(Report).save({
        description: content.description,
        playground: content.playground,
        category: content.category,
        user: content.user,
    });

    await database.getRepository(ReportStatusChangeLog).insert({
        report: newReport,
        playground: content.playground,
        status: ReportStatus.OPEN,
        changeStatusMessage: content.description,
    });

    try {
        await mailService.sendReport(
            newReport.id,
            content.user.email,
            content.user.username
        );
    } catch (error) {
        logger.error(`Error while sending report email: ${error}`);
    }
}
