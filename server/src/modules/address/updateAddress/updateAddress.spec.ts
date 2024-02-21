import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakeAddress, fakeUser } from '@server/entities/tests/fakes';
import { Address, User } from '@server/entities';
import addressRouter from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { updateAddress } = addressRouter.createCaller(authContext({ db }, user));

describe('Update an existing address', async () => {
    it('User can update an existing address', async () => {
        const existing = await db.getRepository(Address).save(fakeAddress());
        const { message, address } = await updateAddress({
            id: existing.id,
            number: 123,
            street: 'street',
            city: 'city',
            zipCode: 12345,
            district: 'district',
        });

        expect(address.number).toEqual(123);
        expect(address.street).toEqual('street');
        expect(address.city).toEqual('city');
        expect(address.zip_code).toEqual(12345);
        expect(message).toEqual('Address updated successfully.');
    });

    it('User cannot update a non existing address', async () => {
        await expect(
            updateAddress({
                ...fakeAddress(),
                id: 100,
            })
        ).rejects.toThrow('Error while updating address.');
    });

    it('User can update partially an existing address', async () => {
        const existingAddress = fakeAddress();
        const existing = await db.getRepository(Address).save(existingAddress);

        const { message, address } = await updateAddress({
            id: existing.id,
            number: 123,
            street: 'street',
        });

        expect(address.number).toEqual(123);
        expect(address.street).toEqual('street');
        expect(address.city).toEqual(existingAddress.city);
        expect(address.zip_code).toEqual(existingAddress.zipCode);
        expect(message).toEqual(`Address updated successfully.`);
    });
});
