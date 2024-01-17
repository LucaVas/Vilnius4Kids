import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakeUser } from '@server/entities/tests/fakes';
import { User } from '@server/entities';
import categoryRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { addCategory } = categoryRouter.createCaller(authContext({ db, ai }, user));

describe('Add category', async () => {
    it('User can add a new category', async () => {
        const { id, name } = await addCategory({
            name: 'Test category',
        });

        expect(id).toBe(1);
        expect(name).toEqual('Test category');
    });

    it('User can add a category with trailing spaces in name', async () => {
        const { id, name } = await addCategory({
            name: ' \t New category\t   \t',
        });

        expect(id).toBe(2);
        expect(name).toEqual('New category');
    });

    it('User cannot add a category with empty name', async () => {
        await expect(
            addCategory({
                name: '',
            })
        ).rejects.toThrow(/Category name must be at least 2 characters long./);
    });
});
