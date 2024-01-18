import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakeReport, fakeUser } from '@server/entities/tests/fakes';
import { Report, User } from '@server/entities';
import { getStatusFromString } from '@server/entities/report/ReportStatus';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { updateReport } = router.createCaller(authContext({ db }, user));

describe('Update an existing report', async () => {
    it('User can update an existing report', async () => {
        const existing = await db.getRepository(Report).save(fakeReport());
        const { message, report } = await updateReport({
            id: existing.id,
            description: 'description',
            status: getStatusFromString('in progress')!,
        });

        expect(message).toEqual('Report with ID [1] updated successfully.');
        expect(report.description).toEqual('description');
        expect(report.status).toEqual('in progress');
    });

    it('User cannot update a non existing report', async () => {
        await expect(
            updateReport({
                id: 100,
                description: 'description',
                status: getStatusFromString('in progress')!,
            })
        ).rejects.toThrow('Report with ID [100] does not exist.');
    });

    it('User cannot update a report with an invalid status', async () => {
        const existingReport = fakeReport();
        const existing = await db.getRepository(Report).save(existingReport);

        await expect(
            updateReport({
                id: existing.id,
                description: 'description',
                status: getStatusFromString('inactive')!,
            })
        ).rejects.toThrow(/expected": "'open' | 'in progress' | 'closed'/);
    });
});
