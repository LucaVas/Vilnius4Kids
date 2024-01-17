import { createTestDatabase } from '@tests/utils/database';
import { Category, User } from '@server/entities';
import { fakeUser } from '@server/entities/tests/fakes';
import { authContext } from '@tests/utils/context';
import categoryRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { updateCategory } = categoryRouter.createCaller(authContext({ db, ai }, user));

describe('Update category', async () => {
    it('User can update a category', async () => {
        await db.getRepository(Category).save({
            name: 'Test category',
        });

        const { id, name } = await updateCategory({
            id: 1,
            name: 'Updated',
        });

        expect(id).toBe(1);
        expect(name).toEqual('Updated');
    });

    it('User can update a category with trailing spaces in name', async () => {
        await db.getRepository(Category).save({
            name: 'Test category 2',
        });

        const { id, name } = await updateCategory({
            id: 2,
            name: ' \t New category\t   \t',
        });

        expect(id).toBe(2);
        expect(name).toEqual('New category');
    });

    it('User cannot update a category with empty name', async () => {
        await db.getRepository(Category).save({
            name: 'Test category 3',
        });

        await expect(
            updateCategory({
                id: 3,
                name: '',
            })
        ).rejects.toThrow(/Category name must be at least 2 characters long./);
    });

    it('Throws an error if category does not exist', async () => {
        await expect(
            updateCategory({
                id: 10,
                name: 'Not existing',
            })
        ).rejects.toThrow(/Category "Not existing" does not exist./);
    });
});
