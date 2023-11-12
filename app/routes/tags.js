import TagsController from '../controllers/tags.js'
import TagsSchemas from '../schemas/tags.js'
import verifyJwt from '../../lib/verify_jwt.js'

const controller = new TagsController()

const TagsRoutes = [
  {
    method: 'GET',
    url: '/api/v1/tags',
    schema: TagsSchemas.index,
    preHandler: [verifyJwt],
    handler: (...args) => controller.index(...args)
  },
  {
    method: 'GET',
    url: '/api/v1/tags/all',
    schema: TagsSchemas.all,
    preHandler: [verifyJwt],
    handler: (...args) => controller.all(...args)
  },
  {
    method: 'GET',
    url: '/api/v1/tags/:id',
    schema: TagsSchemas.show,
    preHandler: [verifyJwt],
    handler: (...args) => controller.show(...args)
  },
  {
    method: 'POST',
    url: '/api/v1/tags',
    schema: TagsSchemas.create,
    preHandler: [verifyJwt],
    handler: (...args) => controller.create(...args)
  },
  {
    method: 'PUT',
    url: '/api/v1/tags/:id',
    schema: TagsSchemas.update,
    preHandler: [verifyJwt],
    handler: (...args) => controller.update(...args)
  },
  {
    method: 'DELETE',
    url: '/api/v1/tags/:id',
    schema: TagsSchemas.destroy,
    preHandler: [verifyJwt],
    handler: (...args) => controller.destroy(...args)
  }
]

export default TagsRoutes
