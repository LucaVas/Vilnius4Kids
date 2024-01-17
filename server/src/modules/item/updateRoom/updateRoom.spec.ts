import { createTestDatabase } from '@tests/utils/database';
import { fakeItem, fakeRoom, fakeUser } from '@server/entities/tests/fakes';
import { Item, Room, User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import itemRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { updateRoom } = itemRouter.createCaller(authContext({ db, ai }, user));

describe("Update an item's room", async () => {
    it("User can update an item's room", async () => {
        const oldItem = await db.getRepository(Item).save(fakeItem());

        expect(oldItem.room).toBe(undefined);

        const newRoom = await db
            .getRepository(Room)
            .save(fakeRoom({ name: 'New room' }));

        const itemWithNewRoom = await updateRoom({
            id: oldItem.id,
            roomId: newRoom.id,
        });

        expect(itemWithNewRoom.name).toBe(oldItem.name);
        expect(itemWithNewRoom.description).toBe(oldItem.description);
        expect(itemWithNewRoom.room).not.toBe(oldItem.room);
    });

    it('Throws an error if room does not exist', async () => {
        const newItem = fakeItem({ id: 1, roomId: 100 });

        await expect(updateRoom(newItem)).rejects.toThrow(
            /Room with id 100 does not exist./
        );
    });

    it('Throws an error if item does not exist', async () => {
        const newItem = fakeItem({ id: 100, roomId: 1 });

        await expect(updateRoom(newItem)).rejects.toThrow(
            /Item with id 100 does not exist./
        );
    });
});
