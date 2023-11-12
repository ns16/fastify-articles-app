import ArticlesController from '../controllers/articles.js'
import ArticlesSchemas from '../schemas/articles.js'
import verifyJwt from '../../lib/verify_jwt.js'

const controller = new ArticlesController()

const ArticlesRoutes = [
  {
    method: 'GET',
    url: '/api/v1/articles',
    schema: ArticlesSchemas.index,
    preHandler: [verifyJwt],
    handler: (...args) => controller.index(...args)
  },
  {
    method: 'GET',
    url: '/api/v1/articles/all',
    schema: ArticlesSchemas.all,
    preHandler: [verifyJwt],
    handler: (...args) => controller.all(...args)
  },
  {
    method: 'GET',
    url: '/api/v1/articles/:id',
    schema: ArticlesSchemas.show,
    preHandler: [verifyJwt],
    handler: (...args) => controller.show(...args)
  },
  {
    method: 'POST',
    url: '/api/v1/articles',
    schema: ArticlesSchemas.create,
    preHandler: [verifyJwt],
    handler: (...args) => controller.create(...args)
  },
  {
    method: 'PUT',
    url: '/api/v1/articles/:id',
    schema: ArticlesSchemas.update,
    preHandler: [verifyJwt],
    handler: (...args) => controller.update(...args)
  },
  {
    method: 'DELETE',
    url: '/api/v1/articles/:id',
    schema: ArticlesSchemas.destroy,
    preHandler: [verifyJwt],
    handler: (...args) => controller.destroy(...args)
  }
]

export default ArticlesRoutes
