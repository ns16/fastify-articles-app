import fastifyCors from '@fastify/cors'
import fastifyEnv from '@fastify/env'
import Fastify from 'fastify'
import createError from 'http-errors'
import qs from 'qs'

import routes from './app/routes/index.js'
import compileSchema from './lib/compile_schema.js'

async function buildFastify() {
  const fastify = Fastify({
    logger: process.env.NODE_ENV !== 'test',
    querystringParser: str => qs.parse(str)
  })

  await fastify.register(fastifyCors, { exposedHeaders: 'Token' })

  await fastify.register(fastifyEnv, {
    confKey: 'config',
    schema: {
      type: 'object',
      properties: {
        DATABASE_URL: { type: 'string' },
        PORT: { type: 'integer', default: 3333 },
        JWT_KEY: { type: 'string' }
      },
      required: [
        'DATABASE_URL',
        'JWT_KEY'
      ],
      additionalProperties: false
    },
    data: process.env
  })

  fastify.setValidatorCompiler(({ schema }) => compileSchema(schema))
  fastify.setErrorHandler(error => {
    if (error.code === 'FST_ERR_VALIDATION') {
      throw new createError.BadRequest(error.message)
    }
    return error
  })

  routes.forEach(route => fastify.route(route))

  return fastify
}

export default buildFastify
