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
            password: 'Password123.',
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
                password: 'Password123.',
            })
        ).rejects.toThrow(/email/);
    });

    it('Throws error if email already exists', async () => {
        await db
            .getRepository(User)
            .save({
                username: 'some-username-2',
                email: 'newtest@test.com',
                password: 'test123456',
            });

        await expect(
            signup({
                username: 'some-username-2',
                email: 'newtest@test.com',
                password: 'Password123.',
            })
        ).rejects.toThrow(
            'Email or username are already taken. Please, try different ones.'
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
            username: 'some-username-3',
            email: ' \t test@testmail.com\t   \t',
            password: 'Password123.',
        });

        expect(user).toHaveProperty('id');
    });

    it('Signup if email if uppercase', async () => {
        const user = await signup({
            username: 'some-username-4',
            email: 'TEST@TESTINGMAIL.COM',
            password: 'Password123.',
        });

        expect(user).toHaveProperty('id');
    });

    it('Verification token is created at signup and user is unregistered', async () => {
        const user = await signup({
            username: 'some-username-5',
            email: 'TEST@TESTINGMAIL1.COM',
            password: 'Password123.',
        });

        const signedUpUser = await db.getRepository(User).findOne({
            where: { id: user.id },
            relations: ['verificationToken'],
        });

        expect(signedUpUser?.verificationToken.token).not.toBe(null);
        expect(signedUpUser?.isRegistered).toBe(false);
    });
});
