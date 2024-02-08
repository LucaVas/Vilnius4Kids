import { createTestDatabase } from '@tests/utils/database';
import { User } from '@server/entities';
import { fakeUser } from '@server/entities/tests/fakes';
import { Role } from '@server/entities/user/Role';
import { authContext } from '@tests/utils/context';
import router from '..';

const db = await createTestDatabase();

describe('Get user verification', async () => {
    it('Return true if user is verified', async () => {
        // Given
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER, isRegistered: true }));
        const { isUserVerified } = router.createCaller(
            authContext({ db }, user)
        );

        // WHEN
        const { isVerified } = await isUserVerified();

        // THEN
        expect(isVerified).toBe(true);
    });

    it('Return true if user is admin', async () => {
        // Given
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.ADMIN, isRegistered: false }));
        const { isUserVerified } = router.createCaller(
            authContext({ db }, user)
        );

        // WHEN
        const { isVerified } = await isUserVerified();

        // THEN
        expect(isVerified).toBe(true);
    });

    it('Return true if user is tester', async () => {
        // Given
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.TESTER, isRegistered: false }));
        const { isUserVerified } = router.createCaller(
            authContext({ db }, user)
        );

        // WHEN
        const { isVerified } = await isUserVerified();

        // THEN
        expect(isVerified).toBe(true);
    });

    it('Return false if user is not verified', async () => {
        // Given
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER, isRegistered: false }));
        const { isUserVerified } = router.createCaller(
            authContext({ db }, user)
        );

        // WHEN
        const { isVerified } = await isUserVerified();

        // THEN
        expect(isVerified).toBe(false);
    });

    it('Throws error if user does not exist', async () => {
        const notSavedUser = db
            .getRepository(User)
            .create(fakeUser({ role: Role.USER }));
        const { isUserVerified } = router.createCaller(
            authContext({ db }, notSavedUser)
        );

        await expect(isUserVerified()).rejects.toThrow(
            `User with ID ${notSavedUser.id} does not exist`
        );
    });
});
