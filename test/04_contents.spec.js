import t from 'tap'

import { describe } from './_tools/globals.js'
import { deleteArticle, createArticle, deleteContent, createContent } from './_tools/helpers.js'
import {
  contentSchema,
  contentsListSchema,
  contentsWithArticleListSchema,
  contentWithArticleSchema,
  paginationSchema
} from './_tools/schemas.js'

describe('ContentsController (e2e)', t, (t, fastify, authorization) => {
  describe('/api/v1/contents (GET)', t, t => {
    t.test('{"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/contents',
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
        url: '/api/v1/contents',
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
        url: '/api/v1/contents',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { page: 1 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { page: 2 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { page: 3 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { pageSize: 20 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { pageSize: 30 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { sort: 'id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { sort: '-id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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

      t.test('{"query":{"sort":"body"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents',
          query: { sort: 'body' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 10)
        test.equal(
          payload.data[0].body,
          'Ab eum hic occaecati nisi magnam. Iusto inventore vero ea laborum libero exercitationem nam. Repudiandae nobis quis aspernatur.\n' +
          'Corporis libero autem odio in hic nostrum. Inventore molestias dicta molestias esse. Officiis optio inventore vero tempore error quasi aperiam earum tenetur.\n' +
          'Quae temporibus totam et molestias quas incidunt. Harum incidunt quo veniam aliquam neque ab ab possimus expedita. Quaerat non quod tempore.'
        )
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        })
      })

      t.test('{"query":{"sort:"-body"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents',
          query: { sort: '-body' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 10)
        test.equal(
          payload.data[0].body,
          'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
        )
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
          url: '/api/v1/contents',
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

      t.test('{"query":{"includes":["article"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents',
          query: { 'includes[]': 'article' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsWithArticleListSchema)
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
          url: '/api/v1/contents',
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
          url: '/api/v1/contents',
          query: { 'filters[id__gt]': 15 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { 'filters[id__gte]': 15 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { 'filters[id__lt]': 6 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { 'filters[id__lte]': 6 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: {
            'filters[id__gte]': 17,
            'filters[id__lte]': 4
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: {
            'filters[id__lte]': 4,
            'filters[id__gte]': 17
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { 'filters[id__eq]': 10 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { 'filters[id__ne]': 10 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { 'filters[id__between]': [8, 13] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { 'filters[id__notBetween]': [8, 13] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { 'filters[id__in]': [2, 10, 18] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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
          url: '/api/v1/contents',
          query: { 'filters[id__notIn]': [2, 10, 18] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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

      t.test('{"query":{"filters[body__foo]":"..."}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents',
          query: {
            'filters[body__foo]':
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
          },
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

      t.test('{"query":{"filters[body__eq]":"..."}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents',
          query: {
            'filters[body__eq]':
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(
          item.body,
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
        ))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[body__ne]":"..."}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents',
          query: {
            'filters[body__ne]':
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 10)
        payload.data.forEach(item => test.not(
          item.body,
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
        ))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 19,
          pageCount: 2
        })
      })

      t.test('{"query":{"filters[body__in]":["...","..."]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents',
          query: {
            'filters[body__in]': [
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
              'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
              'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
              'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
            ]
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.equal([
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
          'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
        ].includes(item.body), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 2,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[body__notIn]":["...","..."]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents',
          query: {
            'filters[body__notIn]': [
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
              'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
              'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
              'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
            ]
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 10)
        payload.data.forEach(item => test.not([
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
          'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
        ].includes(item.body), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 18,
          pageCount: 2
        })
      })

      t.test('{"query":{"filters[body__like]":"ab"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents',
          query: { 'filters[body__like]': 'ab' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 10)
        payload.data.forEach(item => test.equal(item.body.includes('ab'), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 15,
          pageCount: 2
        })
      })

      t.test('{"query":{"filters[body__notLike]":"ab"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents',
          query: { 'filters[body__notLike]': 'ab' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.not(item.body.includes('ab'), true))
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        })
      })

      t.test('{"query":{"filters[body__like]":"ab","filters[body__notLike]":"ab"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents',
          query: {
            'filters[body__like]': 'ab',
            'filters[body__notLike]': 'ab'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 0,
          pageCount: 0
        })
      })

      t.test('{"query":{"filters[body__notLike]":"ab","filters[body__like]":"ab"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents',
          query: {
            'filters[body__notLike]': 'ab',
            'filters[body__like]': 'ab'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
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

  describe('/api/v1/contents/all (GET)', t, t => {
    t.test('{"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/contents/all',
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
        url: '/api/v1/contents/all',
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
        url: '/api/v1/contents/all',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, contentsListSchema)
      test.equal(payload.data.length, 20)
    })

    describe('sort', t, t => {
      t.test('{"query":{"sort":"id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { sort: 'id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 20)
        test.equal(payload.data[0].id, 1)
      })

      t.test('{"query":{"sort":"-id"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { sort: '-id' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 20)
        test.equal(payload.data[0].id, 20)
      })

      t.test('{"query":{"sort":"body"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { sort: 'body' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 20)
        test.equal(
          payload.data[0].body,
          'Ab eum hic occaecati nisi magnam. Iusto inventore vero ea laborum libero exercitationem nam. Repudiandae nobis quis aspernatur.\n' +
          'Corporis libero autem odio in hic nostrum. Inventore molestias dicta molestias esse. Officiis optio inventore vero tempore error quasi aperiam earum tenetur.\n' +
          'Quae temporibus totam et molestias quas incidunt. Harum incidunt quo veniam aliquam neque ab ab possimus expedita. Quaerat non quod tempore.'
        )
      })

      t.test('{"query":{"sort":"-body"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { sort: '-body' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 20)
        test.equal(
          payload.data[0].body,
          'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
        )
      })
    })

    describe('includes', t, t => {
      t.test('{"query":{"includes":["foo"]}} - 400 error, invalid include value', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
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

      t.test('{"query":{"includes":["article"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { 'includes[]': 'article' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsWithArticleListSchema)
        test.equal(payload.data.length, 20)
      })
    })

    describe('filters', t, t => {
      t.test('{"query":{"filters[id__foo]":15}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
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
          url: '/api/v1/contents/all',
          query: { 'filters[id__gt]': 15 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.equal(item.id > 15, true))
      })

      t.test('{"query":{"filters[id__gte]":15}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { 'filters[id__gte]': 15 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 6)
        payload.data.forEach(item => test.equal(item.id >= 15, true))
      })

      t.test('{"query":{"filters[id__lt]":6}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { 'filters[id__lt]': 6 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.equal(item.id < 6, true))
      })

      t.test('{"query":{"filters[id__lte]":6}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { 'filters[id__lte]': 6 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 6)
        payload.data.forEach(item => test.equal(item.id <= 6, true))
      })

      t.test('{"query":{"filters[id__gte]":17,"filters[id__lte]":4}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: {
            'filters[id__gte]': 17,
            'filters[id__lte]': 4
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 0)
      })

      t.test('{"query":{"filters[id__lte]":4,"filters[id__gte]":17}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: {
            'filters[id__lte]': 4,
            'filters[id__gte]': 17
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 0)
      })

      t.test('{"query":{"filters[id__eq]":10}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { 'filters[id__eq]': 10 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(item.id, 10))
      })

      t.test('{"query":{"filters[id__ne]":10}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { 'filters[id__ne]': 10 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 19)
        payload.data.forEach(item => test.not(item.id, 10))
      })

      t.test('{"query":{"filters[id__between]":[8,13]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { 'filters[id__between]': [8, 13] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 6)
        payload.data.forEach(item => test.equal(item.id >= 8 && item.id <= 13, true))
      })

      t.test('{"query":{"filters[id__notBetween]":[8,13]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { 'filters[id__notBetween]': [8, 13] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 14)
        payload.data.forEach(item => test.not(item.id >= 8 && item.id <= 13, true))
      })

      t.test('{"query":{"filters[id__in]":[2,10,18]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { 'filters[id__in]': [2, 10, 18] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 3)
        payload.data.forEach(item => test.equal([2, 10, 18].includes(item.id), true))
      })

      t.test('{"query":{"filters[id__notIn]":[2,5,8]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { 'filters[id__notIn]': [2, 10, 18] },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 17)
        payload.data.forEach(item => test.not([2, 10, 18].includes(item.id), true))
      })

      t.test('{"query":{"filters[body__foo]":"..."}} - 400 error, invalid filter operator', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: {
            'filters[body__foo]':
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
          },
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

      t.test('{"query":{"filters[body__eq]":"..."}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: {
            'filters[body__eq]':
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 1)
        payload.data.forEach(item => test.equal(
          item.body,
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
        ))
      })

      t.test('{"query":{"filters[body__ne]":"..."}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: {
            'filters[body__ne]':
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 19)
        payload.data.forEach(item => test.not(
          item.body,
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.'
        ))
      })

      t.test('{"query":{"filters[body__in]":["...","..."]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: {
            'filters[body__in]': [
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
              'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
              'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
              'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
            ]
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 2)
        payload.data.forEach(item => test.equal([
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
          'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
        ].includes(item.body), true))
      })

      t.test('{"query":{"filters[body__notIn]":["...","..."]}} - 400 error, invalid filter value', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: {
            'filters[body__notIn]': [
              'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
              'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
              'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
              'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
              'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
              'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
            ]
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 18)
        payload.data.forEach(item => test.not([
          'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae.\n' +
          'Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium.\n' +
          'Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
          'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui.\n' +
          'Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat.\n' +
          'Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.'
        ].includes(item.body), true))
      })

      t.test('{"query":{"filters[body__like]":"ab"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { 'filters[body__like]': 'ab' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 15)
        payload.data.forEach(item => test.equal(item.body.includes('ab'), true))
      })

      t.test('{"query":{"filters[body__notLike]":"ab"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: { 'filters[body__notLike]': 'ab' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 5)
        payload.data.forEach(item => test.not(item.body.includes('ab'), true))
      })

      t.test('{"query":{"filters[body__like]":"ab","filters[body__notLike]":"ab"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: {
            'filters[body__like]': 'ab',
            'filters[body__notLike]': 'ab'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 0)
      })

      t.test('{"query":{"filters[body__notLike]":"ab","filters[body__like]":"ab"}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/all',
          query: {
            'filters[body__notLike]': 'ab',
            'filters[body__like]': 'ab'
          },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentsListSchema)
        test.equal(payload.data.length, 0)
      })
    })
  })

  describe('/api/v1/contents/:id (GET)', t, t => {
    t.test('{"params":{"id":1},"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/contents/1',
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
        url: '/api/v1/contents/a',
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
        url: '/api/v1/contents/100',
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
        url: '/api/v1/contents/1',
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
        url: '/api/v1/contents/1',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, contentSchema)
      test.equal(payload.data.id, 1)
    })

    describe('includes', t, t => {
      t.test('{"params":{"id":1},{"query":{"includes":["foo"]}} - 400 error, invalid include value', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/1',
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

      t.test('{"params":{"id":1},{"query":{"includes":["article"]}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/contents/1',
          query: { 'includes[]': 'article' },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, contentWithArticleSchema)
        test.equal(payload.data.id, 1)
      })
    })
  })

  describe('/api/v1/contents (POST)', t, t => {
    t.test('{"body":{"article_id":21,"body":"..."}} - 401 error, invalid token', async test => {
      const body = {
        article_id: 21,
        body:
          'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/contents',
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

    t.test('{"body":{"article_id":100,"body":"..."}} - 400 error, article model with id 100 must be exists', async test => {
      const body = {
        article_id: 100,
        body:
          'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/contents',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Article model with id 100 must be exists'
      })
    })

    t.test('{"body":{"article_id":1,"body":"..."}} - 400 error, article_id field must be unique', async test => {
      const body = {
        article_id: 1,
        body:
          'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/contents',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'article_id field must be unique'
      })
    })

    t.test('{"body":{"article_id":21,"body":"..."}} - success', async test => {
      const article = await createArticle()
      const body = {
        article_id: article.id,
        body:
          'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/contents',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 201)
      test.matchJsonSchema(payload.data, contentSchema)
      test.matchStrict(payload.data, {
        article_id: article.id,
        body:
          'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      })
      if (payload.data?.id) await deleteContent(payload.data.id)
      await deleteArticle(article.id)
    })
  })

  describe('/api/v1/contents/:id (PUT)', t, t => {
    t.test('{"params":{"id":21},"body":{"article_id":21,"body":"..."}} - 401 error, invalid token', async test => {
      const body = {
        article_id: 21,
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/contents/21',
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

    t.test('{"params":{"id":"a"},"body":{"article_id":21,"body":"..."}} - 400 error, id param must be a number', async test => {
      const body = {
        article_id: 21,
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/contents/a',
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

    t.test('{"params":{"id":100},"body":{"article_id":21,"body":"..."}} - 404 error, entity not found', async test => {
      const body = {
        article_id: 21,
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/contents/100',
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

    t.test('{"params":{"id":21},"body":{"article_id":100,"body":"..."}} - 400 error, article model with id 100 must be exists', async test => {
      const content = await createContent()
      const body = {
        article_id: 100,
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: `/api/v1/contents/${content.id}`,
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Article model with id 100 must be exists'
      })
      await deleteContent(content.id)
    })

    t.test('{"params":{"id":21},"body":{"article_id":1,"body":"..."}} - 400 error, article_id field must be unique', async test => {
      const content = await createContent()
      const body = {
        article_id: 1,
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: `/api/v1/contents/${content.id}`,
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'article_id field must be unique'
      })
      await deleteContent(content.id)
    })

    t.test('{"params":{"id":21},"body":{"article_id":21,"body":"..."}} - success', async test => {
      const content = await createContent()
      const body = {
        article_id: content.article_id,
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: `/api/v1/contents/${content.id}`,
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, contentSchema)
      test.matchStrict(payload.data, {
        id: content.id,
        article_id: content.article_id,
        body:
          'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
          'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
          'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
      })
      await deleteContent(content.id)
    })
  })

  describe('/api/v1/contents/:id (DELETE)', t, t => {
    t.test('{"params":{"id":21}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/api/v1/contents/21',
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
        url: '/api/v1/contents/a',
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
        url: '/api/v1/contents/100',
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
      const content = await createContent()
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/api/v1/contents/${content.id}`,
        headers: { Authorization: authorization }
      })
      test.equal(res.statusCode, 204)
      test.equal(res.payload, '')
    })
  })
})
