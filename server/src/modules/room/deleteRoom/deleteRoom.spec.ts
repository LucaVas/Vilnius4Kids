import { createTestDatabase } from '@tests/utils/database';
import { fakeItem, fakeRoom, fakeUser } from '@server/entities/tests/fakes';
import { Item, Room, User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import roomRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { deleteRoom } = roomRouter.createCaller(authContext({ db, ai }, user));

describe('Delete room', async () => {
    it('User can delete a room', async () => {
        const room = fakeRoom({ id: 1, length: 5 });
        await db.getRepository(Room).save(room);

        const { message } = await deleteRoom({ id: 1 });

        expect(message).toBe('Room with ID 1 deleted successfully.');
    });

    it('User can delete all items in room if room is deleted', async () => {
        const item = await db
            .getRepository(Item)
            .save(fakeItem({ name: 'Item in room 1' }));
        const room = await db
            .getRepository(Room)
            .save(fakeRoom({ id: 2, length: 5, items: [item] }));

        const { message } = await deleteRoom({ id: room.id });
        expect(message).toBe('Room with ID 2 deleted successfully.');

        const items = await db
            .getRepository(Item)
            .findBy({ name: 'Item in room 1' });
        expect(items).toEqual([]);
    });

    it('Throws error if room does not exist', async () => {
        await expect(deleteRoom({ id: 5 })).rejects.toThrow(
            /Room with id 5 not found./
        );
    });
});
