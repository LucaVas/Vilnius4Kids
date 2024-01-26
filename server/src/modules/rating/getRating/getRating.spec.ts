import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakePlayground, fakeUser } from '@server/entities/tests/fakes';
import { Playground, Rating, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { getRating } = router.createCaller(authContext({ db }, user));

describe('Get playgrounds rating', async () => {
    it('User will get no ratings on unrated playground', async () => {
        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());
        const { count, rating } = await getRating({ id: playground.id });

        expect(count).toBe(0);
        expect(rating).toBe(0.0);
    });

    it('User can get rating of an existing playground', async () => {
        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());

        await Promise.all([
            db.getRepository(Rating).save({
                rating: 1.5,
                playground,
                user,
            }),
            db.getRepository(Rating).save({
                rating: 3,
                playground,
                user,
            }),
            db.getRepository(Rating).save({
                rating: 5,
                playground,
                user,
            }),
        ]);

        const { count, rating } = await getRating({ id: playground.id });

        expect(count).toBe(3);
        expect(rating).toBe(3.17);
    });

    it('User cannot get rating of a non existing playground', async () => {
        await expect(
            getRating({
                id: 100,
            })
        ).rejects.toThrow('Playground with ID [100] does not exist.');
    });
});
