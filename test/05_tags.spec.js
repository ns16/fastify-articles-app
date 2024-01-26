import t from 'tap'

import { describe } from './_tools/globals.js'
import { deleteTag, createTag } from './_tools/helpers.js'
import {
  tagSchema,
  tagsListSchema,
  paginationSchema,
  tagsWithArticlesListSchema,
  tagWithArticlesSchema
} from './_tools/schemas.js'

describe('TagsController (e2e)', t, (t, fastify, authorization) => {
  describe('/api/v1/tags (GET)', t, t => {
    t.test('{"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/tags',
        query: {},
        headers: { Authorization: null }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 401)
      test.matchOnlyStrict(payload, {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      })
    })

    t.test('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/tags',
        query: { foo: 'bar' },
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring must NOT have additional properties'
      })
    })

    t.test('{"query":{}} - success', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/tags',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, tagsListSchema)
      test.equal(payload.data.length, 5)
      test.matchJsonSchema(payload.pagination, paginationSchema)
      test.matchOnlyStrict(payload.pagination, {
        page: 1,
        pageSize: 10,
        rowCount: 5,
        pageCount: 1
      })
    })

    describe('paging', t, t => {
      t.test('{"query":{"page":1}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { page: 1 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 5)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      t.test('{"query":{"page":2}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { page: 2 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 2,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })
    })

    describe('sort', t, t => {
      t.test('{"query":{"sort":"id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { sort: 'id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 5)
        test.equal(payload.data[0].id, 1)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      t.test('{"query":{"sort":"-id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { sort: '-id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 5)
        test.equal(payload.data[0].id, 5)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      t.test('{"query":{"sort":"name"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { sort: 'name' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 5)
        test.equal(payload.data[0].name, 'aliquam')
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      t.test('{"query":{"sort":"-name"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { sort: '-name' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 5)
        test.equal(payload.data[0].name, 'veniam')
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })
    })

    describe('includes', t, t => {
      t.test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'includes[]': 'foo' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 400)
        test.matchOnlyStrict(payload, {
          statusCode: 400,
          error: 'Bad Request',
          message: 'querystring/includes/0 must be equal to one of the allowed values'
        })
      })

      t.test('{"query":{"includes":["articles"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'includes[]': 'articles' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsWithArticlesListSchema)
        test.equal(payload.data.length, 5)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })
    })

    describe('filters', t, t => {
      t.test('{"query":{"filters[id__foo]":3}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[id__foo]': 3 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 400)
        test.matchOnlyStrict(payload, {
          statusCode: 400,
          error: 'Bad Request',
          message: 'querystring/filters must NOT have additional properties'
        })
      })

      t.test('{"query":{"filters[id__gt]":2}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[id__gt]': 2 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal(item.id > 2, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__gte]":2}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[id__gte]': 2 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 4)
        payload.data.forEach(item => test.equal(item.id >= 2, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__lt]":4}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[id__lt]': 4 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal(item.id < 4, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__lte]":4}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[id__lte]': 4 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 4)
        payload.data.forEach(item => test.equal(item.id <= 4, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__gte]":2,"filters[id__lte]":4}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: {
            'filters[id__gte]': 2,
            'filters[id__lte]': 4
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__lte]":4,"filters[id__gte]":2}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: {
            'filters[id__lte]': 4,
            'filters[id__gte]': 2
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__eq]":3}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[id__eq]': 3 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.id, 3))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__ne]":3}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[id__ne]': 3 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 4)
        payload.data.forEach(item => test.not(item.id, 3))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__between]":[2,4]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[id__between]': [2, 4] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal(item.id >= 2 && item.id <= 4, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__notBetween]":[2,4]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[id__notBetween]': [2, 4] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.not(item.id >= 2 && item.id <= 4, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__in]":[2,4]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[id__in]': [2, 4] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.equal([2, 4].includes(item.id), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__notIn]":[2,4]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[id__notIn]': [2, 4] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.not([2, 4].includes(item.id), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[name__foo]":"nulla"}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[name__foo]': 'nulla' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 400)
        test.matchOnlyStrict(payload, {
          statusCode: 400,
          error: 'Bad Request',
          message: 'querystring/filters must NOT have additional properties'
        })
      })

      t.test('{"query":{"filters[name__eq]":"nulla"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[name__eq]': 'nulla' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.name, 'nulla'))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[name__ne]":"nulla"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[name__ne]': 'nulla' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 4)
        payload.data.forEach(item => test.not(item.name, 'nulla'))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 4,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[name__in]":["rem","perferendis"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[name__in]': ['rem', 'perferendis'] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.equal(['rem', 'perferendis'].includes(item.name), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[name__notIn]":["rem","perferendis"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[name__notIn]': ['rem', 'perferendis'] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.not(['rem', 'perferendis'].includes(item.name), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[name__like]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[name__like]': 'a' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal(item.name.includes('a'), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[name__notLike]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: { 'filters[name__notLike]': 'a' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.not(item.name.includes('a'), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[name__like]":"a","filters[name__notLike]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: {
            'filters[name__like]': 'a',
            'filters[name__notLike]': 'a'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      t.test('{"query":{"filters[name__notLike]":"a","filters[name__like]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags',
          query: {
            'filters[name__notLike]': 'a',
            'filters[name__like]': 'a'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })
    })
  })

  describe('/api/v1/tags/all (GET)', t, t => {
    t.test('{"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/tags/all',
        query: {},
        headers: { Authorization: null }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 401)
      test.matchOnlyStrict(payload, {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      })
    })

    t.test('{"query":{"foo":"bar"}} - 400 error, invalid query parameter', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/tags/all',
        query: { foo: 'bar' },
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring must NOT have additional properties'
      })
    })

    t.test('{"query":{}} - success', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/tags/all',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, tagsListSchema)
      test.equal(payload.data.length, 5)
    })

    describe('sort', t, t => {
      t.test('{"query":{"sort":"id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { sort: 'id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 5)
        test.equal(payload.data[0].id, 1)
      })

      t.test('{"query":{"sort":"-id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { sort: '-id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 5)
        test.equal(payload.data[0].id, 5)
      })

      t.test('{"query":{"sort":"name"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { sort: 'name' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 5)
        test.equal(payload.data[0].name, 'aliquam')
      })

      t.test('{"query":{"sort":"-name"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { sort: '-name' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 5)
        test.equal(payload.data[0].name, 'veniam')
      })
    })

    describe('includes', t, t => {
      t.test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'includes[]': 'foo' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 400)
        test.matchOnlyStrict(payload, {
          statusCode: 400,
          error: 'Bad Request',
          message: 'querystring/includes/0 must be equal to one of the allowed values'
        })
      })

      t.test('{"query":{"includes":["articles"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'includes[]': 'articles' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsWithArticlesListSchema)
        test.equal(payload.data.length, 5)
      })
    })

    describe('filters', t, t => {
      t.test('{"query":{"filters[id__foo]":3}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[id__foo]': 3 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 400)
        test.matchOnlyStrict(payload, {
          statusCode: 400,
          error: 'Bad Request',
          message: 'querystring/filters must NOT have additional properties'
        })
      })

      t.test('{"query":{"filters[id__gt]":2}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[id__gt]': 2 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal(item.id > 2, true))
      })

      t.test('{"query":{"filters[id__gte]":2}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[id__gte]': 2 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 4)
        payload.data.forEach(item => test.equal(item.id >= 2, true))
      })

      t.test('{"query":{"filters[id__lt]":4}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[id__lt]': 4 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal(item.id < 4, true))
      })

      t.test('{"query":{"filters[id__lte]":4}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[id__lte]': 4 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 4)
        payload.data.forEach(item => test.equal(item.id <= 4, true))
      })

      t.test('{"query":{"filters[id__gte]":2,"filters[id__lte]":4}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: {
            'filters[id__gte]': 2,
            'filters[id__lte]': 4
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
      })

      t.test('{"query":{"filters[id__lte]":4,"filters[id__gte]":2}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: {
            'filters[id__lte]': 4,
            'filters[id__gte]': 2
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
      })

      t.test('{"query":{"filters[id__eq]":3}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[id__eq]': 3 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.id, 3))
      })

      t.test('{"query":{"filters[id__ne]":3}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[id__ne]': 3 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 4)
        payload.data.forEach(item => test.not(item.id, 3))
      })

      t.test('{"query":{"filters[id__between]":[2,4]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[id__between]': [2, 4] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal(item.id >= 2 && item.id <= 4, true))
      })

      t.test('{"query":{"filters[id__notBetween]":[2,4]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[id__notBetween]': [2, 4] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.not(item.id >= 2 && item.id <= 4, true))
      })

      t.test('{"query":{"filters[id__in]":[2,4]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[id__in]': [2, 4] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.equal([2, 4].includes(item.id), true))
      })

      t.test('{"query":{"filters[id__notIn]":[2,4]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[id__notIn]': [2, 4] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.not([2, 4].includes(item.id), true))
      })

      t.test('{"query":{"filters[name__foo]":"nulla"}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[name__foo]': 'nulla' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 400)
        test.matchOnlyStrict(payload, {
          statusCode: 400,
          error: 'Bad Request',
          message: 'querystring/filters must NOT have additional properties'
        })
      })

      t.test('{"query":{"filters[name__eq]":"nulla"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[name__eq]': 'nulla' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.name, 'nulla'))
      })

      t.test('{"query":{"filters[name__ne]":"nulla"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[name__ne]': 'nulla' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 4)
        payload.data.forEach(item => test.not(item.name, 'nulla'))
      })

      t.test('{"query":{"filters[name__in]":["rem","perferendis"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[name__in]': ['rem', 'perferendis'] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.equal(['rem', 'perferendis'].includes(item.name), true))
      })

      t.test('{"query":{"filters[name__notIn]":["rem","perferendis"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[name__notIn]': ['rem', 'perferendis'] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.not(['rem', 'perferendis'].includes(item.name), true))
      })

      t.test('{"query":{"filters[name__like]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[name__like]': 'a' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal(item.name.includes('a'), true))
      })

      t.test('{"query":{"filters[name__notLike]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: { 'filters[name__notLike]': 'a' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.not(item.name.includes('a'), true))
      })

      t.test('{"query":{"filters[name__like]":"a","filters[name__notLike]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: {
            'filters[name__like]': 'a',
            'filters[name__notLike]': 'a'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 0)
      })

      t.test('{"query":{"filters[name__notLike]":"a","filters[name__like]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/all',
          query: {
            'filters[name__notLike]': 'a',
            'filters[name__like]': 'a'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagsListSchema)
        test.equal(payload.data.length, 0)
      })
    })
  })

  describe('/api/v1/tags/:id (GET)', t, t => {
    t.test('{"params":{"id":1},"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/tags/1',
        query: {},
        headers: { Authorization: null }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 401)
      test.matchOnlyStrict(payload, {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      })
    })

    t.test('{"params":{"id":"a"},"query":{}} - 400 error, id param must be a number', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/tags/a',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      })
    })

    t.test('{"params":{"id":100},"query":{}} - 404 error, entity not found', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/tags/100',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 404)
      test.matchOnlyStrict(payload, {
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      })
    })

    t.test('{"params":{"id":1},"query":{"foo":"bar"}} - 400 error, invalid query parameter', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/tags/1',
        query: { foo: 'bar' },
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring must NOT have additional properties'
      })
    })

    t.test('{"params":{"id":1},"query":{}} - success', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/tags/1',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, tagSchema)
      test.equal(payload.data.id, 1)
    })

    describe('includes', t, t => {
      t.test('{"params":{"id":1},{"query":{"includes":["foo"]}} - 400 error, invalid include value', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/1',
          query: { 'includes[]': 'foo' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 400)
        test.matchOnlyStrict(payload, {
          statusCode: 400,
          error: 'Bad Request',
          message: 'querystring/includes/0 must be equal to one of the allowed values'
        })
      })

      t.test('{"params":{"id":1},{"query":{"includes":["articles"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/tags/1',
          query: { 'includes[]': 'articles' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, tagWithArticlesSchema)
        test.equal(payload.data.id, 1)
      })
    })
  })

  describe('/api/v1/tags (POST)', t, t => {
    t.test('{"body":{"name":"beatae"}} - 401 error, invalid token', async test => {
      const body = {
        name: 'beatae'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/tags',
        payload: body,
        headers: { Authorization: null }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 401)
      test.matchOnlyStrict(payload, {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      })
    })

    t.test('{"body":{"name":"beatae"}} - success', async test => {
      const body = {
        name: 'beatae'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/tags',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 201)
      test.matchJsonSchema(payload.data, tagSchema)
      test.matchStrict(payload.data, {
        name: 'beatae'
      })
      await deleteTag(payload.data.id)
    })
  })

  describe('/api/v1/tags/:id (PUT)', t, t => {
    t.test('{"params":{"id":6},"body":{"name":"labore}} - 401 error, invalid token', async test => {
      const body = {
        name: 'labore'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/tags/6',
        payload: body,
        headers: { Authorization: null }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 401)
      test.matchOnlyStrict(payload, {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      })
    })

    t.test('{"params":{"id":"a"},"body":{"name":"labore"}} - 400 error, id param must be a number', async test => {
      const body = {
        name: 'labore'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/tags/a',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      })
    })

    t.test('{"params":{"id":100},"body":{"name":"labore"}} - 404 error, entity not found', async test => {
      const body = {
        name: 'labore'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/tags/100',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 404)
      test.matchOnlyStrict(payload, {
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      })
    })

    t.test('{"params":{"id":6},"body":{"name":"labore}} - success', async test => {
      const tag = await createTag()
      const body = {
        name: 'labore'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: `/api/v1/tags/${tag.id}`,
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, tagSchema)
      test.matchStrict(payload.data, {
        id: tag.id,
        name: 'labore'
      })
      await deleteTag(tag.id)
    })
  })

  describe('/api/v1/tags/:id (DELETE)', t, t => {
    t.test('{"params":{"id":6}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/api/v1/tags/6',
        headers: { Authorization: null }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 401)
      test.matchOnlyStrict(payload, {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      })
    })

    t.test('{"params":{"id":"a"}} - 400 error, id param must be a number', async test => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/api/v1/tags/a',
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      })
    })

    t.test('{"params":{"id":100}} - 404 error, entity not found', async test => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/api/v1/tags/100',
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 404)
      test.matchOnlyStrict(payload, {
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      })
    })

    t.test('{"params":{"id":6}} - success', async test => {
      const tag = await createTag()
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/api/v1/tags/${tag.id}`,
        headers: { Authorization: authorization }
      })
      test.equal(res.statusCode, 204)
      test.equal(res.payload, '')
    })
  })
})
