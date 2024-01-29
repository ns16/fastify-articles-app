import fastifyCors from '@fastify/cors'
import fastifyEnv from '@fastify/env'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import Fastify from 'fastify'
import createError from 'http-errors'
import qs from 'qs'

import routes from './app/routes/index.js'
import compileSchema from './lib/compile_schema.js'
import transformSpecification from './lib/transform_specification.js'
import swaggerConfig from './swagger.js'

async function buildFastify() {
  const fastify = Fastify({ // eslint-disable-line new-cap
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

  if (process.env.NODE_ENV !== 'test') {
    await fastify.register(fastifySwagger, swaggerConfig)
    await fastify.register(fastifySwaggerUI, {
      routePrefix: '/doc',
      uiConfig: {
        docExpansion: 'list'
      },
      uiHooks: {
        onRequest: (request, reply, next) => next(),
        preHandler: (request, reply, next) => next()
      },
      staticCSP: true,
      transformStaticCSP: header => header,
      transformSpecification: swaggerObject => transformSpecification(swaggerObject),
      transformSpecificationClone: true
    })
  }

  fastify.setValidatorCompiler(({ schema }) => compileSchema(schema))
  fastify.setErrorHandler(error => {
    if (error.code === 'FST_ERR_VALIDATION') {
      throw new createError.BadRequest(error.message)
    }
    return error
  })

  routes.forEach(route => fastify.route(route))

  if (process.env.NODE_ENV !== 'test') {
    await fastify.ready()
    fastify.swagger()
  }

  return fastify
}

export default buildFastify
