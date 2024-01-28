import { Chance } from 'chance';

export const random = process.env.CI ? Chance(1) : Chance();

export const fakeUser = () => ({
  email: random.email(),
  username: random.string(),
  password: 'Password123.',
  role: 'tester'
});

export const fakeAddress = () => ({
  street: random.string(),
  city: random.string(),
  number: random.integer({ min: 1, max: 999 }),
  zipCode: random.integer({ min: 10000, max: 99999 }),
  district: random.string(),
});

export const fakePlayground = () => ({
  isPrivate: false,
  isOpen: true,
  latitude: random.latitude({ min: -90, max: 90 }),
  longitude: random.longitude({ min: -180, max: 180 }),
  description: random.string(),
});

export const fakeReport = () => ({
  description: random.string(),
  status: 'open',
});

export const fakeReportCategory = () => ({
  name: random.string(),
  topic: random.string(),
  description: random.string(),
});
