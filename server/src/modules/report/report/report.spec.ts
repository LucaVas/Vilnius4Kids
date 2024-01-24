import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import {
    fakePlayground,
    fakeReportCategory,
    fakeUser,
} from '@server/entities/tests/fakes';
import {
    Playground,
    ReportCategory,
    ReportStatusChangeLog,
    User,
} from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { report } = router.createCaller(authContext({ db }, user));

describe('Report a new issue', async () => {
    it('User can report an issue', async () => {
        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());
        const reportCategory = await db
            .getRepository(ReportCategory)
            .save(fakeReportCategory());

        const { message, newReport } = await report({
            playgroundId: playground.id,
            description: 'Test report description',
            reportCategoryId: reportCategory.id,
        });

        expect(message).toEqual('Report added successfully.');
        expect(newReport.description).toEqual('Test report description');

        const logs = await db
            .getRepository(ReportStatusChangeLog)
            .findBy({ report: newReport });
        expect(logs).toHaveLength(1);
    });

    it('User cannot report if playground does not exist', async () => {
        await expect(
            report({
                playgroundId: 100,
                description: 'Test report description',
                reportCategoryId: 1
            })
        ).rejects.toThrow('Playground with ID [100] does not exist.');
    });

    it('User cannot report with a too short description', async () => {
        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());

        await expect(
            report({
                playgroundId: playground.id,
                description: '',
                reportCategoryId: 1
            })
        ).rejects.toThrow(
            /Report description should be at least 5 characters long./
        );
    });
});
