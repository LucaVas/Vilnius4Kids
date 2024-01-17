import { createTestDatabase } from '@tests/utils/database';
import { fakeItem, fakeRoom, fakeUser } from '@server/entities/tests/fakes';
import { Item, Room, User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import roomRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { loadRoom } = roomRouter.createCaller(authContext({ db, ai }, user));

afterEach(async () => {
    await db.getRepository(Room).delete({ user });
});

describe('Load room', async () => {
    it('User can load a room and its items', async () => {
        const item = await db.getRepository(Item).save(fakeItem());
        const room = await db
            .getRepository(Room)
            .save(fakeRoom({ items: [item], user }));

        const loadedRoom = await loadRoom({ id: room.id });

        expect(loadedRoom).not.toBeNull();
        expect(loadedRoom?.items).toHaveLength(1);
    });

    it('Returns empty items if room has none', async () => {
        const room = await db
            .getRepository(Room)
            .save(fakeRoom({ user }));

        const loadedRoom = await loadRoom({ id: room.id });

        expect(loadedRoom?.items).toHaveLength(0);
    });
});
