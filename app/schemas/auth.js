import { adminSchema } from './admins.js'

const AuthSchemas = {
  login: {
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
        }
      }
    }
  },
  me: {
    response: {
      200: {
        type: 'object',
        properties: {
          data: adminSchema
        }
      }
    }
  }
}

export default AuthSchemas
