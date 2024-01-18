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
const { updatePlayground } = router.createCaller(authContext({ db }, user));

describe('Update an existing playground', async () => {
    it('User can update an existing playground', async () => {
        const address = await db.getRepository(Address).save(fakeAddress());
        const existing = await db
            .getRepository(Playground)
            .save(fakePlayground({ address }));

        const { message, playground } = await updatePlayground({
            id: existing.id,
            isOpen: false,
            isPrivate: true,
        });

        expect(playground.is_open).toEqual(false);
        expect(playground.is_private).toEqual(true);
        expect(message).toEqual('Playground with ID [1] updated successfully.');
    });

    it('User cannot update a non existing playground', async () => {
        await expect(
            updatePlayground({
                ...fakePlayground(),
                id: 100,
            })
        ).rejects.toThrow('Playground with ID [100] does not exist.');
    });

    it('User can update partially an existing playground', async () => {
        const address = await db.getRepository(Address).save(fakeAddress());
        const existing = await db
            .getRepository(Playground)
            .save(fakePlayground({ address, isOpen: true, isPrivate: false }));

        const { message, playground } = await updatePlayground({
            id: existing.id,
            isOpen: false,
        });


        expect(playground.is_open).not.toBe(existing.isOpen);
        expect(playground.is_private).toEqual(existing.isPrivate);
        expect(message).toEqual(
            `Playground with ID [${existing.id}] updated successfully.`
        );
    });
});
