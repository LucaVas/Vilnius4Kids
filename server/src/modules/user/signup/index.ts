import { publicProcedure } from '@server/trpc';
import bcrypt from 'bcrypt';
import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import config from '@server/config';
import { Role } from '@server/entities/user/Role';
import logger from '@server/logger';
import { MqProducerFactory } from '@server/services/rabbitmq/producer/producerFactory';
import { signupSchema } from './schema';

const { passwordCost } = config.auth;
const producerFactory = new MqProducerFactory();
export const accountVerificationProducer =
    producerFactory.getAccountVerificationProducer();

export default publicProcedure
    .input(signupSchema)
    .mutation(
        async ({ input: { email, username, password, role }, ctx: { db } }) => {
            const hashedPassword = await bcrypt.hash(password, passwordCost);

            try {
                const user = await db.getRepository(User).save({
                    email,
                    username,
                    password: hashedPassword,
                    role: role ?? Role.USER,
                });

                try {
                    accountVerificationProducer.push({
                        command: 'verifyAccount',
                        content: {
                            user,
                        },
                        timestamp: new Date(),
                    });
                } catch (e) {
                    logger.error(
                        `Error while sending account verification message to RabbitMQ: ${e}`
                    );
                    // don't throw errors as we want the user to signup
                }

                return {
                    id: user.id,
                };
            } catch (error) {
                if (!(error instanceof Error)) {
                    logger.error(`Error during signup procedure: ${error}`);
                    throw error;
                }

                if (error.message.includes('duplicate key')) {
                    logger.error(
                        'Duplication error during signup procedure: email or username are already taken.'
                    );
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: `Email or username are already taken. Please, try different ones.`,
                    });
                }

                logger.error(`Error during signup procedure: ${error}`);
                throw error;
            }
        }
    );
