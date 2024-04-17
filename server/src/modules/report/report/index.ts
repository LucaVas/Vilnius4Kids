import {
    Playground,
    Report,
    ReportCategory,
    ReportStatusChangeLog,
    User,
} from '@server/entities';
import { TRPCError } from '@trpc/server';
import { ReportStatus } from '@server/entities/report/ReportStatus';
import mailSender from '@server/services/email';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import logger from '@server/logger';
import { reportInsertSchema } from '../../../entities/report/schema';

export default authenticatedProcedure
    .input(reportInsertSchema)
    .mutation(
        async ({
            input: { playgroundId, reportCategoryId, description },
            ctx: { db, authUser },
        }) => {
            const [playground, reportCategory, user] = await Promise.all([
                db.getRepository(Playground).findOneBy({ id: playgroundId }),
                db
                    .getRepository(ReportCategory)
                    .findOneBy({ id: reportCategoryId }),
                db.getRepository(User).findOneBy({ id: authUser.id }),
            ]);

            if (!playground) {
                logger.error(
                    `Playground with ID [${playgroundId}] does not exist.`
                );
                throw new TRPCError({
                    message: `Error while creating report.`,
                    code: 'NOT_FOUND',
                });
            }
            if (!reportCategory) {
                logger.error(
                    `Report category with ID [${reportCategoryId}] does not exist.`
                );
                throw new TRPCError({
                    message: `Error while creating report.`,
                    code: 'NOT_FOUND',
                });
            }
            if (!user) {
                logger.error(`User with ID [${authUser.id}] does not exist.`);
                throw new TRPCError({
                    message: `Error while creating report.`,
                    code: 'NOT_FOUND',
                });
            }

            const newReport = await db.getRepository(Report).save({
                description,
                playground,
                category: reportCategory,
                user,
            });

            await db.getRepository(ReportStatusChangeLog).insert({
                report: newReport,
                playground,
                status: ReportStatus.OPEN,
                changeStatusMessage: description,
            });

            const sender = mailSender(user.username, user.email);
            try {
                await sender.sendReport(newReport.id);
                return {
                    newReport,
                    message: 'Report added successfully.',
                };
            } catch (error) {
                logger.error(`Error while sending report email: ${error}`);
                throw new TRPCError({
                    message: `Error while sending report email.`,
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        }
    );
