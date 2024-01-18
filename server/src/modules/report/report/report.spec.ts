import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import {
    fakePlayground,
    fakeUser,
} from '@server/entities/tests/fakes';
import { Playground, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { report } = router.createCaller(authContext({ db }, user));

describe('Report a new issue', async () => {
    it('User can report an issue', async () => {
        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());

        const { message, newReport } = await report({
            playgroundId: playground.id,
            description: 'Test report description',
        });

        expect(message).toEqual('Report added successfully.');
        expect(newReport.description).toEqual('Test report description');
    });

    it('User cannot report if playground does not exist', async () => {
        await expect(
            report({
                playgroundId: 100,
                description: 'Test report description',
            })
        ).rejects.toThrow("Playground with ID [100] does not exist.");
    });

    it('User cannot report with a too short description', async () => {

        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());

        await expect(
            report({
            playgroundId: playground.id,
            description: '',
            })
        ).rejects.toThrow(/Report description should be at least 5 characters long./);
    });
});
