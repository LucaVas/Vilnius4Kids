// starts with the real database configuration
import createApp from '@server/app';
import supertest from 'supertest';
import { fakeAi } from '@server/modules/message/chat/test/fakes';
import { createTestDatabase } from './utils/database';

const database = await createTestDatabase();
const ai = fakeAi('test');
const app = createApp(database, ai);

afterAll(() => {
    database.destroy();
});

it('can launch the app', async () => {
    await supertest(app).get('/health').expect(200, 'OK');
    await supertest(app).get('/ready').expect(200, 'OK');
});
