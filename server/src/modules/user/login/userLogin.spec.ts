import { expect, it } from 'vitest';
import { createTestDatabase } from '@tests/utils/database';
import { User } from '@server/entities';
import bcrypt from 'bcrypt';
import userRouter from '..';
import { getUserIdFromToken } from '../tokenPayload';

const db = await createTestDatabase();
const { login } = userRouter.createCaller({ db } as any);

beforeAll(async () => {
    await db.getRepository(User).save({
        username: 'test-username',
        email: 'test@test.com',
        password: await bcrypt.hash('test123456', 10),
    });
});

describe('User login', async () => {
    it('User can log in with valid credentials', async () => {
        const { id, token } = await login({
            email: 'test@test.com',
            password: 'test123456',
        });

        expect(id).toBe(1);
        expect(token.slice(0, 3)).toEqual('eyJ');
    });

    it('Returns a token with id', async () => {
        const { token } = await login({
            email: 'test@test.com',
            password: 'test123456',
        });

        expect(getUserIdFromToken(token)).toEqual(1);
    });

    it('User can log in if email has trailing spaces', async () => {
        const { id } = await login({
            email: ' \t test@test.com\t   \t',
            password: 'test123456',
        });

        expect(id).toBe(1);
    });

    it('User cannot log in with invalid credentials', async () => {
        await expect(
            login({
                email: 'test@test.com',
                password: 'test12345',
            })
        ).rejects.toThrow(/Invalid password./);
    });

    it('Forbids login if user does not exist', async () => {
        await expect(
            login({
                email: 'user@notexist.com',
                password: 'test12345',
            })
        ).rejects.toThrow('User with email user@notexist.com does not exist.');
    });
});
