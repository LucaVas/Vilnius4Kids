import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakeAddress, fakeUser } from '@server/entities/tests/fakes';
import { User } from '@server/entities';
import { Role } from '@server/entities/user/Role';
import addressRouter from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser({ role: Role.USER }));
const { addAddress } = addressRouter.createCaller(authContext({ db }, user));

describe('Add a new address', async () => {
    it('User can add a new address', async () => {
        const { message } = await addAddress(fakeAddress());
        expect(message).toEqual('Address added successfully.');
    });

    it('User cannot add a new address with a negative number', async () => {
        await expect(
            addAddress({
                ...fakeAddress(),
                number: -1,
            })
        ).rejects.toThrow(/Number must be greater than 0/);
    });

    it('User cannot add a new address without a street', async () => {
        await expect(
            addAddress({
                street: '',
                city: 'City',
                zipCode: 12345,
                number: 123,
                district: 'District',
            })
        ).rejects.toThrow(/Street should be at least 3 characters long./);
    });
});
