import createApp from './app';
import { createDatabase } from './database';
import config from './config';
import buildAi from './modules/message/service/openai/config/open-ai';

const database = createDatabase(config.database as any);
const ai = buildAi();

database.initialize().then(() => {
    const app = createApp(database, ai);

    app.listen(config.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server is running at http://localhost:${config.port}`);
    });
});
