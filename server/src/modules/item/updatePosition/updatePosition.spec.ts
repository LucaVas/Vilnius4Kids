import { createTestDatabase } from '@tests/utils/database';
import { fakeItem, fakeRoom, fakeUser } from '@server/entities/tests/fakes';
import { Item, Room, User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import itemRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { updatePosition } = itemRouter.createCaller(authContext({ db, ai }, user));

describe('Remove item', async () => {
    it('User can update an item position', async () => {
        const room = await db.getRepository(Room).save(fakeRoom());
        await db.getRepository(Item).save(fakeItem({ id: 1, roomId: room.id }));

        const { item } = await updatePosition({ id: 1, x: 10, y: 20 });

        expect(item.x).toBe(10);
        expect(item.y).toBe(20);
    });

    it('Throws error if item does not exists', async () => {
        await expect(
            updatePosition({ id: 10, x: 10, y: 20 })
        ).rejects.toThrowError('Item with id 10 does not exist.');
    });

    it('Throws error if position is invalid', async () => {
        await expect(
            updatePosition({ id: 1, x: -1, y: 2 })
        ).rejects.toThrowError(/Coordinate X must be positive./);

        await expect(
            updatePosition({ id: 1, x: 1, y: -2 })
        ).rejects.toThrowError(/Coordinate Y must be positive./);
    });
});
