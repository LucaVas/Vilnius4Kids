import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakePlayground, fakeUser } from '@server/entities/tests/fakes';
import { Playground, Report, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { getReportsByPlayground } = router.createCaller(
    authContext({ db }, user)
);

describe('Get reports by playground', async () => {
    it('User gets an no reports if none exists', async () => {
        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());

        const { count, reports } = await getReportsByPlayground({
            id: playground.id,
        });

        expect(count).toEqual(0);
        expect(reports).toEqual([]);
    });

    it('User gets an existing reports of a playground', async () => {
        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());
        await Promise.all([
            db
                .getRepository(Report)
                .save({ description: 'test description 1', playground }),
            db
                .getRepository(Report)
                .save({ description: 'test description 2', playground }),
        ]);

        const { count, reports } = await getReportsByPlayground({
            id: playground.id,
        });

        expect(count).toEqual(2);
        expect(reports[0].description).toEqual('test description 1');
        expect(reports[1].description).toEqual('test description 2');
    });

    it('User cannot get a reports for a non existing playground', async () => {
        await expect(
            getReportsByPlayground({
                id: 100,
            })
        ).rejects.toThrow('Error while retrieving report.');
    });
});
