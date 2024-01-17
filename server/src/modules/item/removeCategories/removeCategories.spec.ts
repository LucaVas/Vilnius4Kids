import { createTestDatabase } from '@tests/utils/database';
import { fakeCategory, fakeItem, fakeUser } from '@server/entities/tests/fakes';
import { Category, Item, User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import itemRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { removeCategories } = itemRouter.createCaller(authContext({ db, ai }, user));

describe("Remove an item's categories", async () => {
    it('User can remove all categories from an item', async () => {
        const category = await db.getRepository(Category).save(fakeCategory());
        const item = await db.getRepository(Item).save(fakeItem({ categories: [category]}));

        expect(item.categories).toHaveLength(1);

        const updatedItem = await removeCategories({ id: item.id });

        expect(updatedItem.categories).toEqual([]);
        expect(updatedItem.categories).toHaveLength(0);
    });

    it('Throws error if item does not exists', async () => {
        await expect(removeCategories({ id: 100 })).rejects.toThrow(
            /Item with id 100 does not exist./
        );
    });
});
