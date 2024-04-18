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
import { Role } from '@server/entities/user/Role';
import router from '..';

const db = await createTestDatabase();

describe('Report a new issue', async () => {
    it('User can report an issue', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER, isRegistered: true }));
        const { report } = router.createCaller(authContext({ db }, user));

        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());
        const reportCategory = await db
            .getRepository(ReportCategory)
            .save(fakeReportCategory());

        const { message } = await report({
            playgroundId: playground.id,
            description: 'Test report description',
            reportCategoryId: reportCategory.id,
        });

        expect(message).toEqual('Thank you for submitting your report!');

        const logs = await db
            .getRepository(ReportStatusChangeLog)
            .findOne({ where: { playground } })
        expect(logs).toHaveLength(1);
    });

    it('User cannot report if playground does not exist', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER, isRegistered: true }));
        const { report } = router.createCaller(authContext({ db }, user));

        await expect(
            report({
                playgroundId: 100,
                description: 'Test report description',
                reportCategoryId: 1,
            })
        ).rejects.toThrow('Error while creating report.');
    });

    it('User cannot report if category does not exist', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER, isRegistered: true }));
        const { report } = router.createCaller(authContext({ db }, user));

        await expect(
            report({
                playgroundId: 1,
                description: 'Test report description',
                reportCategoryId: 100,
            })
        ).rejects.toThrow('Error while creating report.');
    });

    it('Report cannot be created if user does not exist', async () => {
        const user = await db
            .getRepository(User)
            .create(fakeUser({ role: Role.USER, isRegistered: true }));
        const { report } = router.createCaller(authContext({ db }, user));

        await expect(
            report({
                playgroundId: 1,
                description: 'Test report description',
                reportCategoryId: 1,
            })
        ).rejects.toThrow(`Error while creating report.`);
    });

    it('User cannot report with a too short description', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER, isRegistered: true }));
        const { report } = router.createCaller(authContext({ db }, user));

        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());

        await expect(
            report({
                playgroundId: playground.id,
                description: '',
                reportCategoryId: 1,
            })
        ).rejects.toThrow(
            /Report description should be at least 5 characters long./
        );
    });
});
