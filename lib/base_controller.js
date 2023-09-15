import { to } from 'await-to-js'
import createError from 'http-errors'

import prisma from './prisma.js'

class BaseController {
  constructor() {
    this.model = null
    this.mustBeExists = []
    this.mustBeUnique = []
  }

  async validateBody(body, model) {
    await this.checkIfExists(body, model)
    await this.checkIfUnique(body, model)
  }

  async checkIfExists(body, model) {
    for (const other of this.mustBeExists) {
      if (model?.[other.field] === body[other.field] || body[other.field] == null) continue
      const [error, otherModel] = await to(prisma[other.model].findFirst({ where: { id: body[other.field] } }))
      if (error) throw new createError.InternalServerError(error.message)
      if (!otherModel) throw new createError.BadRequest(`${other.modelName} model with id ${body[other.field]} must be exists`)
    }
  }

  async checkIfUnique(body, model) {
    for (const field of this.mustBeUnique) {
      const fields = !Array.isArray(field) ? [field] : field
      if (fields.every(field => body[field] == null)) continue
      const [error, otherModel] = await to(prisma[this.model].findFirst({
        where: fields.reduce((res, field) => ({
          ...res,
          [field]: body[field]
        }), {})
      }))
      if (error) throw new createError.InternalServerError(error.message)
      if (otherModel) {
        if (otherModel.id === model?.id) continue
        throw new createError.BadRequest(`${
          fields.length > 1 ? [fields.slice(0, -1).join(', '), fields[fields.length - 1]].join(' and ') : fields[0]
        } field${
          fields.length > 1 ? 's' : ''
        } must be unique`)
      }
    }
  }
}

export default BaseController
