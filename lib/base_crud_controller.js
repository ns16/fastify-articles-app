import { to } from 'await-to-js'
import createError from 'http-errors'

import BaseController from './base_controller.js'
import prisma from './prisma.js'

class BaseCrudController extends BaseController {
  static operatorsMap = {
    gt: (field, value) => ({ AND: { [field]: { gt: value } } }),
    gte: (field, value) => ({ AND: { [field]: { gte: value } } }),
    lt: (field, value) => ({ AND: { [field]: { lt: value } } }),
    lte: (field, value) => ({ AND: { [field]: { lte: value } } }),
    ne: (field, value) => ({ AND: { [field]: { not: value } } }),
    eq: (field, value) => ({ AND: { [field]: { equals: value } } }),
    between: (field, value) => ({ AND: { [field]: { gte: value[0], lte: value[1] } } }),
    notBetween: (field, value) => ({ NOT: { [field]: { gte: value[0], lte: value[1] } } }),
    in: (field, value) => ({ AND: { [field]: { in: value } } }),
    notIn: (field, value) => ({ AND: { [field]: { notIn: value } } }),
    like: (field, value) => ({ AND: { [field]: { contains: value } } }),
    notLike: (field, value) => ({ NOT: { [field]: { contains: value } } })
  }

  async index(request, reply) {
    const { filters = {}, page = 1, pageSize = 10, sort = 'id', includes = [] } = request.query
    const [error, [models, count]] = await to(Promise.all([
      prisma[this.model].findMany({
        where: BaseCrudController.getWhere(filters),
        orderBy: BaseCrudController.getOrderBy(sort),
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: BaseCrudController.getInclude(includes)
      }),
      prisma[this.model].count({
        where: BaseCrudController.getWhere(filters)
      })
    ]))
    if (error) throw new createError.InternalServerError(error.message)
    reply.send({
      data: models,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        rowCount: count,
        pageCount: Math.ceil(count / pageSize)
      }
    })
  }

  async all(request, reply) {
    const { filters = {}, sort = 'id', includes = [] } = request.query
    const [error, models] = await to(prisma[this.model].findMany({
      where: BaseCrudController.getWhere(filters),
      orderBy: BaseCrudController.getOrderBy(sort),
      include: BaseCrudController.getInclude(includes)
    }))
    if (error) throw new createError.InternalServerError(error.message)
    reply.send({ data: models })
  }

  async show(request, reply) {
    const { includes = [] } = request.query
    const [error, model] = await to(prisma[this.model].findFirst({
      where: { id: request.params.id },
      include: BaseCrudController.getInclude(includes)
    }))
    if (error) throw new createError.InternalServerError(error.message)
    if (!model) throw new createError.NotFound()
    reply.send({ data: model })
  }

  async create(request, reply) {
    await this.validateBody(request.body)
    const [error, model] = await to(prisma[this.model].create({ data: request.body }))
    if (error) throw new createError.InternalServerError(error.message)
    reply.code(201).send({ data: model })
  }

  async update(request, reply) {
    {
      const [error, model] = await to(prisma[this.model].findFirst({ where: { id: request.params.id } }))
      if (error) throw new createError.InternalServerError(error.message)
      if (!model) throw new createError.NotFound()
      await this.validateBody(request.body, model)
    }
    const [error, model] = await to(prisma[this.model].update({
      data: request.body,
      where: { id: request.params.id }
    }))
    if (error?.code === 'P2025') throw new createError.NotFound()
    if (error) throw new createError.InternalServerError(error.message)
    reply.send({ data: model })
  }

  async destroy(request, reply) {
    const [error] = await to(prisma[this.model].delete({ where: { id: request.params.id } }))
    if (error?.code === 'P2025') throw new createError.NotFound()
    if (error) throw new createError.InternalServerError(error.message)
    reply.code(204)
  }

  static getWhere = filters => Object.entries(filters).reduce((res, [key, value]) => {
    const [field, operator = 'eq'] = key.split('__')
    const where = BaseCrudController.operatorsMap[operator](field, value)
    const whereKey = Object.keys(where)[0]
    const whereVal = where[whereKey]
    for (const resKey of Object.keys(res)) {
      const resVal = res[resKey]
      if (resKey === whereKey) {
        res[resKey] = Array.isArray(resVal) ? [...resVal, whereVal] : [resVal, whereVal]
      }
    }
    if (!res[whereKey]) {
      res[whereKey] = whereVal
    }
    return res
  }, {})

  static getOrderBy = sort => ({
    [sort.replace('-', '')]: sort.startsWith('-') ? 'desc' : 'asc'
  })

  static getInclude = includes => includes.reduce((res, include) => ({
    ...res,
    [include]: true
  }), {})
}

export default BaseCrudController
