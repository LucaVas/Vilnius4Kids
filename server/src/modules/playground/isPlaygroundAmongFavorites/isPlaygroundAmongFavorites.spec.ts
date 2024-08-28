import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakePlayground, fakeUser } from '@server/entities/tests/fakes';
import { Playground, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { isPlaygroundAmongFavorites } = router.createCaller(
    authContext({ db }, user)
);

describe('Get favorite playgrounds', async () => {
    it('User gets no favorite playgrounds, if none is saved', async () => {
        const isAmongFavorites = await isPlaygroundAmongFavorites({ id: 1 });

        expect(isAmongFavorites).toBe(false);
    });

    it('User can retrieve if existing playgrounds are among favorites', async () => {
        const [playground1, playground2] = await Promise.all([
            db
                .getRepository(Playground)
                .save(fakePlayground({ users: [user] })),
            db
                .getRepository(Playground)
                .save(fakePlayground({ users: [user] })),
        ]);

        const [is1AmongFavorites, is2AmongFavorites] = await Promise.all([
            isPlaygroundAmongFavorites({
                id: playground1.id,
            }),
            await isPlaygroundAmongFavorites({
                id: playground2.id,
            }),
        ]);

        expect(is1AmongFavorites).toBe(true);
        expect(is2AmongFavorites).toBe(true);
    });
});
