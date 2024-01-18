import { random } from '@tests/utils/random';
import { Address, Playground, Rating, Report, ReportStatusChangeLog, User } from '..';
const randomId = () => random.integer({ min: 1, max: 2147483647 });

export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  username: random.string(),
  email: random.email(),
  password: 'Password.123!',
  ...overrides,
});

export const fakeAddress = <T extends Partial<Address>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  street: random.string(),
  city: random.string(),
  state: random.string(),
  zip: random.string(),
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

export const fakeRating = <T extends Partial<Rating>>(overrides: T = {} as T) => ({
  id: randomId(),
  rating: random.integer({ min: 0.1, max: 5 }),
  votes: random.integer({ min: 1, max: 5000 }),
  ...overrides,
});

export const fakeReport = <T extends Partial<Report>>(overrides: T = {} as T) => ({
    id: randomId(),
    description: random.string(),
    status: 'open',
    ...overrides,
})

export const fakeChangeLog = <T extends Partial<ReportStatusChangeLog>>(overrides: T = {} as T) => ({
    id: randomId(),
    status: 'open',
    changeStatusMessage: random.string(),
    ...overrides,
})