import { faker } from '@faker-js/faker'

const ContentsSeed = []

for (let id = 1; id <= 20; id++) {
  ContentsSeed.push({
    id,
    article_id: id,
    body: faker.lorem.paragraphs(),
    created_at: new Date(),
    updated_at: new Date()
  })
}

export default ContentsSeed
