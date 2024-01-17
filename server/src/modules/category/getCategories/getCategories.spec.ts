import { createTestDatabase } from '@tests/utils/database';
import { fakeCategory, fakeUser } from '@server/entities/tests/fakes';
import { Category, User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import roomRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { getCategories } = roomRouter.createCaller(authContext({ db, ai }, user));

describe('Get categories', async () => {
    it('Returns empty list if no categories are available', async () => {
        const emptyCategories = await getCategories();
        expect(emptyCategories).toHaveLength(0);
    });

    it('User can get all categories', async () => {
        const savedCategory = await db
            .getRepository(Category)
            .save(fakeCategory());

        const categories = await getCategories();

        expect(categories).toHaveLength(1);
        expect(categories[0].name).toEqual(savedCategory.name);
    });
});
