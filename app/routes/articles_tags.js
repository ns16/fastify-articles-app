import ArticlesTagsController from '../controllers/articles_tags.js'
import ArticlesTagsSchemas from '../schemas/articles_tags.js'
import verifyJwt from '../../lib/verify_jwt.js'

const controller = new ArticlesTagsController()

const ArticlesTagsRoutes = [
  {
    method: 'POST',
    url: '/api/v1/articles-tags',
    schema: ArticlesTagsSchemas.create,
    preHandler: [verifyJwt],
    handler: (...args) => controller.create(...args)
  },
  {
    method: 'DELETE',
    url: '/api/v1/articles-tags',
    schema: ArticlesTagsSchemas.destroy,
    preHandler: [verifyJwt],
    handler: (...args) => controller.destroy(...args)
  }
]

export default ArticlesTagsRoutes
