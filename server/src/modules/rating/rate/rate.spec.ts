import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { fakePlayground, fakeUser } from '@server/entities/tests/fakes';
import { Playground, Rating, User } from '@server/entities';
import { Role } from '@server/entities/user/Role';
import router from '..';

const db = await createTestDatabase();

describe('Rate playgrounds', async () => {
    it('User can rate an existing playground', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER, isRegistered: true }));
        const { rate } = router.createCaller(authContext({ db }, user));

        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());
        const { message, newRating } = await rate({
            playgroundId: playground.id,
            rating: 1.5,
        });

        const rated = await db
            .getRepository(Playground)
            .createQueryBuilder('playground')
            .leftJoinAndSelect('playground.ratings', 'ratings')
            .where('playground.id = :id', { id: playground.id })
            .getOne();

        expect(message).toEqual('Playground rated successfully.');
        expect(newRating).toEqual(1.5);
        expect(rated!.ratings[0].rating).toEqual(1.5);
    });

    it('User can rate again an existing playground, and rate is one', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER, isRegistered: true }));
        const { rate } = router.createCaller(authContext({ db }, user));

        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());
        const oldRate = await db.getRepository(Rating).save({
            playground,
            user,
            rating: 5,
        });

        const { message, newRating } = await rate({
            playgroundId: playground.id,
            rating: 2.5,
        });

        const rated = await db
            .getRepository(Playground)
            .createQueryBuilder('playground')
            .leftJoinAndSelect('playground.ratings', 'ratings')
            .where('playground.id = :id', { id: playground.id })
            .getOne();

        expect(message).toEqual('Playground rated successfully.');
        expect(newRating).toEqual(2.5);
        expect(rated!.ratings.length).toEqual(1);
        expect(rated!.ratings[0].rating).not.toEqual(oldRate.rating);
        expect(rated!.ratings[0].rating).toEqual(2.5);
    });

    it('Rating cannot be negative', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER, isRegistered: true }));
        const { rate } = router.createCaller(authContext({ db }, user));

        const playground = await db
            .getRepository(Playground)
            .save(fakePlayground());
        await expect(
            rate({
                playgroundId: playground.id,
                rating: -2,
            })
        ).rejects.toThrow(/Rating must be positive./);
    });

    it('User cannot rate a non existing playground', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER, isRegistered: true }));
        const { rate } = router.createCaller(authContext({ db }, user));

        await expect(
            rate({
                playgroundId: 100,
                rating: 1.5,
            })
        ).rejects.toThrow('Playground with ID [100] does not exist.');
    });

    it('Unverified user cannot rate an existing playground', async () => {
        const user = await db
            .getRepository(User)
            .save(fakeUser({ role: Role.USER, isRegistered: false }));
        const { rate } = router.createCaller(authContext({ db }, user));

        await expect(
            rate({
                playgroundId: 100,
                rating: 1.5,
            })
        ).rejects.toThrow(
            'Only verified users have permission to access this resource.'
        );
    });

    it('Playground cannot be rated if user does not exists', async () => {
        const user = db
            .getRepository(User)
            .create(fakeUser({ role: Role.USER, isRegistered: true }));
        const { rate } = router.createCaller(authContext({ db }, user));

        await expect(rate({ playgroundId: 1, rating: 1.5 })).rejects.toThrow(
            `User with ID [${user.id}] does not exist.`
        );
    });
});
