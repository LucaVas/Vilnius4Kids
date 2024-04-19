import { createTestDatabase } from '@tests/utils/database';
import { Playground, User } from '@server/entities';
import { fakeUser } from '@server/entities/tests/fakes';
import { authContext } from '@tests/utils/context';
import router from '..';
import { fakePlayground } from '../../../entities/tests/fakes';

const db = await createTestDatabase();

describe('Delete a playground from favorites', async () => {
    it('User can delete an existing playground from favorites', async () => {
        const user = await db.getRepository(User).save(fakeUser());
        const { deleteFavoritePlayground } = router.createCaller(
            authContext({ db }, user)
        );

        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());

        await db
            .getRepository(User)
            .save({ ...user, playgrounds: [playground] });

        const favoritesBefore = await db.getRepository(User).find({
            where: { id: user.id },
            relations: {
                playgrounds: true,
            },
        });

        expect(favoritesBefore[0].playgrounds.length).toBe(1);

        const res = await deleteFavoritePlayground({ id: playground.id });

        const favoritesAfter = await db.getRepository(User).find({
            where: { id: user.id },
            relations: {
                playgrounds: true,
            },
        });
        expect(favoritesAfter[0].playgrounds.length).toBe(0);

        expect(res.message).toEqual(
            'Playground deleted successfully from favorites.'
        );
    });

    it('Playground cannot be deleted from favorites if user does not exists', async () => {
        const user = db.getRepository(User).create(fakeUser());
        const { deleteFavoritePlayground } = router.createCaller(
            authContext({ db }, user)
        );

        await expect(deleteFavoritePlayground({ id: 1 })).rejects.toThrow(
            `Error while deleting playground from favorites.`
        );
    });
});
