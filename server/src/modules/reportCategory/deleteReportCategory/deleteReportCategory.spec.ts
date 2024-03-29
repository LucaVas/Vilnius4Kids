import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakeReportCategory, fakeUser } from '@server/entities/tests/fakes';
import { ReportCategory, User } from '@server/entities';
import { Role } from '@server/entities/user/Role';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser({ role: Role.ADMIN }));
const { deleteReportCategory } = router.createCaller(authContext({ db }, user));

describe('Delete a report category', async () => {
    it('User can delete a report category', async () => {
        const existingCategory = await db
            .getRepository(ReportCategory)
            .save(fakeReportCategory());

        const { message } = await deleteReportCategory({
            id: existingCategory.id,
        });

        expect(message).toEqual('Report category deleted successfully.');
    });

    it('User cannot delete a non existing report category', async () => {
        await expect(deleteReportCategory({ id: 100 })).rejects.toThrow(
            'Error while deleting report category.'
        );
    });
});
