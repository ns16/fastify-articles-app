import { faker } from '@faker-js/faker'

const ArticlesSeed = []

for (let id = 1; id <= 20; id++) {
  ArticlesSeed.push({
    id,
    user_id: Math.ceil(id / 2),
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    status: 'published',
    created_at: new Date(),
    updated_at: new Date()
  })
}

export default ArticlesSeed
