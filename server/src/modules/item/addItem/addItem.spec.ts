import { createTestDatabase } from '@tests/utils/database';
import { fakeItem, fakeRoom, fakeUser } from '@server/entities/tests/fakes';
import { Room, User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import itemRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { addItem } = itemRouter.createCaller(authContext({ db, ai }, user));

describe('Add item', async () => {
    it('User can add a new item', async () => {
        const room = await db.getRepository(Room).save(fakeRoom());
        const item = fakeItem({ id: 1, roomId: room.id });
        const addedItem = await addItem(item);

        expect(addedItem.id).toBe(item.id);
        expect(addedItem.room.id).toBe(room.id);
    });

    it('Throws error if room does not exist', async () => {

        await expect(addItem(fakeItem({ id: 1, roomId: 100 }))).rejects.toThrow(
            /Room with ID 100 does not exist./
        );
    });
});
