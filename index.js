import buildFastify from './app.js'

const fastify = await buildFastify()
try {
  await fastify.listen({ port: process.env.PORT })
} catch (error) {
  fastify.log.error(error)
  process.exit(1)
}
