import { createTestDatabase } from '@tests/utils/database';
import { Address, User } from '@server/entities';
import { fakeAddress, fakeUser } from '@server/entities/tests/fakes';
import { adminContext } from '@tests/utils/context';
import { Role } from '@server/entities/user/Role';
import categoryRouter from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser({ role: Role.ADMIN }));
const { deleteAddress } = categoryRouter.createCaller(
    adminContext({ db }, user)
);

describe('Delete an address', async () => {
    it('User can delete an existing address', async () => {
        const address = await db.getRepository(Address).save(fakeAddress());

        const res = await deleteAddress({ id: address.id });

        expect(res.message).toEqual('1 address deleted successfully.');
    });

    it('Throws an error if the address does not exist', async () => {
        await expect(
            deleteAddress({
                id: 100,
            })
        ).rejects.toThrow('Address with ID [100] does not exist.');
    });
});
