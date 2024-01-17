import { random } from '@tests/utils/random';
import { Category, Item, Message, User } from '..';
import { Room } from '../room/room';

const randomId = () => random.integer({ min: 1, max: 2147483647 });

export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
    id: randomId(),
    email: random.email(),
    password: 'Password.123!',
    ...overrides,
});

export const fakeMessage = <T extends Partial<Message>>(overrides: T = {} as T) => ({
    id: randomId(),
    role: 'user',
    content: random.string(),
    ...overrides,
});

export const fakeItem = <T extends Partial<Item>>(overrides: T = {} as T) => ({
    id: randomId(),
    name: random.string(),
    description: 'This is a description',
    imageUrl: 'http://www.example.com',
    price: random.integer({ min: 0, max: 999 }),
    width: random.integer({ min: 1, max: 999 }),
    length: random.integer({ min: 1, max: 999 }),
    x: random.integer({ min: 1, max: 1000 }),
    y: random.integer({ min: 1, max: 1000 }),
    ...overrides,
});

export const fakeRoom = <T extends Partial<Room>>(overrides: T = {} as T) => ({
    id: randomId(),
    name: random.string(),
    width: random.integer({ min: 0.01, max: 50 }),
    length: random.integer({ min: 0.01, max: 50 }),
    area: 0.0,
    ...overrides,
});

export const fakeCategory = <T extends Partial<Category>>(
    overrides: T = {} as T
) => ({
    id: randomId(),
    name: random.string(),
    ...overrides,
});
