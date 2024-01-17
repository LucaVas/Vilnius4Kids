import { createTestDatabase } from '@tests/utils/database';
import { Category, User } from '@server/entities';
import { fakeUser } from '@server/entities/tests/fakes';
import { authContext } from '@tests/utils/context';
import categoryRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { deleteCategory } = categoryRouter.createCaller(authContext({ db, ai }, user));

describe('Delete a category', async () => {
    it('User can delete an existing category', async () => {
        await db.getRepository(Category).save({
            name: 'Test category',
        });

        const res = await deleteCategory({
            name: 'Test category',
        });

        expect(res.message).toEqual('1 category deleted successfully.');
    });

    it('User can delete a category with trailing spaces in name', async () => {
        await db.getRepository(Category).save({
            name: 'Test category 1',
        });

        const res = await deleteCategory({
            name: ' \t Test category 1\t   \t',
        });

        expect(res.message).toEqual('1 category deleted successfully.');
    });

    it('Throws an error if category does not exist', async () => {
        await db.getRepository(Category).save({
            name: 'Test category 2',
        });

        await expect(
            deleteCategory({
                name: 'Not existing category',
            })
        ).rejects.toThrow(/Category "Not existing category" does not exist./);
    });

    it('User cannot remove a category with empty name', async () => {
        await expect(
            deleteCategory({
                name: '',
            })
        ).rejects.toThrow(/Category name must be at least 2 characters long./);
    });
});
