import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import {
    fakeAddress,
    fakePlayground,
    fakeUser,
} from '@server/entities/tests/fakes';
import { Address, Playground, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { addFavoritePlayground } = router.createCaller(
    authContext({ db }, user)
);

describe('Add a favorite playground', async () => {
    it('User can add a new playground to its favorites', async () => {
        const address = await db.getRepository(Address).save(fakeAddress());
        const existing = await db
            .getRepository(Playground)
            .save(fakePlayground({ address}));

        const { message, playground } = await addFavoritePlayground({
            id: existing.id,
        });

        expect(message).toEqual('Favorite playground added successfully.');
        expect(playground.address).toEqual(existing.address);
    });

    it(
        'User cannot add a playground to favorites if it does not exist',
        async () => {
            await expect(
                addFavoritePlayground({ id: 100 })
            ).rejects.toThrow('Playground with ID [100] does not exist.');
        }
    );
});
