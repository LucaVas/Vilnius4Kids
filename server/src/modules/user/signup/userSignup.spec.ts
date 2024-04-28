import { createTestDatabase } from '@tests/utils/database';
import { User } from '@server/entities';
import userRouter from '..';
import { accountVerificationProducer } from '.';

const db = await createTestDatabase();
const { signup } = userRouter.createCaller({ db } as any);

describe('Signup', async () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('Signs user up with valid credentials', async () => {
        const spy = vi.spyOn(accountVerificationProducer, 'push');
        spy.mockImplementationOnce(() => Promise.resolve(true));

        const user = await signup({
            username: 'some_username',
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
        await db.getRepository(User).save({
            username: 'some_username_2',
            email: 'newtest@test.com',
            password: 'test123456',
        });

        await expect(
            signup({
                username: 'some_username_2',
                email: 'newtest@test.com',
                password: 'Password123.',
            })
        ).rejects.toThrow(
            'Email or username are already taken. Please, try different ones.'
        );
    });

    it('Throws error with invalid password', async () => {
        const spy = vi.spyOn(accountVerificationProducer, 'push');
        spy.mockImplementationOnce(() => Promise.resolve(true));

        await expect(
            signup({
                username: 'some_username',
                email: 'test@test.com',
                password: 'some',
            })
        ).rejects.toThrow(/password/);
    });

    it('Signup if email has trailing spaces', async () => {
        const spy = vi.spyOn(accountVerificationProducer, 'push');
        spy.mockImplementationOnce(() => Promise.resolve(true));

        const user = await signup({
            username: 'some_username_3',
            email: ' \t test@testmail.com\t   \t',
            password: 'Password123.',
        });

        expect(user).toHaveProperty('id');
    });

    it('Signup if email if uppercase', async () => {
        const spy = vi.spyOn(accountVerificationProducer, 'push');
        spy.mockImplementationOnce(() => Promise.resolve(true));

        const user = await signup({
            username: 'some_username_4',
            email: 'TEST@TESTINGMAIL.COM',
            password: 'Password123.',
        });

        expect(user).toHaveProperty('id');
    });

    it('Throws error with invalid username', async () => {
        await expect(
            signup({
                username: '<br>   <br>',
                email: 'test@test.com',
                password: 'some',
            })
        ).rejects.toThrow(/Username must start with a letter/);
    });

    it('Throws error with short username', async () => {
        await expect(
            signup({
                username: 'a',
                email: 'test@test.com',
                password: 'some',
            })
        ).rejects.toThrow(/Username must start with a letter/);
    });

    it('Throws error with invalid username', async () => {
        await expect(
            signup({
                username:
                    'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
                email: 'test@test.com',
                password: 'some',
            })
        ).rejects.toThrow(/Username must start with a letter/);
    });

    it('Verification token is created at signup and user is unregistered', async () => {
        const spy = vi.spyOn(accountVerificationProducer, 'push');
        spy.mockImplementationOnce(() => Promise.resolve(true));

        const user = await signup({
            username: 'some_username_5',
            email: 'TEST@TESTINGMAIL1.COM',
            password: 'Password123.',
        });

        expect(spy).toHaveBeenCalledTimes(1);

        const signedUpUser = await db.getRepository(User).findOneBy({
            id: user.id,
        });

        expect(signedUpUser).not.toBe(null);
        expect(signedUpUser!.isRegistered).toBe(false);
    });
});
