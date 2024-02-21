import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import {
    fakeAddress,
    fakePlayground,
    fakeUser,
} from '@server/entities/tests/fakes';
import { Address, User } from '@server/entities';
import { Role } from '@server/entities/user/Role';
import playgroundRouter from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser({ role: Role.ADMIN }));
const { addPlayground } = playgroundRouter.createCaller(
    authContext({ db }, user)
);

describe('Add a new playground', async () => {
    it('User can add a new playground given an address', async () => {
        const address = await db.getRepository(Address).save(fakeAddress());
        const { message, playground } = await addPlayground({
            isPrivate: false,
            isOpen: true,
            addressId: address.id,
            latitude: 1,
            longitude: 1,
            description: 'Test description',
        });

        expect(message).toEqual('Playground added successfully.');
        expect(playground.isOpen).toEqual(true);
        expect(playground.isPrivate).toEqual(false);
        expect(playground.address.street).toEqual(address.street);
        expect(playground.address.city).toEqual(address.city);
    });

    it('User cannot add a new playground if address does not exist', async () => {
        await expect(
            addPlayground({ ...fakePlayground(), addressId: 100 })
        ).rejects.toThrow('Error while inserting playground.');
    });
});
