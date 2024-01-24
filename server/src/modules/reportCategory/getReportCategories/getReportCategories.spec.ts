
import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import {
    fakeReportCategory,
    fakeUser,
} from '@server/entities/tests/fakes';
import { ReportCategory, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { getReportCategories } = router.createCaller(
    authContext({ db }, user)
);

describe('Get report categories', async () => {
    it('User retrieves empty list if not categories are available', async () => {
        const { categories, count } = await getReportCategories();

        expect(count).toBe(0);
        expect(categories).toEqual([]);
    });

    it('User retrieves categories stored', async () => {
        const [ category1, category2 ] = await Promise.all([
            db.getRepository(ReportCategory).save(fakeReportCategory()),
            db.getRepository(ReportCategory).save(fakeReportCategory()),
        ]);
        
        const { categories, count } = await getReportCategories();

        expect(count).toBe(2);
        expect(categories[0]).toEqual(category1);
        expect(categories[1]).toEqual(category2);
    });
});
