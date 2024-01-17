import { createTestDatabase } from '@tests/utils/database';
import { fakeMessage, fakeUser } from '@server/entities/tests/fakes';
import { Message, User } from '@server/entities';
import buildRepository from '../repository';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const repository = buildRepository(db, user);

afterEach(async () => {
    await db.getRepository(Message).delete({});
})

describe('Chat repository', async () => {
    it('User can get their message history', async () => {
        const message = await db
            .getRepository(Message)
            .save(fakeMessage({ user }));

        const messages = await repository.getHistory();

        expect(messages.length).toBe(1);
        expect(messages[0].role).toBe(message.role);
        expect(messages[0].content).toBe(message.content);
    });

    it('User can save messages to database', async () => {
        await repository.saveMessages([fakeMessage({ user })]);
        const messages = await db.getRepository(Message).find({
            where: { user },
            select: { role: true, content: true },
        });

        expect(messages.length).toBe(1);
    });
});
