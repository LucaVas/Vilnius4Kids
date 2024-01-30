import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import {
    fakePlayground,
    fakeUser,
} from '@server/entities/tests/fakes';
import { Playground, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { getPlaygrounds } = router.createCaller(authContext({ db }, user));

describe('Get all existing playgrounds', async () => {
    it('User gets no playgrounds, if none is available', async () => {
        const { playgrounds, count } = await getPlaygrounds();

        expect(count).toEqual(0);
        expect(playgrounds).toEqual([]);
    });

    it('User can get existing playgrounds', async () => {
        const [playground1, playground2] = await Promise.all([
            db.getRepository(Playground).save(fakePlayground()),
            db.getRepository(Playground).save(fakePlayground()),
        ]);
        
        const { playgrounds, count } = await getPlaygrounds();

        expect(count).toEqual(2);
        expect(playgrounds[0].id).toEqual(playground1.id);
        expect(playgrounds[1].id).toEqual(playground2.id);
    });
});
