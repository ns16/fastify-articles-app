import { to } from 'await-to-js'
import bcrypt from 'bcrypt'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

import BaseController from './base_controller.js'
import prisma from './prisma.js'

class BaseAuthController extends BaseController {
  async register(request, reply) {
    await this.validateBody(request.body)
    const [error1, model] = await to(prisma[this.model].create({ data: request.body }))
    if (error1) throw new createError.InternalServerError(error1.message)
    const token = jwt.sign(model, process.env.JWT_KEY)
    reply.code(201).header('Token', token).send({ data: model })
  }

  async login(request, reply) {
    const { username, password } = request.body
    const [error1, model] = await to(prisma[this.model].findFirst({ where: { username } }))
    if (error1) throw new createError.InternalServerError(error1.message)
    if (!model) throw new createError.Unauthorized('Invalid username or password')
    const [error2, isValid] = await to(bcrypt.compare(password, model.password))
    if (error2) throw new createError.InternalServerError(error2.message)
    if (!isValid) throw new createError.Unauthorized('Invalid username or password')
    const token = jwt.sign(model, process.env.JWT_KEY)
    reply.header('Token', token).send({ data: model })
  }

  async me(request, reply) { // eslint-disable-line class-methods-use-this
    reply.send({ data: request.user })
  }
}

export default BaseAuthController
