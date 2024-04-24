import path from 'path';
import pino from 'pino';
import config from '@server/config';

const { logLevel } = config;

export default pino({
    level: logLevel,
    name: path.basename(__filename),
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
            ignore: 'pid,hostname',
        },
    },
});
