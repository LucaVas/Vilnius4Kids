import { createTestDatabase } from '@tests/utils/database';
import { Address, Playground, User } from '@server/entities';
import { fakeAddress, fakeUser } from '@server/entities/tests/fakes';
import { authContext } from '@tests/utils/context';
import router from '..';
import { fakePlayground } from '../../../entities/tests/fakes';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { deletePlayground } = router.createCaller(authContext({ db }, user));

describe('Delete a playground', async () => {
    it('User can delete an existing playground', async () => {
        const address = await db.getRepository(Address).save(fakeAddress());
        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground({ address }));

        const res = await deletePlayground({ id: playground.id });

        expect(res.message).toEqual('1 playground deleted successfully.');
    });

    it('Throws an error if the playground does not exist', async () => {
        await expect(
            deletePlayground({
                id: 100,
            })
        ).rejects.toThrow('Playground with ID [100] does not exist.');
    });
});
