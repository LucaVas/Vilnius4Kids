import { createTestDatabase } from '@tests/utils/database';
import { fakeRoom, fakeUser } from '@server/entities/tests/fakes';
import { User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import roomRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { createRoom } = roomRouter.createCaller(authContext({ db, ai }, user));

describe('Create room', async () => {
    it('User can create a new room', async () => {
        const room = fakeRoom();
        const newRoom = await createRoom(room);

        expect(newRoom.id).toBe(1);
        expect(room.area).toBe(0.0);
        expect(newRoom.area).toBe(room.length * room.width);
    });

    it('Throws error if width or length are negative', async () => {
        await expect(
            createRoom({
                name: 'new room',
                width: 0.0,
                length: 0.5,
                area: 0.0,
            })
        ).rejects.toThrow(/Width cannot be 0 or a negative number./);

        await expect(
            createRoom({
                name: 'new room',
                width: 0.5,
                length: 0.0,
                area: 0.0,
            })
        ).rejects.toThrow(/Length cannot be 0 or a negative number./);
    });

    it('Throws error if name is too short', async () => {
        await expect(
            createRoom({
                name: '',
                width: 1,
                length: 1,
                area: 0.0,
            })
        ).rejects.toThrow(/Room name must be at least 2 characters long./);
    })
});
