import { random } from '@tests/utils/random';
import {
    Address,
    Playground,
    Report,
    User,
} from '..';

const randomId = () => random.integer({ min: 1, max: 2147483647 });

export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
    id: randomId(),
    username: random.string(),
    email: random.email(),
    password: 'Password.123!',
    role: 'user',
    ...overrides,
});

export const fakeAddress = <T extends Partial<Address>>(overrides: T = {} as T) => ({
    id: randomId(),
    street: random.string(),
    city: random.string(),
    number: random.integer({ min: 1, max: 999 }),
    zipCode: random.integer({ min: 10000, max: 99999 }),
    ...overrides,
});

export const fakePlayground = <T extends Partial<Playground>>(
    overrides: T = {} as T
) => ({
    id: randomId(),
    isPrivate: false,
    isOpen: true,
    ...overrides,
});

export const fakeReport = <T extends Partial<Report>>(
    overrides: T = {} as T
) => ({
    id: randomId(),
    description: random.string(),
    status: 'open',
    ...overrides,
});
