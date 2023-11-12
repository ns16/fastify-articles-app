import ContentsController from '../controllers/contents.js'
import ContentsSchemas from '../schemas/contents.js'
import verifyJwt from '../../lib/verify_jwt.js'

const controller = new ContentsController()

const ContentsRoutes = [
  {
    method: 'GET',
    url: '/api/v1/contents',
    schema: ContentsSchemas.index,
    preHandler: [verifyJwt],
    handler: (...args) => controller.index(...args)
  },
  {
    method: 'GET',
    url: '/api/v1/contents/all',
    schema: ContentsSchemas.all,
    preHandler: [verifyJwt],
    handler: (...args) => controller.all(...args)
  },
  {
    method: 'GET',
    url: '/api/v1/contents/:id',
    schema: ContentsSchemas.show,
    preHandler: [verifyJwt],
    handler: (...args) => controller.show(...args)
  },
  {
    method: 'POST',
    url: '/api/v1/contents',
    schema: ContentsSchemas.create,
    preHandler: [verifyJwt],
    handler: (...args) => controller.create(...args)
  },
  {
    method: 'PUT',
    url: '/api/v1/contents/:id',
    schema: ContentsSchemas.update,
    preHandler: [verifyJwt],
    handler: (...args) => controller.update(...args)
  },
  {
    method: 'DELETE',
    url: '/api/v1/contents/:id',
    schema: ContentsSchemas.destroy,
    preHandler: [verifyJwt],
    handler: (...args) => controller.destroy(...args)
  }
]

export default ContentsRoutes
