import { createTestDatabase } from '@tests/utils/database';
import { fakeItem, fakeRoom, fakeUser } from '@server/entities/tests/fakes';
import { Item, Room, User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import itemRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { removeRoom } = itemRouter.createCaller(authContext({ db, ai }, user));

describe("Remove an item's room", async () => {
    it("User can remove an item's room", async () => {
        const room = await db.getRepository(Room).save(fakeRoom());
        const oldItem = await db.getRepository(Item).save(fakeItem({ room }));
        expect(oldItem.room).toBe(room);

        const itemWithoutRoom = await removeRoom({
            id: oldItem.id,
        });

        expect(itemWithoutRoom.name).toBe(oldItem.name);
        expect(itemWithoutRoom.room).toBe(null);
    });

    it('Throws an error if item does not exist', async () => {
        const newItem = fakeItem({ id: 100, roomId: 1 });

        await expect(removeRoom(newItem)).rejects.toThrow(
            /Item with id 100 does not exist./
        );
    });
});
