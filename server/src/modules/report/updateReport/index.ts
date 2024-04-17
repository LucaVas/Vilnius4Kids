import { TRPCError } from '@trpc/server';
import { Report, User } from '@server/entities';
import { adminProcedure } from '@server/trpc/adminProcedure';
import logger from '@server/logger';
import { reportUpdateSchema } from '../../../entities/report/schema';
import { reportProducer } from '../report';

export default adminProcedure
    .input(reportUpdateSchema)
    .mutation(
        async ({
            input: { id, description, status },
            ctx: { db, authUser },
        }) => {
            const [user, report] = await Promise.all([
                db.getRepository(User).findOneBy({ id: authUser.id }),
                db.getRepository(Report).findOneBy({ id }),
            ]);
            if (!user) {
                logger.error(`User with ID [${authUser.id}] does not exist.`);
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `Error while updating report.`,
                });
            }
            if (!report) {
                logger.error(`Report with ID [${id}] does not exist.`);
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `Error while updating report.`,
                });
            }

            try {
                reportProducer.push({
                    command: 'updateReport',
                    content: {
                        description,
                        status,
                        report,
                        user,
                    },
                    timestamp: new Date(),
                });
            } catch (e) {
                logger.error(
                    `Error while sending update report command to RabbitMQ: ${e}`
                );
                throw new TRPCError({
                    message: `Error while updating report. Please try again later.`,
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }

            return {
                message: `Thank you for updating this report!`,
            };
        }
    );
