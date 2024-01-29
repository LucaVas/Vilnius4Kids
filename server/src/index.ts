import createApp from './app';
import { createDatabase } from './database';
import config from './config';
import logger from './logger';

const database = createDatabase(config.database as any);

database.initialize().then(() => {
    const app = createApp(database);

    app.listen(config.port, () => {
        // eslint-disable-next-line no-console
        logger.info(`Server is running at http://localhost:${config.port}`);
    });
});
