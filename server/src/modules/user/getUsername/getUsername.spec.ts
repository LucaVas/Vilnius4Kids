import { expect, it } from 'vitest';
import { createTestDatabase } from '@tests/utils/database';
import { User } from '@server/entities';
import { authContext } from '@tests/utils/context';
import { fakeUser } from '@server/entities/tests/fakes';
import router from '..';

const db = await createTestDatabase();


describe('Get username', async () => {
    it('User can retrieve their username', async () => {
        const user = await db.getRepository(User).save(fakeUser());
        const { getUsername } = router.createCaller(authContext({ db }, user));

        const { username } = await getUsername();
        expect(username).toBe(user.username);
        expect(username).not.toBeNull();
        expect(username).not.toBeUndefined();
    });

    it('Does not return a username if user does not exist', async () => {
        const user = db.getRepository(User).create(fakeUser());
        const { getUsername } = router.createCaller(authContext({ db }, user));
        await expect(getUsername()).rejects.toThrow(
            `User with ID ${user.id} does not exist.`
        );
    });
});
