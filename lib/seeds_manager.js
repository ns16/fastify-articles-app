import prisma from './prisma.js'

export default class SeedsManager {
  static seeds = {
    users: [],
    articles: [],
    contents: [],
    tags: [],
    articles_tags: [],
    admins: []
  }

  static async getSeedsData() {
    const environment = process.env.NODE_ENV ?? 'development'
    for (const seedName of Object.keys(SeedsManager.seeds)) {
      try {
        const module = await import(`${process.cwd()}/prisma/seeds/${environment}/${seedName}.js`)
        SeedsManager.seeds[seedName].push(...module.default)
      } catch (error) {
        // Ignore cases when the file is not found
      }
    }
    return SeedsManager.seeds
  }

  static async run() {
    const seeds = await SeedsManager.getSeedsData()
    await prisma.user.createMany({ data: seeds.users })
    await prisma.article.createMany({ data: seeds.articles })
    await prisma.content.createMany({ data: seeds.contents })
    await prisma.tag.createMany({ data: seeds.tags })
    await Promise.all(seeds.articles_tags.map(item => prisma.article.update({
      where: {
        id: item.article_id
      },
      data: {
        tags: { connect: { id: item.tag_id } }
      }
    })))
    await prisma.admin.createMany({ data: seeds.admins })
  }

  static async revert() {
    await prisma.admin.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.content.deleteMany()
    await prisma.article.deleteMany()
    await prisma.user.deleteMany()
  }
}
