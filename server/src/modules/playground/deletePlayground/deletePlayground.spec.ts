import { createTestDatabase } from '@tests/utils/database';
import { Address, Playground, User } from '@server/entities';
import { fakeAddress, fakeUser } from '@server/entities/tests/fakes';
import { authContext } from '@tests/utils/context';
import { Role } from '@server/entities/user/Role';
import router from '..';
import { fakePlayground } from '../../../entities/tests/fakes';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser({ role: Role.ADMIN }));
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
        ).rejects.toThrow('Error while deleting playground.');
    });
});
