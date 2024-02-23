import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakePlayground, fakeUser } from '@server/entities/tests/fakes';
import { Playground, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { getPlayground } = router.createCaller(authContext({ db }, user));

describe('Retrieve an existing playground', async () => {
    it('User can retrieve an existing playground', async () => {
        const existing = await db
            .getRepository(Playground)
            .save(fakePlayground());

        const playground = await getPlayground({ id: existing.id });

        expect(playground.id).toEqual(existing.id);
        expect(playground.isOpen).toEqual(existing.isOpen);
        expect(playground.isPrivate).toEqual(existing.isPrivate);
    });

    it('User cannot retrieve a non existing playground', async () => {
        await expect(getPlayground({ id: 100 })).rejects.toThrow(
            'Error while retrieving playground.'
        );
    });
});
