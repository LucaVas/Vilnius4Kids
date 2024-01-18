import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import {
    fakeReport,
    fakeUser,
} from '@server/entities/tests/fakes';
import { Report, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { getReportById } = router.createCaller(authContext({ db }, user));

describe('Get a report', async () => {
    it('User gets an existing report', async () => {

        const existing = await db.getRepository(Report).save(fakeReport());
        const report = await getReportById({ id: existing.id });

        expect(report.description).toEqual(existing.description);
    });

    it('User cannot get a non existing report', async () => {
        await expect(
            getReportById({
                id: 100
            })
        ).rejects.toThrow('Report with ID [100] does not exist.');
    });
});
