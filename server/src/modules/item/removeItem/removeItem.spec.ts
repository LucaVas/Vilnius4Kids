import { createTestDatabase } from '@tests/utils/database';
import { fakeItem, fakeRoom, fakeUser } from '@server/entities/tests/fakes';
import { Item, Room, User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import itemRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { removeItem } = itemRouter.createCaller(authContext({ db, ai }, user));

describe('Remove item', async () => {
    it('User can remove an item from a room', async () => {
        const room = await db.getRepository(Room).save(fakeRoom());
        const item = await db.getRepository(Item).save(fakeItem({ room }));

        const { message } = await removeItem({ id: item.id });

        const updatedItem = await db
            .getRepository(Item)
            .findOneBy({ id: item.id });

        expect(updatedItem?.room).toBe(undefined);
        expect(item.room).not.toBe(undefined);
        expect(item.room).not.toEqual(updatedItem?.room);
        expect(message).toBe('Successfully remove 1 item from its room.');
    });

    it('Throws error if item does not exists', async () => {
        await expect(removeItem({ id: 100 })).rejects.toThrow(
            /Item with id 100 does not exist./
        );
    });
});
