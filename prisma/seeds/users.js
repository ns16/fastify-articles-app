import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

const UsersSeed = []

for (let id = 1; id <= 10; id++) {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  UsersSeed.push({
    id,
    name: faker.person.fullName({ firstName, lastName }),
    username: faker.internet.userName({ firstName, lastName }),
    password: bcrypt.hashSync('123456', 12),
    email: faker.internet.email({ firstName, lastName }),
    created_at: new Date(),
    updated_at: new Date()
  })
}

export default UsersSeed
