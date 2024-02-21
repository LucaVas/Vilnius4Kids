import { TRPCError } from '@trpc/server';
import { Report, ReportStatusChangeLog, User } from '@server/entities';
import mailSender from '@server/modules/emailService';
import { adminProcedure } from '@server/trpc/adminProcedure';
import logger from '@server/logger';
import { reportUpdateSchema } from '../../../entities/report/schema';

export default adminProcedure
    .input(reportUpdateSchema)
    .mutation(
        async ({
            input: { id, description, status },
            ctx: { db, authUser },
        }) => {
            const [{ affected, raw }, user] = await Promise.all([
                db
                    .getRepository(Report)
                    .createQueryBuilder()
                    .update()
                    .set({ description, status })
                    .where('id = :id', { id })
                    .returning('*')
                    .execute(),
                db.getRepository(User).findOneBy({ id: authUser.id }),
            ]);

            if (!user) {
                logger.error(`User with ID [${authUser.id}] does not exist.`);
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `Error while updating report.`,
                });
            }

            if (affected === 0) {
                logger.error(`Report with ID [${id}] does not exist.`);
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `Error while updating report.`,
                });
            }

            await db.getRepository(ReportStatusChangeLog).insert({
                report: raw[0],
                playground: raw[0].playground,
                status,
                changeStatusMessage: description,
            });

            const sender = mailSender(user.username, user.email);
            sender.sendReport(raw[0].id);

            return {
                message: `Report updated successfully.`,
                report: raw[0],
            };
        }
    );
