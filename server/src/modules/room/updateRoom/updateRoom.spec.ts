import { createTestDatabase } from '@tests/utils/database';
import { fakeRoom, fakeUser } from '@server/entities/tests/fakes';
import { Room, User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import roomRouter from '..';

const db = await createTestDatabase();
const ai = {} as any;
const user = await db.getRepository(User).save(fakeUser());
const { updateRoom } = roomRouter.createCaller(authContext({ db, ai }, user));

describe('Update room', async () => {
    it('User can update new room', async () => {
        const room = fakeRoom({ id: 2, length: 5 });
        await db.getRepository(Room).save(room);

        const updatedRoom = await updateRoom({
            id: 1,
            length: 10,
        });

        expect(room.id).toEqual(updatedRoom.id);
        expect(room.length).not.toEqual(updatedRoom.length);
        expect(room.length).toBe(5);
        expect(updatedRoom.length).toBe(10);
    });

    it('Throws error if width or length are negative', async () => {

        const room = fakeRoom({ id: 14, length: 5 });
        await db.getRepository(Room).save(room);

        await expect(
            updateRoom({
                id: 14,
                length: 0,
            })
        ).rejects.toThrow(/Length cannot be 0 or a negative number./);

        await expect(
            updateRoom({
                id: 14,
                width: 0.0,
            })
        ).rejects.toThrow(/Width cannot be 0 or a negative number./);
    });

    it('Throws error if name is too short', async () => {
        const room = fakeRoom({ id: 5, name: 'Valid name here.' });
        await db.getRepository(Room).save(room);

        await expect(
            updateRoom({
                id: 5,
                name: '',
            })
        ).rejects.toThrow(/Room name must be at least 2 characters long./);
    });

    it('Throws error if room does not exist', async () => {

        await expect(
            updateRoom({
                id: 5,
                name: 'Valid name of non existing room',
            })
        ).rejects.toThrow(/Room with id 5 not found./);
    });
});
