import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakeAddress, fakeUser } from '@server/entities/tests/fakes';
import { Address, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { getAddresses } = router.createCaller(authContext({ db }, user));

describe('Get all existing addresses', async () => {
    it('User gets no addresses, if none is available', async () => {
        const { addresses } = await getAddresses();

        expect(addresses).toEqual([]);
    });

    it('User can get existing addresses', async () => {
        const [address1, address2] = await Promise.all([
            db.getRepository(Address).save(fakeAddress()),
            db.getRepository(Address).save(fakeAddress()),
        ]);

        const { addresses } = await getAddresses();

        expect(addresses[0].id).toEqual(address1.id);
        expect(addresses[1].id).toEqual(address2.id);
    });
});
