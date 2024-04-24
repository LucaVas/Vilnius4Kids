import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakeUser } from '@server/entities/tests/fakes';
import { Report, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { getReportsByUser } = router.createCaller(authContext({ db }, user));

describe('Get reports by user', async () => {
    it('User gets an no reports if none exists', async () => {
        const { count, reports } = await getReportsByUser({
            id: user.id,
        });

        expect(count).toEqual(0);
        expect(reports).toEqual([]);
    });

    it('User gets an existing reports of a user', async () => {
        await Promise.all([
            db
                .getRepository(Report)
                .save({ description: 'test description 1', user }),
            db
                .getRepository(Report)
                .save({ description: 'test description 2', user }),
        ]);

        const { count, reports } = await getReportsByUser({
            id: user.id,
        });

        expect(count).toEqual(2);
        expect(reports[0].description).toEqual('test description 1');
        expect(reports[1].description).toEqual('test description 2');
    });

    it('User cannot get a reports for a non existing user', async () => {
        await expect(
            getReportsByUser({
                id: 100,
            })
        ).rejects.toThrow('Error while retrieving reports.');
    });
});
