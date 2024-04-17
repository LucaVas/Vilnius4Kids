
import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import logger from '@server/logger';
import { sendResetLinkSchema } from '@server/entities/password_change_requests/schema';
import { publicProcedure } from '@server/trpc';
import { MqProducerFactory } from '@server/services/rabbitmq/producer/producerFactory';

const producerFactory = new MqProducerFactory();
export const passwordResetProducer = producerFactory.getPasswordResetProducer();

export default publicProcedure
    .input(sendResetLinkSchema)
    .mutation(async ({ input: { email }, ctx: { db } }) => {
        const user = await db.getRepository(User).findOne({
            where: { email },
            relations: {
                passwordChangeRequest: true,
            },
        });

        if (!user) {
            logger.error(`User with email [${email}] does not exist.`);
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Error while resetting user password.',
            });
        }

        try {
            passwordResetProducer.push({
                command: 'resetPassword',
                content: {
                    user,
                },
                timestamp: new Date(),
            });
        } catch (error) {
            logger.error(`Error while sending password reset token: ${error}`);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error while sending password reset token.',
            });
        }

        return {
            message:
                'Thank you! We will send an email with a password reset link to your inbox.',
        };
    });
