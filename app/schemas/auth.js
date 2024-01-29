import { adminSchema } from './admins.js'
import { errorSchema } from '../../lib/base_schemas.js'

const AuthSchemas = {
  login: {
    summary: 'Login',
    security: [],
    body: {
      type: 'object',
      properties: {
        username: { type: 'string', minLength: 1, maxLength: 100 },
        password: { type: 'string', minLength: 6, maxLength: 50 }
      },
      required: [
        'username',
        'password'
      ],
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: adminSchema
        },
        required: ['data'],
        additionalProperties: false
      },
      400: { ...errorSchema },
      401: { ...errorSchema }
    },
    tags: ['Auth']
  },
  me: {
    summary: 'Get authorized admin',
    response: {
      200: {
        type: 'object',
        properties: {
          data: adminSchema
        },
        required: ['data'],
        additionalProperties: false
      },
      401: { ...errorSchema }
    },
    tags: ['Auth']
  }
}

export default AuthSchemas
