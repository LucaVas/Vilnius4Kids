import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import {
    fakePlayground,
    fakeUser,
} from '@server/entities/tests/fakes';
import { Playground, User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { rate } = router.createCaller(authContext({ db }, user));

describe('Rate playgrounds', async () => {
    it('User can rate an existing playground', async () => {
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

    it('Rating cannot be negative', async () => {
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
        await expect(
            rate({
                playgroundId: 100,
                rating: 1.5,
            })
        ).rejects.toThrow('Playground with ID [100] does not exist.');
    });
});
