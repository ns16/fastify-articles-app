import AdminsController from '../controllers/admins.js'
import AdminsSchemas from '../schemas/admins.js'
import verifyJwt from '../../lib/verify_jwt.js'

const controller = new AdminsController()

const AdminsRoutes = [
  {
    method: 'GET',
    url: '/api/v1/admins',
    schema: AdminsSchemas.index,
    preHandler: [verifyJwt],
    handler: (...args) => controller.index(...args)
  },
  {
    method: 'GET',
    url: '/api/v1/admins/all',
    schema: AdminsSchemas.all,
    preHandler: [verifyJwt],
    handler: (...args) => controller.all(...args)
  },
  {
    method: 'GET',
    url: '/api/v1/admins/:id',
    schema: AdminsSchemas.show,
    preHandler: [verifyJwt],
    handler: (...args) => controller.show(...args)
  },
  {
    method: 'POST',
    url: '/api/v1/admins',
    schema: AdminsSchemas.create,
    preHandler: [verifyJwt],
    handler: (...args) => controller.create(...args)
  },
  {
    method: 'PUT',
    url: '/api/v1/admins/:id',
    schema: AdminsSchemas.update,
    preHandler: [verifyJwt],
    handler: (...args) => controller.update(...args)
  },
  {
    method: 'DELETE',
    url: '/api/v1/admins/:id',
    schema: AdminsSchemas.destroy,
    preHandler: [verifyJwt],
    handler: (...args) => controller.destroy(...args)
  }
]

export default AdminsRoutes
