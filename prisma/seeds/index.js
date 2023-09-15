import prisma from '../../lib/prisma.js'

import Users from './users.js'
import Articles from './articles.js'
import Contents from './contents.js'
import Tags from './tags.js'
import ArticlesTags from './articles_tags.js'
import Admins from './admins.js'

async function main() {
  await prisma.admin.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.content.deleteMany()
  await prisma.article.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.createMany({ data: Users })
  await prisma.article.createMany({ data: Articles })
  await prisma.content.createMany({ data: Contents })
  await prisma.tag.createMany({ data: Tags })
  await Promise.all(ArticlesTags.map(item => prisma.article.update({
    where: { id: item.article_id },
    data: { tags: { connect: { id: item.tag_id } } }
  })))
  await prisma.admin.createMany({ data: Admins })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async error => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
