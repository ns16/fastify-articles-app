import t from 'tap'

import { describe } from './_tools/globals.js'
import { deleteArticle, createArticle } from './_tools/helpers.js'
import {
  articleSchema,
  articlesListSchema,
  articlesWithContentListSchema,
  articlesWithTagsListSchema,
  articlesWithUserListSchema,
  articleWithContentSchema,
  articleWithTagsSchema,
  articleWithUserSchema,
  paginationSchema
} from './_tools/schemas.js'

describe('ArticlesController (e2e)', t, (t, fastify, authorization) => {
  describe('/api/v1/articles (GET)', t, t => {
    t.test('{"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/articles',
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
        url: '/api/v1/articles',
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
        url: '/api/v1/articles',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, articlesListSchema)
      test.equal(payload.data.length, 10)
      test.matchJsonSchema(payload.pagination, paginationSchema)
      test.matchOnlyStrict(payload.pagination, {
        page: 1,
        pageSize: 10,
        rowCount: 20,
        pageCount: 2
      })
    })

    describe('paging', t, t => {
      t.test('{"query":{"page":1}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { page: 1 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 10)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      t.test('{"query":{"page":2}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { page: 2 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 10)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 2,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      t.test('{"query":{"page":3}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { page: 3 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 3,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      t.test('{"query":{"pageSize":20}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { pageSize: 20 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 20)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 20,
          rowCount: 20,
          pageCount: 1
        })
      })

      t.test('{"query":{"pageSize":30}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { pageSize: 30 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 20)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 30,
          rowCount: 20,
          pageCount: 1
        })
      })
    })

    describe('sort', t, t => {
      t.test('{"query":{"sort":"id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { sort: 'id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 10)
        test.equal(payload.data[0].id, 1)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      t.test('{"query":{"sort":"-id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { sort: '-id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 10)
        test.equal(payload.data[0].id, 20)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      t.test('{"query":{"sort":"title"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { sort: 'title' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 10)
        test.equal(payload.data[0].title, 'adipisci ducimus occaecati')
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      t.test('{"query":{"sort":"-title"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { sort: '-title' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 10)
        test.equal(payload.data[0].title, 'voluptatum necessitatibus totam')
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })
    })

    describe('includes', t, t => {
      t.test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
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

      t.test('{"query":{"includes":["user"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'includes[]': 'user' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesWithUserListSchema)
        test.equal(payload.data.length, 10)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      t.test('{"query":{"includes":["content"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'includes[]': 'content' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesWithContentListSchema)
        test.equal(payload.data.length, 10)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      t.test('{"query":{"includes":["tags"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'includes[]': 'tags' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesWithTagsListSchema)
        test.equal(payload.data.length, 10)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })
    })

    describe('filters', t, t => {
      t.test('{"query":{"filters[id__foo]":15}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
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

      t.test('{"query":{"filters[id__gt]":15}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[id__gt]': 15 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.equal(item.id > 15, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__gte]":15}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[id__gte]': 15 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 6)
        payload.data.forEach(item => test.equal(item.id >= 15, true))
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
          url: '/api/v1/articles',
          query: { 'filters[id__lt]': 6 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
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
          url: '/api/v1/articles',
          query: { 'filters[id__lte]': 6 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
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

      t.test('{"query":{"filters[id__gte]":17,"filters[id__lte]":4}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: {
            'filters[id__gte]': 17,
            'filters[id__lte]': 4
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      t.test('{"query":{"filters[id__lte]":4,"filters[id__gte]":17}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: {
            'filters[id__lte]': 4,
            'filters[id__gte]': 17
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      t.test('{"query":{"filters[id__eq]":10}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[id__eq]': 10 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.id, 10))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__ne]":10}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[id__ne]': 10 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 10)
        payload.data.forEach(item => test.not(item.id, 10))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 19,
          pageCount: 2
        })
      })

      t.test('{"query":{"filters[id__between]":[8,13]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[id__between]': [8, 13] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 6)
        payload.data.forEach(item => test.equal(item.id >= 8 && item.id <= 13, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 6,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__notBetween]":[8,13]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[id__notBetween]': [8, 13] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 10)
        payload.data.forEach(item => test.not(item.id >= 8 && item.id <= 13, true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 14,
          pageCount: 2
        })
      })

      t.test('{"query":{"filters[id__in]":[2,10,18]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[id__in]': [2, 10, 18] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal([2, 10, 18].includes(item.id), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 3,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[id__notIn]":[2,10,18]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[id__notIn]': [2, 10, 18] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 10)
        payload.data.forEach(item => test.not([2, 10, 18].includes(item.id), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 17,
          pageCount: 2
        })
      })

      t.test('{"query":{"filters[title__foo]":"sint repellendus inventore"}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[title__foo]': 'sint repellendus inventore' },
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

      t.test('{"query":{"filters[title__eq]":"sint repellendus inventore"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[title__eq]': 'sint repellendus inventore' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.title, 'sint repellendus inventore'))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[title__ne]":"sint repellendus inventore"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[title__ne]': 'sint repellendus inventore' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 10)
        payload.data.forEach(item => test.not(item.title, 'sint repellendus inventore'))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 19,
          pageCount: 2
        })
      })

      t.test('{"query":{"filters[title__in]":["sint repellendus inventore","facere ea odit"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[title__in]': ['sint repellendus inventore', 'facere ea odit'] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.equal(['sint repellendus inventore', 'facere ea odit'].includes(item.title), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[title__notIn]":["sint repellendus inventore","facere ea odit"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[title__notIn]': ['sint repellendus inventore', 'facere ea odit'] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 10)
        payload.data.forEach(item => test.not(['sint repellendus inventore', 'facere ea odit'].includes(item.title), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 18,
          pageCount: 2
        })
      })

      t.test('{"query":{"filters[title__like]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[title__like]': 'a' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 10)
        payload.data.forEach(item => test.equal(item.title.includes('a'), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 15,
          pageCount: 2
        })
      })

      t.test('{"query":{"filters[title__notLike]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: { 'filters[title__notLike]': 'a' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.not(item.title.includes('a'), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[title__like]":"b","filters[title__notLike]":"b"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: {
            'filters[title__like]': 'b',
            'filters[title__notLike]': 'b'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      t.test('{"query":{"filters[title__notLike]":"b","filters[title__like]":"b"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles',
          query: {
            'filters[title__notLike]': 'b',
            'filters[title__like]': 'b'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
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

  describe('/api/v1/articles/all (GET)', t, t => {
    t.test('{"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/articles/all',
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
        url: '/api/v1/articles/all',
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
        url: '/api/v1/articles/all',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, articlesListSchema)
      test.equal(payload.data.length, 20)
    })

    describe('sort', t, t => {
      t.test('{"query":{"sort":"id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { sort: 'id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 20)
        test.equal(payload.data[0].id, 1)
      })

      t.test('{"query":{"sort":"-id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { sort: '-id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 20)
        test.equal(payload.data[0].id, 20)
      })

      t.test('{"query":{"sort":"title"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { sort: 'title' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 20)
        test.equal(payload.data[0].title, 'adipisci ducimus occaecati')
      })

      t.test('{"query":{"sort":"-title"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { sort: '-title' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 20)
        test.equal(payload.data[0].title, 'voluptatum necessitatibus totam')
      })
    })

    describe('includes', t, t => {
      t.test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
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

      t.test('{"query":{"includes":["user"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'includes[]': 'user' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesWithUserListSchema)
        test.equal(payload.data.length, 20)
      })

      t.test('{"query":{"includes":["content"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'includes[]': 'content' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesWithContentListSchema)
        test.equal(payload.data.length, 20)
      })

      t.test('{"query":{"includes":["tags"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'includes[]': 'tags' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesWithTagsListSchema)
        test.equal(payload.data.length, 20)
      })
    })

    describe('filters', t, t => {
      t.test('{"query":{"filters[id__foo]":15}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[id__foo]': 15 },
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

      t.test('{"query":{"filters[id__gt]":15}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[id__gt]': 15 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.equal(item.id > 15, true))
      })

      t.test('{"query":{"filters[id__gte]":15}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[id__gte]': 15 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 6)
        payload.data.forEach(item => test.equal(item.id >= 15, true))
      })

      t.test('{"query":{"filters[id__lt]":6}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[id__lt]': 6 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.equal(item.id < 6, true))
      })

      t.test('{"query":{"filters[id__lte]":6}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[id__lte]': 6 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 6)
        payload.data.forEach(item => test.equal(item.id <= 6, true))
      })

      t.test('{"query":{"filters[id__gte]":17,"filters[id__lte]":4}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: {
            'filters[id__gte]': 17,
            'filters[id__lte]': 4
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 0)
      })

      t.test('{"query":{"filters[id__lte]":4,"filters[id__gte]":17}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: {
            'filters[id__lte]': 4,
            'filters[id__gte]': 17
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 0)
      })

      t.test('{"query":{"filters[id__eq]":10}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[id__eq]': 10 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.id, 10))
      })

      t.test('{"query":{"filters[id__ne]":10}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[id__ne]': 10 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 19)
        payload.data.forEach(item => test.not(item.id, 10))
      })

      t.test('{"query":{"filters[id__between]":[8,13]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[id__between]': [8, 13] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 6)
        payload.data.forEach(item => test.equal(item.id >= 8 && item.id <= 13, true))
      })

      t.test('{"query":{"filters[id__notBetween]":[8,13]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[id__notBetween]': [8, 13] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 14)
        payload.data.forEach(item => test.not(item.id >= 8 && item.id <= 13, true))
      })

      t.test('{"query":{"filters[id__in]":[2,10,18]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[id__in]': [2, 10, 18] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal([2, 10, 18].includes(item.id), true))
      })

      t.test('{"query":{"filters[id__notIn]":[2,5,8]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[id__notIn]': [2, 10, 18] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 17)
        payload.data.forEach(item => test.not([2, 10, 18].includes(item.id), true))
      })

      t.test('{"query":{"filters[title__foo]":"sint repellendus inventore"}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[title__foo]': 'sint repellendus inventore' },
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

      t.test('{"query":{"filters[title__eq]":"sint repellendus inventore"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[title__eq]': 'sint repellendus inventore' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.title, 'sint repellendus inventore'))
      })

      t.test('{"query":{"filters[title__ne]":"sint repellendus inventore"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[title__ne]': 'sint repellendus inventore' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 19)
        payload.data.forEach(item => test.not(item.title, 'sint repellendus inventore'))
      })

      t.test('{"query":{"filters[title__in]":["sint repellendus inventore","facere ea odit"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[title__in]': ['sint repellendus inventore', 'facere ea odit'] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.equal(['sint repellendus inventore', 'facere ea odit'].includes(item.title), true))
      })

      t.test('{"query":{"filters[title__notIn]":["sint repellendus inventore","facere ea odit"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[title__notIn]': ['sint repellendus inventore', 'facere ea odit'] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 18)
        payload.data.forEach(item => test.not(['sint repellendus inventore', 'facere ea odit'].includes(item.title), true))
      })

      t.test('{"query":{"filters[title__like]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[title__like]': 'a' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 15)
        payload.data.forEach(item => test.equal(item.title.includes('a'), true))
      })

      t.test('{"query":{"filters[title__notLike]":"a"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: { 'filters[title__notLike]': 'a' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.not(item.title.includes('a'), true))
      })

      t.test('{"query":{"filters[title__like]":"b","filters[title__notLike]":"b"}}', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: {
            'filters[title__like]': 'b',
            'filters[title__notLike]': 'b'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 0)
      })

      t.test('{"query":{"filters[title__notLike]":"b","filters[title__like]":"b"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/all',
          query: {
            'filters[title__notLike]': 'b',
            'filters[title__like]': 'b'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articlesListSchema)
        test.equal(payload.data.length, 0)
      })
    })
  })

  describe('/api/v1/articles/:id (GET)', t, t => {
    t.test('{"params":{"id":1},"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/articles/1',
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
        url: '/api/v1/articles/a',
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
        url: '/api/v1/articles/100',
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
        url: '/api/v1/articles/1',
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
        url: '/api/v1/articles/1',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, articleSchema)
      test.equal(payload.data.id, 1)
    })

    describe('includes', t, t => {
      t.test('{"params":{"id":1},{"query":{"includes":["foo"]}} - 400 error, invalid include value', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/1',
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

      t.test('{"params":{"id":1},{"query":{"includes":["user"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/1',
          query: { 'includes[]': 'user' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articleWithUserSchema)
        test.equal(payload.data.id, 1)
      })

      t.test('{"params":{"id":1},{"query":{"includes":["content"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/1',
          query: { 'includes[]': 'content' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articleWithContentSchema)
        test.equal(payload.data.id, 1)
      })

      t.test('{"params":{"id":1},{"query":{"includes":["tags"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/articles/1',
          query: { 'includes[]': 'tags' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, articleWithTagsSchema)
        test.equal(payload.data.id, 1)
      })
    })
  })

  describe('/api/v1/articles (POST)', t, t => {
    t.test('{"body":{"user_id":1,"title":"illum beatae soluta","description":"...","status":"published"}} - 401 error, invalid token', async test => {
      const body = {
        user_id: 1,
        title: 'illum beatae soluta',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/articles',
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

    t.test('{"body":{"user_id":100,"title":"illum beatae soluta","description":"...","status":"published"}} - 400 error, user model with id 100 must be exists', async test => {
      const body = {
        user_id: 100,
        title: 'illum beatae soluta',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/articles',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'User model with id 100 must be exists'
      })
    })

    t.test('{"body":{"user_id":1,"title":"illum beatae soluta","description":"...","status":"published"}} - success', async test => {
      const body = {
        user_id: 1,
        title: 'illum beatae soluta',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/articles',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 201)
      test.matchJsonSchema(payload.data, articleSchema)
      test.matchStrict(payload.data, {
        user_id: 1,
        title: 'illum beatae soluta',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      })
      await deleteArticle(payload.data.id)
    })
  })

  describe('/api/v1/articles/:id (PUT)', t, t => {
    t.test('{"params":{"id":21},"body":{"user_id":1,"title":"illum beatae cumque","description":"...","status":"published"}} - 401 error, invalid token', async test => {
      const body = {
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/articles/21',
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

    t.test('{"params":{"id":"a"},"body":{"user_id":1,"title":"illum beatae cumque","description":"...","status":"published"}} - 400 error, id param must be a number', async test => {
      const body = {
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/articles/a',
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

    t.test('{"params":{"id":100},"body":{"user_id":1,"title":"illum beatae cumque","description":"...","status":"published"}} - 404 error, entity not found', async test => {
      const body = {
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/articles/100',
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

    t.test('{"params":{"id":21},"body":{"user_id":100,"title":"illum beatae cumque","description":"...","status":"published"}} - 400 error, user model with id 100 must be exists', async test => {
      const article = await createArticle()
      const body = {
        user_id: 100,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: `/api/v1/articles/${article.id}`,
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'User model with id 100 must be exists'
      })
      await deleteArticle(article.id)
    })

    t.test('{"params":{"id":21},"body":{"user_id":1,"title":"illum beatae cumque","description":"...","status":"published"}} - success', async test => {
      const article = await createArticle()
      const body = {
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: `/api/v1/articles/${article.id}`,
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, articleSchema)
      test.matchStrict(payload.data, {
        id: article.id,
        user_id: 1,
        title: 'illum beatae cumque',
        description:
          'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
        status: 'published'
      })
      await deleteArticle(article.id)
    })
  })

  describe('/api/v1/articles/:id (DELETE)', t, t => {
    t.test('{"params":{"id":21}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/api/v1/articles/21',
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
        url: '/api/v1/articles/a',
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
        url: '/api/v1/articles/100',
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

    t.test('{"params":{"id":21}} - success', async test => {
      const article = await createArticle()
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/api/v1/articles/${article.id}`,
        headers: { Authorization: authorization }
      })
      test.equal(res.statusCode, 204)
      test.equal(res.payload, '')
    })
  })
})
