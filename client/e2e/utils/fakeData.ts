import { Chance } from 'chance'

// Chance is a lightweight fake data generator.
// Faker.js is another popular library, but it is relatively slow to import.
// Also, if we are running tests in CI server, we want to use the same seed
// every time to make the tests deterministic.
export const random = process.env.CI ? Chance(1) : Chance()

export const fakeUser = () => ({
  email: random.email(),
  username: random.string(),
  password: 'Password123.',
})
