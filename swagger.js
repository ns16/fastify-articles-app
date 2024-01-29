import { adminSchema } from './app/schemas/admins.js'
import { articleSchema } from './app/schemas/articles.js'
import { articleWithTagsSchema } from './app/schemas/articles_tags.js'
import { contentSchema } from './app/schemas/contents.js'
import { tagSchema } from './app/schemas/tags.js'
import { userSchema } from './app/schemas/users.js'
import { errorSchema, paginationSchema } from './lib/base_schemas.js'

export default {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Fastify Articles App',
      description: 'RESTful API with Fastify and Prisma ORM',
      version: '1.0.0'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Dev Server'
      }
    ],
    components: {
      schemas: {
        User: userSchema,
        Article: articleSchema,
        Content: contentSchema,
        Tag: tagSchema,
        ArticleWithTags: articleWithTagsSchema,
        Admin: adminSchema,
        Pagination: paginationSchema,
        Error: errorSchema
      },
      securitySchemes: {
        JWTAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    },
    security: [
      { JWTAuth: [] }
    ],
    tags: [
      { name: 'Auth' },
      { name: 'Users' },
      { name: 'Articles' },
      { name: 'Contents' },
      { name: 'Tags' },
      { name: 'Articles-Tags' },
      { name: 'Admins' }
    ]
  }
}
