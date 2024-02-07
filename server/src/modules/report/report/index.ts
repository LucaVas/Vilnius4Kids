import {
    Playground,
    Report,
    ReportCategory,
    ReportStatusChangeLog,
    User,
} from '@server/entities';
import { TRPCError } from '@trpc/server';
import { ReportStatus } from '@server/entities/report/ReportStatus';
import mailSender from '@server/modules/emailService';
import { verifiedProcedure } from '@server/trpc/verifiedProcedure';
import { reportInsertSchema } from '../../../entities/report/schema';

export default verifiedProcedure
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
                throw new TRPCError({
                    message: `Playground with ID [${playgroundId}] does not exist.`,
                    code: 'NOT_FOUND',
                });
            }
            if (!reportCategory) {
                throw new TRPCError({
                    message: `Report category with ID [${reportCategoryId}] does not exist.`,
                    code: 'NOT_FOUND',
                });
            }
            if (!user) {
                throw new TRPCError({
                    message: `User with ID [${authUser.id}] does not exist.`,
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
            sender.sendReport(newReport.id);

            return {
                newReport,
                message: 'Report added successfully.',
            };
        }
    );
