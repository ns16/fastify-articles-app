import buildFastify from '../../app.js'
import CommandManager from '../../lib/command_manager.js'

import { getAuthorization } from './helpers.js'

let fastify
let authorization

export const describe = (description, t, cb) => {
  if (!t.parent) {
    t.before(async () => {
      await CommandManager.run('npm run migrate')
      await CommandManager.run('npm run db:seed')
      fastify = await buildFastify()
      authorization = await getAuthorization()
    })
  }

  t.test(description, t => {
    cb(t, fastify, authorization)
    t.end()
  })

  if (!t.parent) {
    t.after(() => fastify?.close())
  }
}
