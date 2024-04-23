import 'dotenv/config';
import z from 'zod';

const { env } = process;

if (!env.NODE_ENV) env.NODE_ENV = 'development';

const isTest = env.NODE_ENV === 'test';
const isDevTest = env.NODE_ENV === 'development' || isTest;

const isInMemory = env.DB_TYPE === 'pg-mem';

const schema = z
    .object({
        env: z
            .enum(['development', 'production', 'staging', 'test'])
            .default('development'),
        isCi: z.coerce.boolean().default(false),
        port: z.coerce.number().default(3000),

        logLevel: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

        auth: z.object({
            tokenKey: z.string().default(() => {
                if (isDevTest) {
                    return '';
                }

                throw new Error(
                    'You must provide a token key in production env!'
                );
            }),
            expiresIn: z.string().default('7d'),
            passwordCost: z.coerce.number().default(isDevTest ? 6 : 12),
        }),

        smtp: z.object({
            service: z.string().default('Gmail'),
            host: z.string().default('smtp.gmail.com'),
            port: z.coerce.number().default(465),
            secure: z.coerce.boolean().default(true),
            sender: z.string().email().default('vilniusforkids@gmail.com'),
            auth: z.object({
                user: z.string().email().default(''),
                pass: z.string().default(''),
            }),
        }),

        s3: z.object({
            accessKeyId: z.string(),
            secretAccessKey: z.string(),
            region: z.string(),
            bucket: z.string(),
            imageSize: z.coerce.number().default(5000000),
            imageUploadTimeout: z.coerce.number().default(30),
        }),

        rabbitMq: z.object({
            user: z.string().default(''),
            password: z.string().default(''),
            host: z.string().default('localhost'),
            mqChannelRetryDelays: z.coerce.number().default(10),
            mqChannelMaxRetries: z.coerce.number().default(5),
            mqConnectionRetryDelays: z.coerce.number().default(10),
            mqConnectionMaxRetries: z.coerce.number().default(5),
            queues: z.array(
                z.object({
                    name: z.string(),
                    queueName: z.string(),
                    options: z.object({
                        durable: z.coerce.boolean().default(true),
                        persistent: z.coerce.boolean().default(true),
                    }),
                })
            ),
        }),

        database: z.object({
            type: z
                .enum([
                    'postgres',
                    'mysql',
                    'mariadb',
                    'better-sqlite3',
                    'pg-mem',
                ])
                .default('postgres'),
            host: z.string().default('localhost'),
            port: z.coerce.number().default(5432),
            database: isInMemory
                ? z.string().optional()
                : z.string().default('vilnius4kidsdb'),
            username: isInMemory
                ? z.string().optional()
                : z.string().default('postgres'),
            password: isInMemory
                ? z.string().optional()
                : z.string().default('postgres'),

            logging: z.preprocess(
                coerceBoolean,
                z.boolean().default(isDevTest)
            ),
            synchronize: z.preprocess(
                coerceBoolean,
                z.boolean().default(isDevTest)
            ),
            ssl: z.preprocess(coerceBoolean, z.boolean().default(false)),
        }),

        clientPath: z.string(),
        googleMapsApiKey: z.string(),
    })
    .readonly();

const config = schema.parse({
    env: env.NODE_ENV,
    port: env.PORT,
    isCi: env.CI,
    logLevel: env.LOG_LEVEL,

    auth: {
        tokenKey: env.TOKEN_KEY,
        expiresIn: env.TOKEN_EXPIRES_IN,
        passwordCost: env.PASSWORD_COST,
    },

    s3: {
        accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
        region: env.AWS_S3_REGION,
        bucket: env.AWS_S3_BUCKET_NAME,
        imageSize: env.AWS_S3_FILE_SIZE_MAX_IN_BYTES,
        imageUploadTimeout: env.AWS_S3_IMAGE_UPLOAD_TIMEOUT_IN_SECONDS,
    },

    rabbitMq: {
        user: env.RABBIT_MQ_USER,
        password: env.RABBIT_MQ_PASSWORD,
        host: env.RABBIT_MQ_HOST,
        mqChannelRetryDelays: env.RABBIT_MQ_CHANNEL_RETRY_DELAYS_MS,
        mqChannelMaxRetries: env.RABBIT_MQ_CHANNEL_MAX_RETRIES,
        mqConnectionRetryDelays: env.RABBIT_MQ_CONNECTION_RETRY_DELAYS_MS,
        mqConnectionMaxRetries: env.RABBIT_MQ_CONNECTION_MAX_RETRIES,
        queues: [
            {
                name: 'subscriptions',
                queueName: env.RABBIT_MQ_SUBSCRIPTIONS_QUEUE_NAME,
                options: {
                    durable: env.RABBIT_MQ_SUBSCRIPTIONS_QUEUE_DURABLE,
                    persistent: env.RABBIT_MQ_SUBSCRIPTIONS_QUEUE_PERSISTENT,
                },
            },
            {
                name: 'reports',
                queueName: env.RABBIT_MQ_REPORTS_QUEUE_NAME,
                options: {
                    durable: env.RABBIT_MQ_REPORTS_QUEUE_DURABLE,
                    persistent: env.RABBIT_MQ_REPORTS_QUEUE_PERSISTENT,
                },
            },
            {
                name: 'password-resets',
                queueName: env.RABBIT_MQ_PASSWORD_RESETS_QUEUE_NAME,
                options: {
                    durable: env.RABBIT_MQ_PASSWORD_RESETS_QUEUE_DURABLE,
                    persistent: env.RABBIT_MQ_PASSWORD_RESETS_QUEUE_PERSISTENT,
                },
            },
            {
                name: 'account-verifications',
                queueName: env.RABBIT_MQ_ACCOUNT_VERIFICATIONS_QUEUE_NAME,
                options: {
                    durable: env.RABBIT_MQ_ACCOUNT_VERIFICATIONS_QUEUE_DURABLE,
                    persistent:
                        env.RABBIT_MQ_ACCOUNT_VERIFICATIONS_QUEUE_PERSISTENT,
                },
            },
            {
                name: 'user-deletions',
                queueName: env.RABBIT_MQ_USER_DELETIONS_QUEUE_NAME,
                options: {
                    durable: env.RABBIT_MQ_USER_DELETIONS_QUEUE_DURABLE,
                    persistent: env.RABBIT_MQ_USER_DELETIONS_QUEUE_PERSISTENT,
                },
            },
        ],
    },

    database: {
        type: env.DB_TYPE,
        host: env.DB_HOST,
        port: env.DB_PORT,
        database: env.DB_NAME,
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        logging: env.DB_LOGGING,
        synchronize: env.DB_SYNC,
        ssl: env.DB_SSL,
    },

    smtp: {
        service: env.SMTP_SERVICE,
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE_CONNECTION,
        sender: env.SMTP_SENDER,
        auth: {
            user: env.SMTP_USERNAME,
            pass: env.SMTP_PASSWORD,
        },
    },

    clientPath: env.CLIENT_PATH,
    googleMapsApiKey: env.GOOGLE_MAPS_API_KEY,
});

export default config;

// utility functions
function coerceBoolean(value: unknown) {
    if (typeof value === 'string') {
        return value === 'true' || value === '1';
    }

    return undefined;
}
