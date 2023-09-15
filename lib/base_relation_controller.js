import { to } from 'await-to-js'
import createError from 'http-errors'

import prisma from './prisma.js'

class BaseRelationController {
  constructor() {
    this.main = { model: null, modelName: null, field: null }
    this.relation = { modelName: null, field: null }
    this.relationship = null
  }

  async create(request, reply) {
    const mainId = request.body[this.main.field]
    const relationId = request.body[this.relation.field]
    const [error, model] = await to(prisma[this.main.model].update({
      where: { id: mainId },
      data: { [this.relationship]: { connect: { id: relationId } } },
      include: { [this.relationship]: true }
    }))
    if (error?.code === 'P2016') throw new createError.BadRequest(`${this.main.modelName} model with id ${mainId} must be exists`)
    if (error?.code === 'P2025') throw new createError.BadRequest(`${this.relation.modelName} model with id ${relationId} must be exists`)
    if (error) throw new createError.InternalServerError(error.message)
    reply.code(201).send({ data: model })
  }

  async destroy(request, reply) {
    const mainId = request.body[this.main.field]
    const relationId = request.body[this.relation.field]
    const [error, model] = await to(prisma[this.main.model].update({
      where: { id: mainId },
      data: { [this.relationship]: { disconnect: { id: relationId } } },
      include: { [this.relationship]: true }
    }))
    if (error?.code === 'P2025') throw new createError.BadRequest(`${this.main.modelName} model with id ${mainId} must be exists`)
    if (error?.code === 'P2016') throw new createError.BadRequest(`${this.relation.modelName} model with id ${relationId} must be exists`)
    if (error) throw new createError.InternalServerError(error.message)
    reply.send({ data: model })
  }
}

export default BaseRelationController
