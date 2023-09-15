import { faker } from '@faker-js/faker'

const ArticlesTagsSeed = []

for (let articleId = 1; articleId <= 20; articleId++) {
  const tagIds = faker.helpers.arrayElements([1, 2, 3, 4, 5], 3)
  for (const tagId of tagIds) {
    ArticlesTagsSeed.push({
      article_id: articleId,
      tag_id: tagId
    })
  }
}

export default ArticlesTagsSeed
