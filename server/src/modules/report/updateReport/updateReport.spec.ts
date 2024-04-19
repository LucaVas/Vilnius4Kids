import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakeReport, fakeUser } from '@server/entities/tests/fakes';
import { Report, User } from '@server/entities';
import { getStatusFromString } from '@server/entities/report/ReportStatus';
import { Role } from '@server/entities/user/Role';
import router from '..';
import { reportProducer } from '../report';

const db = await createTestDatabase();

describe('Update an existing report', async () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('User can update an existing report', async () => {
        const spy = vi.spyOn(reportProducer, 'push');
        spy.mockImplementationOnce(() => Promise.resolve(true));

        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.ADMIN }));
        const { updateReport } = router.createCaller(authContext({ db }, user));

        const existing = await db.getRepository(Report).save(fakeReport());
        const { message } = await updateReport({
            id: existing.id,
            description: 'description',
            status: getStatusFromString('in progress')!,
        });

        expect(spy).toBeCalledTimes(1);

        expect(message).toEqual('Thank you for updating this report!');
    });

    it('User cannot update a non existing report', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.ADMIN }));
        const { updateReport } = router.createCaller(authContext({ db }, user));

        await expect(
            updateReport({
                id: 100,
                description: 'description',
                status: getStatusFromString('in progress')!,
            })
        ).rejects.toThrow('Error while updating report.');
    });

    it('User cannot update a report with an invalid status', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.ADMIN }));
        const { updateReport } = router.createCaller(authContext({ db }, user));

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

    it('Report cannot be updated if user does not exist', async () => {
        const user = db
            .getRepository(User)
            .create(fakeUser({ role: Role.ADMIN }));
        const { updateReport } = router.createCaller(authContext({ db }, user));

        await expect(
            updateReport({
                id: 1,
                description: 'Test report description',
                status: getStatusFromString('in progress')!,
            })
        ).rejects.toThrow(`Error while updating report.`);
    });

    it('Report cannot be updated if user is not an administrator', async () => {
        const user = db
            .getRepository(User)
            .create(fakeUser({ role: Role.USER }));
        const { updateReport } = router.createCaller(authContext({ db }, user));

        await expect(
            updateReport({
                id: 1,
                description: 'Test report description',
                status: getStatusFromString('in progress')!,
            })
        ).rejects.toThrow(
            `Only administrators have permission to access this resource.`
        );
    });

    it('Throws error if RabbitMq producer fails', async () => {
        const spy = vi.spyOn(reportProducer, 'push');
        spy.mockRejectedValue(new Error('RabbitMQ error'));

        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.ADMIN }));
        const { updateReport } = router.createCaller(authContext({ db }, user));

        const existing = await db.getRepository(Report).save(fakeReport());
        await expect(
            updateReport({
                id: existing.id,
                description: 'description',
                status: getStatusFromString('in progress')!,
            })
        ).rejects.toThrow(
            /Error while updating report. Please try again later./
        );
    });
});
