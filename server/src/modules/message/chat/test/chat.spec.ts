import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakeUser } from '@server/entities/tests/fakes';
import { User } from '@server/entities';
import chatRouter from '../..';
import { fakeAi } from './fakes';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const ai = fakeAi('test response');
const { chat } = chatRouter.createCaller(authContext({ db, ai }, user));

describe('Chat', async () => {
    it('User can start a chat', async () => {
        const response = await chat({ content: 'test question' });

        expect(response.message).toEqual('test response');
    });

    it('Throws error if question is blank', async () => {
        await expect(
            chat({
                content: '',
            })
        ).rejects.toThrow(/Question must be at least 1 character long./);
    });
});
