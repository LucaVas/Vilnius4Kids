import {
    Playground,
    ReportCategory,
    User,
} from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import logger from '@server/logger';
import { MqProducerFactory } from '@server/services/rabbitmq/producer/producerFactory';
import { reportInsertSchema } from '../../../entities/report/schema';

const producerFactory = new MqProducerFactory();
export const reportProducer = producerFactory.getReportsProducer();

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

            try {
                await reportProducer.push({
                    command: 'registerReport',
                    content: {
                        description,
                        playground,
                        category: reportCategory,
                        user,
                    },
                    timestamp: new Date(),
                });
            } catch (e) {
                logger.error(`Error while sending report to RabbitMQ: ${e}`);
                throw new TRPCError({
                    message: `Error while submitting report. Please try again later.`,
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }

            return {
                message: 'Thank you for submitting your report!',
            };
        }
    );
