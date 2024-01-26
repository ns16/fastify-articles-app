import t from 'tap'

import { describe } from './_tools/globals.js'
import { deleteUser, createUser } from './_tools/helpers.js'
import {
  paginationSchema,
  userSchema,
  usersListSchema,
  usersWithArticlesListSchema,
  userWithArticlesSchema
} from './_tools/schemas.js'

describe('UsersController (e2e)', t, (t, fastify, authorization) => {
  describe('/api/v1/users (GET)', t, t => {
    t.test('{"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/users',
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
        url: '/api/v1/users',
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
        url: '/api/v1/users',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, usersListSchema)
      test.equal(payload.data.length, 10)
      test.matchJsonSchema(payload.pagination, paginationSchema)
      test.matchOnlyStrict(payload.pagination, {
        page: 1,
        pageSize: 10,
        rowCount: 10,
        pageCount: 1
      })
    })

    describe('paging', t, t => {
      t.test('{"query":{"page":1}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { page: 1 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 10)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })

      t.test('{"query":{"page":2}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { page: 2 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 2,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })
    })

    describe('sort', t, t => {
      t.test('{"query":{"sort":"id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { sort: 'id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 10)
        test.equal(payload.data[0].id, 1)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })

      t.test('{"query":{"sort":"-id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { sort: '-id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 10)
        test.equal(payload.data[0].id, 10)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })

      t.test('{"query":{"sort:"username"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { sort: 'username' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 10)
        test.equal(payload.data[0].username, 'Albina_Kuphal-Zieme')
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })

      t.test('{"query":{"sort":"-username"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { sort: '-username' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 10)
        test.equal(payload.data[0].username, 'Sheldon52')
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })
    })

    describe('includes', t, t => {
      t.test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
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
          url: '/api/v1/users',
          query: { 'includes[]': 'articles' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersWithArticlesListSchema)
        test.equal(payload.data.length, 10)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        })
      })
    })

    describe('filters', t, t => {
      t.test('{"query":{"filters[id__foo]":5}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[id__foo]': 5 },
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

      t.test('{"query":{"filters[id__gt]":5}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[id__gt]': 5 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.equal(item.id > 5, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__gte]":5}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[id__gte]': 5 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 6)
        payload.data.forEach(item => test.equal(item.id >= 5, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 6,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__lt]":6}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[id__lt]': 6 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.equal(item.id < 6, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__lte]":6}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[id__lte]': 6 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 6)
        payload.data.forEach(item => test.equal(item.id <= 6, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 6,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__gte]":7,"filters[id__lte]":4}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: {
            'filters[id__gte]': 7,
            'filters[id__lte]': 4
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      t.test('{"query":{"filters[id__lte]":4,"filters[id__gte]":7}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: {
            'filters[id__lte]': 4,
            'filters[id__gte]': 7
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      t.test('{"query":{"filters[id__eq]":5}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[id__eq]': 5 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.id, 5))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__ne]":5}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[id__ne]': 5 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 9)
        payload.data.forEach(item => test.not(item.id, 5))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 9,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__between]":[4,6]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[id__between]': [4, 6] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal(item.id >= 4 && item.id <= 6, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__notBetween]":[4,6]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[id__notBetween]': [4, 6] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 7)
        payload.data.forEach(item => test.not(item.id >= 4 && item.id <= 6, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 7,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__in]":[2,5,8]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[id__in]': [2, 5, 8] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal([2, 5, 8].includes(item.id), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__notIn]":[2,5,8]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[id__notIn]': [2, 5, 8] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 7)
        payload.data.forEach(item => test.not([2, 5, 8].includes(item.id), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 7,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[username__foo]":"Sheldon52"}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[username__foo]': 'Sheldon52' },
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

      t.test('{"query":{"filters[username__eq]":"Sheldon52"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[username__eq]': 'Sheldon52' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.username, 'Sheldon52'))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[username__ne]":"Sheldon52"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[username__ne]': 'Sheldon52' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 9)
        payload.data.forEach(item => test.not(item.username, 'Sheldon52'))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 9,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[username__in]":["Sheldon52","Hester_Schowalter67"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[username__in]': ['Sheldon52', 'Hester_Schowalter67'] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.equal(['Sheldon52', 'Hester_Schowalter67'].includes(item.username), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[username__notIn]":["Sheldon52","Hester_Schowalter67"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[username__notIn]': ['Sheldon52', 'Hester_Schowalter67'] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 8)
        payload.data.forEach(item => test.not(['Sheldon52', 'Hester_Schowalter67'].includes(item.username), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 8,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[username__like]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[username__like]': 'a' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.equal(item.username.includes('a'), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[username__notLike]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: { 'filters[username__notLike]': 'a' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.not(item.username.includes('a'), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[username__like]":"b","filters[username__notLike]":"b"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: {
            'filters[username__like]': 'b',
            'filters[username__notLike]': 'b'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      t.test('{"query":{"filters[username__notLike]":"b","filters[username__like]":"b"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users',
          query: {
            'filters[username__notLike]': 'b',
            'filters[username__like]': 'b'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
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

  describe('/api/v1/users/all (GET)', t, t => {
    t.test('{"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/users/all',
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
        url: '/api/v1/users/all',
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
        url: '/api/v1/users/all',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, usersListSchema)
      test.equal(payload.data.length, 10)
    })

    describe('sort', t, t => {
      t.test('{"query":{"sort":"id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { sort: 'id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 10)
        test.equal(payload.data[0].id, 1)
      })

      t.test('{"query":{"sort":"-id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { sort: '-id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 10)
        test.equal(payload.data[0].id, 10)
      })

      t.test('{"query":{"sort":"username"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { sort: 'username' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 10)
        test.equal(payload.data[0].username, 'Albina_Kuphal-Zieme')
      })

      t.test('{"query":{"sort":"-username"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { sort: '-username' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 10)
        test.equal(payload.data[0].username, 'Sheldon52')
      })
    })

    describe('includes', t, t => {
      t.test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
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
          url: '/api/v1/users/all',
          query: { 'includes[]': 'articles' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersWithArticlesListSchema)
        test.equal(payload.data.length, 10)
      })
    })

    describe('filters', t, t => {
      t.test('{"query":{"filters[id__foo]":5}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[id__foo]': 5 },
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

      t.test('{"query":{"filters[id__gt]":5}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[id__gt]': 5 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.equal(item.id > 5, true))
      })

      t.test('{"query":{"filters[id__gte]":5}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[id__gte]': 5 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 6)
        payload.data.forEach(item => test.equal(item.id >= 5, true))
      })

      t.test('{"query":{"filters[id__lt]":6}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[id__lt]': 6 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.equal(item.id < 6, true))
      })

      t.test('{"query":{"filters[id__lte]":6}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[id__lte]': 6 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 6)
        payload.data.forEach(item => test.equal(item.id <= 6, true))
      })

      t.test('{"query":{"filters[id__gte]":7,"filters[id__lte]":4}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: {
            'filters[id__gte]': 7,
            'filters[id__lte]': 4
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 0)
      })

      t.test('{"query":{"filters[id__lte]":4,"filters[id__gte]":7}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: {
            'filters[id__lte]': 4,
            'filters[id__gte]': 7
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 0)
      })

      t.test('{"query":{"filters[id__eq]":5}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[id__eq]': 5 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.id, 5))
      })

      t.test('{"query":{"filters[id__ne]":5}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[id__ne]': 5 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 9)
        payload.data.forEach(item => test.not(item.id, 5))
      })

      t.test('{"query":{"filters[id__between]":[4,6]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[id__between]': [4, 6] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal(item.id >= 4 && item.id <= 6, true))
      })

      t.test('{"query":{"filters[id__notBetween]":[4,6]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[id__notBetween]': [4, 6] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 7)
        payload.data.forEach(item => test.not(item.id >= 4 && item.id <= 6, true))
      })

      t.test('{"query":{"filters[id__in]":[2,5,8]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[id__in]': [2, 5, 8] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal([2, 5, 8].includes(item.id), true))
      })

      t.test('{"query":{"filters[id__notIn]":[2,5,8]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[id__notIn]': [2, 5, 8] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 7)
        payload.data.forEach(item => test.not([2, 5, 8].includes(item.id), true))
      })

      t.test('{"query":{"filters[username__foo]":"Sheldon52"}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[username__foo]': 'Sheldon52' },
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

      t.test('{"query":{"filters[username__eq]":"Sheldon52"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[username__eq]': 'Sheldon52' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.username, 'Sheldon52'))
      })

      t.test('{"query":{"filters[username__ne]":"Sheldon52"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[username__ne]': 'Sheldon52' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 9)
        payload.data.forEach(item => test.not(item.username, 'Sheldon52'))
      })

      t.test('{"query":{"filters[username__in]":["Sheldon52","Hester_Schowalter67"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[username__in]': ['Sheldon52', 'Hester_Schowalter67'] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.equal(['Sheldon52', 'Hester_Schowalter67'].includes(item.username), true))
      })

      t.test('{"query":{"filters[username__notIn]":["Sheldon52","Hester_Schowalter67"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[username__notIn]': ['Sheldon52', 'Hester_Schowalter67'] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 8)
        payload.data.forEach(item => test.not(['Sheldon52', 'Hester_Schowalter67'].includes(item.username), true))
      })

      t.test('{"query":{"filters[username__like]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[username__like]': 'a' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.equal(item.username.includes('a'), true))
      })

      t.test('{"query":{"filters[username__notLike]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: { 'filters[username__notLike]': 'a' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.not(item.username.includes('a'), true))
      })

      t.test('{"query":{"filters[username__like]":"b","filters[username__notLike]":"b"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: {
            'filters[username__like]': 'b',
            'filters[username__notLike]': 'b'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 0)
      })

      t.test('{"query":{"filters[username__notLike]":"b","filters[username__like]":"b"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/all',
          query: {
            'filters[username__notLike]': 'b',
            'filters[username__like]': 'b'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, usersListSchema)
        test.equal(payload.data.length, 0)
      })
    })
  })

  describe('/api/v1/users/:id (GET)', t, t => {
    t.test('{"params":{"id":1},"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/users/1',
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
        url: '/api/v1/users/a',
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
        url: '/api/v1/users/100',
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
        url: '/api/v1/users/1',
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
        url: '/api/v1/users/1',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, userSchema)
      test.equal(payload.data.id, 1)
    })

    describe('includes', t, t => {
      t.test('{"params":{"id":1},{"query":{"includes":["foo"]}} - 400 error, invalid include value', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/users/1',
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
          url: '/api/v1/users/1',
          query: { 'includes[]': 'articles' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, userWithArticlesSchema)
        test.equal(payload.data.id, 1)
      })
    })
  })

  describe('/api/v1/users (POST)', t, t => {
    t.test('{"body":{"name":"Rosalind Trantow","username":"Rosalind4","password":"Y9ECfszZ","email":"Rosalind.Trantow35@gmail.com"}} - 401 error, invalid token', async test => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        password: 'Y9ECfszZ',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/users',
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

    t.test('{"body":{"name":"Rosalind Trantow","username":"Sheldon52","password":"Y9ECfszZ","email":"Rosalind.Trantow35@gmail.com"}} - 400 error, username field must be unique', async test => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Sheldon52',
        password: 'Y9ECfszZ',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'username field must be unique'
      })
    })

    t.test('{"body":{"name":"Rosalind Trantow","username":"Rosalind4","password":"Y9ECfszZ","email":"Rosalind.Trantow35+gmail.com"}} - 400 error, email must be an email', async test => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        password: 'Y9ECfszZ',
        email: 'Rosalind.Trantow35+gmail.com'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'body/email must match format "email"'
      })
    })

    t.test('{"body":{"name":"Rosalind Trantow","username":"Rosalind4","password":"Y9ECfszZ","email":"Sheldon_Bahringer6@yahoo.com"}} - 400 error, email field must be unique', async test => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        password: 'Y9ECfszZ',
        email: 'Sheldon_Bahringer6@yahoo.com'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'email field must be unique'
      })
    })

    t.test('{"body":{"name":"Rosalind Trantow","username":"Rosalind4","password":"Y9ECfszZ","email":"Rosalind.Trantow35@gmail.com"}} - success', async test => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        password: 'Y9ECfszZ',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/users',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 201)
      test.matchJsonSchema(payload.data, userSchema)
      test.matchStrict(payload.data, {
        name: 'Rosalind Trantow',
        username: 'Rosalind4',
        email: 'Rosalind.Trantow35@gmail.com'
      })
      await deleteUser(payload.data.id)
    })
  })

  describe('/api/v1/users/:id (PUT)', t, t => {
    t.test('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35@gmail.com"}} - 401 error, invalid token', async test => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/users/11',
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

    t.test('{"params":{"id":"a"},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35@gmail.com"}} - 400 error, id param must be a number', async test => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/users/a',
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

    t.test('{"params":{"id":100},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35@gmail.com"}} - 404 error, entity not found', async test => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/users/100',
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

    t.test('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Sheldon52","email":"Rosalind.Trantow35@gmail.com"}} - 400 error, username field must be unique', async test => {
      const user = await createUser()
      const body = {
        name: 'Rosalind Trantow',
        username: 'Sheldon52',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: `/api/v1/users/${user.id}`,
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'username field must be unique'
      })
      await deleteUser(user.id)
    })

    t.test('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35+gmail.com"}} - 400 error, email must be an email', async test => {
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35+gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/users/11',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'body/email must match format "email"'
      })
    })

    t.test('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Sheldon_Bahringer6@yahoo.com"}} - 400 error, email field must be unique', async test => {
      const user = await createUser()
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Sheldon_Bahringer6@yahoo.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: `/api/v1/users/${user.id}`,
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'email field must be unique'
      })
      await deleteUser(user.id)
    })

    t.test('{"params":{"id":11},"body":{"name":"Rosalind Trantow","username":"Rosalind5","email":"Rosalind.Trantow35@gmail.com"}} - success', async test => {
      const user = await createUser()
      const body = {
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: `/api/v1/users/${user.id}`,
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, userSchema)
      test.matchStrict(payload.data, {
        id: user.id,
        name: 'Rosalind Trantow',
        username: 'Rosalind5',
        email: 'Rosalind.Trantow35@gmail.com'
      })
      await deleteUser(user.id)
    })
  })

  describe('/api/v1/users/:id (DELETE)', t, t => {
    t.test('{"params":{"id":11}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/api/v1/users/11',
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
        url: '/api/v1/users/a',
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
        url: '/api/v1/users/100',
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

    t.test('{"params":{"id":11}} - success', async test => {
      const user = await createUser()
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/api/v1/users/${user.id}`,
        headers: { Authorization: authorization }
      })
      test.equal(res.statusCode, 204)
      test.equal(res.payload, '')
    })
  })
})
