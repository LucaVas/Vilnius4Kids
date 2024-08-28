import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakePlayground, fakeUser } from '@server/entities/tests/fakes';
import { Playground, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { getFavoritePlaygrounds } = router.createCaller(
    authContext({ db }, user)
);

describe('Get favorite playgrounds', async () => {
    it('User gets no favorite playgrounds, if none is saved', async () => {
        const { playgrounds } = await getFavoritePlaygrounds();

        expect(playgrounds.length).toEqual(0);
        expect(playgrounds).toEqual([]);
    });

    it('User can get existing favorite playgrounds', async () => {
        const [playground1, playground2] = await Promise.all([
            db
                .getRepository(Playground)
                .save(fakePlayground({ users: [user] })),
            db
                .getRepository(Playground)
                .save(fakePlayground({ users: [user] })),
        ]);

        const { playgrounds } = await getFavoritePlaygrounds();

        expect(playgrounds.length).toEqual(2);
        expect(playgrounds[0].id).toEqual(playground1.id);
        expect(playgrounds[1].id).toEqual(playground2.id);
    });
});
