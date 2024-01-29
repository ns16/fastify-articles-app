import verifyJwt from '../../lib/verify_jwt.js'
import UsersController from '../controllers/users.js'
import UsersSchemas from '../schemas/users.js'

const controller = new UsersController()

const UsersRoutes = [
  {
    method: 'GET',
    url: '/api/v1/users',
    schema: UsersSchemas.index,
    preHandler: [verifyJwt],
    handler: (...args) => controller.index(...args)
  },
  {
    method: 'GET',
    url: '/api/v1/users/all',
    schema: UsersSchemas.all,
    preHandler: [verifyJwt],
    handler: (...args) => controller.all(...args)
  },
  {
    method: 'GET',
    url: '/api/v1/users/:id',
    schema: UsersSchemas.show,
    preHandler: [verifyJwt],
    handler: (...args) => controller.show(...args)
  },
  {
    method: 'POST',
    url: '/api/v1/users',
    schema: UsersSchemas.create,
    preHandler: [verifyJwt],
    handler: (...args) => controller.create(...args)
  },
  {
    method: 'PUT',
    url: '/api/v1/users/:id',
    schema: UsersSchemas.update,
    preHandler: [verifyJwt],
    handler: (...args) => controller.update(...args)
  },
  {
    method: 'DELETE',
    url: '/api/v1/users/:id',
    schema: UsersSchemas.destroy,
    preHandler: [verifyJwt],
    handler: (...args) => controller.destroy(...args)
  }
]

export default UsersRoutes
