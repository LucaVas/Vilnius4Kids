import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import {
    fakePlayground,
    fakeReportCategory,
    fakeUser,
} from '@server/entities/tests/fakes';
import { Playground, ReportCategory, User } from '@server/entities';
import { Role } from '@server/entities/user/Role';
import router from '..';
import { reportProducer } from '.';

const db = await createTestDatabase();

describe('Report a new issue', async () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('User can report an issue', async () => {
        const spy = vi.spyOn(reportProducer, 'push');
        spy.mockImplementationOnce(() => Promise.resolve(true));

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
            imagesInfo: [],
        });

        expect(message).toEqual('Thank you for submitting your report!');

        expect(spy).toBeCalledTimes(1);
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
                imagesInfo: [],
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
                imagesInfo: [],
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
                imagesInfo: [],
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
                imagesInfo: [],
            })
        ).rejects.toThrow(
            /Report description should be at least 5 characters long./
        );
    });

    it('Throws error if RabbitMq producer fails', async () => {
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

        const spy = vi.spyOn(reportProducer, 'push');
        spy.mockRejectedValue(new Error('RabbitMQ error'));

        await expect(
            report({
                playgroundId: playground.id,
                description: 'Test report description',
                reportCategoryId: reportCategory.id,
                imagesInfo: []
            })
        ).rejects.toThrow(
            /Error while submitting report. Please try again later/
        );
    });
});
