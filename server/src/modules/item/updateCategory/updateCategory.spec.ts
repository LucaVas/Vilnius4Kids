import { createTestDatabase } from '@tests/utils/database';
import { fakeCategory, fakeItem, fakeUser } from '@server/entities/tests/fakes';
import { Category, Item, User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import itemRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { updateCategory } = itemRouter.createCaller(authContext({ db, ai }, user));

describe("Update item's categories", async () => {
    it("User can update an item's categories", async () => {
        const oldItem1 = fakeItem();
        await db.getRepository(Item).save(oldItem1);
        const category = fakeCategory();
        await db.getRepository(Category).save(category);

        const itemUpdated1 = await updateCategory({
            id: 1,
            categoryIds: [category.id],
        });

        expect(itemUpdated1.name).toBe(oldItem1.name);
        expect(itemUpdated1.description).toBe(oldItem1.description);
        expect(oldItem1.categories).toBe(undefined);
        expect(itemUpdated1.categories).toHaveLength(1);
    });

    it('Ignores non-existing categories', async () => {
        const oldItem2 = await db.getRepository(Item).save(fakeItem());

        const itemUpdated2 = await updateCategory({
            id: oldItem2.id,
            categoryIds: [5, 6, 7],
        });

        expect(itemUpdated2.name).toBe(oldItem2.name);
        expect(itemUpdated2.description).toBe(oldItem2.description);
        expect(itemUpdated2.categories).toHaveLength(0);
    });

    it('Throws an error if item does not exist', async () => {
        await expect(
            updateCategory({ id: 100, categoryIds: [] })
        ).rejects.toThrow(/Item with id 100 does not exist./);
    });
});
