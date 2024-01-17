import { createTestDatabase } from '@tests/utils/database';
import { fakeRoom, fakeUser } from '@server/entities/tests/fakes';
import { Room, User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import roomRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { getRooms } = roomRouter.createCaller(authContext({ db, ai }, user));

afterEach(async () => {
    await db.getRepository(Room).delete({ user });
});

describe('Load rooms', async () => {
    it('User can load their rooms', async () => {
        const room = fakeRoom();
        room.user = user;
        await db.getRepository(Room).save(room);

        const userRooms = await getRooms();

        expect(userRooms).toHaveLength(1);
        expect(userRooms[0].name).toEqual(room.name);
    });

    it('Returns empty list if user has no rooms', async () => {
        const userRooms = await getRooms();
        expect(userRooms).toHaveLength(0);
    });
});
