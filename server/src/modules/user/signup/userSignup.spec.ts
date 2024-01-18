import { createTestDatabase } from '@tests/utils/database';
import { User } from '@server/entities';
import userRouter from '..';

const db = await createTestDatabase();
const { signup } = userRouter.createCaller({ db } as any);


describe('Signup', async () => {
    it('Signs user up with valid credentials', async () => {
        const user = await signup({
          username: 'some-username',
          email: 'test@test.com',
          password: 'test123456',
        });

        const userFound = await db
            .getRepository(User)
            .findOneBy({ email: 'test@test.com' });

        expect(userFound).not.toBe(null);
        expect(userFound?.id).toBe(user.id);
    });

    it('Throws error with invalid email', async () => {
        await expect(
          signup({
            username: 'some-username',
            email: 'not-an-email',
            password: 'some-password',
          })
        ).rejects.toThrow(/email/);
    });

    it('Throws error if email already exists', async () => {

        await db
            .getRepository(User)
            .save({ email: 'newtest@test.com', password: 'test123456' });

        await expect(
          signup({
            username: 'some-username',
            email: 'newtest@test.com',
            password: 'some-password',
          })
        ).rejects.toThrow(
          /Email newtest@test.com is already taken, please try another./
        );
    });

    it('Throws error with invalid password', async () => {
        await expect(
          signup({
            username: 'some-username',
            email: 'test@test.com',
            password: 'some',
          })
        ).rejects.toThrow(/password/);
    });

    it('Signup if email has trailing spaces', async () => {
        const user = await signup({
          username: 'some-username',
          email: ' \t test@mail.com\t   \t',
          password: 'some-password',
        });

        expect(user).toHaveProperty('email', 'test@mail.com');
    });

    it('Signup if email if uppercase', async () => {
        const user = await signup({
            username: 'some-username',
            email: 'TEST@TESTING.COM', 
            password: 'some-password',
        });

        expect(user).toHaveProperty('email', 'test@testing.com');
    });
});
