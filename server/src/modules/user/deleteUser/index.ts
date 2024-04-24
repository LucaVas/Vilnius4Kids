import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import logger from '@server/logger';
import { MqProducerFactory } from '@server/services/rabbitmq/producer/producerFactory';
import { userDeleteSchema } from '@server/entities/user/schema';

const producerFactory = new MqProducerFactory();
export const userDeletionProducer = producerFactory.getUserDeletionProducer();

export default authenticatedProcedure
    .input(userDeleteSchema)
    .mutation(async ({ input: { id }, ctx: { db, authUser } }) => {
        const user = await db.getRepository(User).findOneBy({ id });
        if (!user) {
            logger.error(`User with ID [${authUser.id}] does not exist.`);
            throw new TRPCError({
                message: `Error while deleting user.`,
                code: 'NOT_FOUND',
            });
        }

        try {
            await userDeletionProducer.push({
                command: 'deleteUser',
                content: {
                    user,
                },
                timestamp: new Date(),
            });
        } catch (e) {
            logger.error(`Error while sending user deletion to RabbitMQ: ${e}`);
            throw new TRPCError({
                message: `Error while deleting user. Please try again later.`,
                code: 'INTERNAL_SERVER_ERROR',
            });
        }

        return {
            message:
                'We received your request, and we will delete the user as soon as possible.',
        };
    });
