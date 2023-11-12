import AuthController from '../controllers/auth.js'
import AuthSchemas from '../schemas/auth.js'
import verifyJwt from '../../lib/verify_jwt.js'

const controller = new AuthController()

const AuthRoutes = [
  {
    method: 'POST',
    url: '/api/v1/auth/login',
    schema: AuthSchemas.login,
    handler: (...args) => controller.login(...args)
  },
  {
    method: 'GET',
    url: '/api/v1/auth/me',
    schema: AuthSchemas.me,
    preHandler: [verifyJwt],
    handler: (...args) => controller.me(...args)
  }
]

export default AuthRoutes
