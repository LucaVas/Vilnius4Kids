import { createTestDatabase } from '@tests/utils/database';
import { fakeUser } from '@server/entities/tests/fakes';
import { User } from '@server/entities';
import buildService from '../index';
import { fakeAi } from '../../../chat/test/fakes';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());

describe('Chat service', async () => {
    it('Service returns answer to a question', async () => {
        const ai = fakeAi('test response');
        const service = buildService(db, user, ai);

        const response = await service.run('test question');

        expect(response).not.toBeNull();
        expect(response).toEqual('test response');
    });

    it('Throws error when answer content is empty', async () => {
        const ai = fakeAi(null);
        const service = buildService(db, user, ai);

        await expect(service.run('test question')).rejects.toThrow(
            /Something went wrong: assistant's response is empty./
        );
    });
});
