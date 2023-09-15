import { to } from 'await-to-js'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

import prisma from './prisma.js'

export default (request, reply, done) => {
  jwt.verify(request.headers.authorization, process.env.JWT_KEY, async (err, decoded) => {
    if (err || !decoded) return done(new createError.Unauthorized('Invalid token'))
    const [error, user] = await to(prisma.admin.findFirst({ where: { id: decoded.id, username: decoded.username } }))
    if (error) return done(new createError.InternalServerError(error.message))
    if (!user) return done(new createError.Unauthorized('Invalid token'))
    request.user = user
    done()
  })
}
