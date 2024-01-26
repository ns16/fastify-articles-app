import t from 'tap'

import { describe } from './_tools/globals.js'
import { deleteAdmin, createAdmin } from './_tools/helpers.js'
import { adminSchema, adminsListSchema, paginationSchema } from './_tools/schemas.js'

describe('AdminsController (e2e)', t, (t, fastify, authorization) => {
  describe('/api/v1/admins (GET)', t, t => {
    t.test('{"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/admins',
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
        url: '/api/v1/admins',
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
        url: '/api/v1/admins',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, adminsListSchema)
      test.equal(payload.data.length, 1)
      test.matchJsonSchema(payload.pagination, paginationSchema)
      test.matchOnlyStrict(payload.pagination, {
        page: 1,
        pageSize: 10,
        rowCount: 1,
        pageCount: 1
      })
    })

    describe('paging', t, t => {
      t.test('{"query":{"page":1}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/admins',
          query: { page: 1 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, adminsListSchema)
        test.equal(payload.data.length, 1)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })

      t.test('{"query":{"page":2}} - success', async test => {
        const res = await fastify.inject({
          method: 'GET',
          url: '/api/v1/admins',
          query: { page: 2 },
          headers: { Authorization: authorization }
        })
        const payload = JSON.parse(res.payload)
        test.equal(res.statusCode, 200)
        test.matchJsonSchema(payload.data, adminsListSchema)
        test.equal(payload.data.length, 0)
        test.matchJsonSchema(payload.pagination, paginationSchema)
        test.matchOnlyStrict(payload.pagination, {
          page: 2,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        })
      })
    })
  })

  describe('/api/v1/admins/all (GET)', t, t => {
    t.test('{"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/admins/all',
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
        url: '/api/v1/admins/all',
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
        url: '/api/v1/admins/all',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, adminsListSchema)
      test.equal(payload.data.length, 1)
    })
  })

  describe('/api/v1/admins/:id (GET)', t, t => {
    t.test('{"params":{"id":1},"query":{}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/admins/1',
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
        url: '/api/v1/admins/a',
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
        url: '/api/v1/admins/100',
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
        url: '/api/v1/admins/1',
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
        url: '/api/v1/admins/1',
        query: {},
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, adminSchema)
      test.equal(payload.data.id, 1)
    })
  })

  describe('/api/v1/admins (POST)', t, t => {
    t.test('{"body":{"name":"Anatoly Muravyov","username":"test","password":"RDnB7LAR","email":"anatoly.muravyov@gmail.com"}} - 401 error, invalid token', async test => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'test',
        password: 'RDnB7LAR',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/admins',
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

    t.test('{"body":{"name":"Anatoly Muravyov","username":"ns16","password":"RDnB7LAR","email":"anatoly.muravyov@gmail.com"}} - 400 error, username field must be unique', async test => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'ns16',
        password: 'RDnB7LAR',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/admins',
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

    t.test('{"body":{"name":"Anatoly Muravyov","username":"test","password":"RDnB7LAR","email":"anatoly.muravyov+gmail.com"}} - 400 error, email must be an email', async test => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'test',
        password: 'RDnB7LAR',
        email: 'anatoly.muravyov+gmail.com'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/admins',
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

    t.test('{"body":{"name":"Anatoly Muravyov","username":"test","password":"RDnB7LAR","email":"nikolay.shamayko@gmail.com"}} - 400 error, email field must be unique', async test => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'test',
        password: 'RDnB7LAR',
        email: 'nikolay.shamayko@gmail.com'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/admins',
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

    t.test('{"body":{"name":"Anatoly Muravyov","username":"test","password":"RDnB7LAR","email":"anatoly.muravyov@gmail.com"}} - success', async test => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'test',
        password: 'RDnB7LAR',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/admins',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 201)
      test.matchJsonSchema(payload.data, adminSchema)
      test.matchStrict(payload.data, {
        name: 'Anatoly Muravyov',
        username: 'test',
        email: 'anatoly.muravyov@gmail.com'
      })
      await deleteAdmin(payload.data.id)
    })
  })

  describe('/api/v1/admins/:id (PUT)', t, t => {
    t.test('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov@gmail.com"}} - 401 error, invalid token', async test => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/admins/2',
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

    t.test('{"params":{"id":"a"},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov@gmail.com"}} - 400 error, id param must be a number', async test => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/admins/a',
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

    t.test('{"params":{"id":100},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov@gmail.com"}} - 404 error, entity not found', async test => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/admins/100',
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

    t.test('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"ns16","email":"anatoly.muravyov@gmail.com"}} - 400 error, username field must be unique', async test => {
      const admin = await createAdmin()
      const body = {
        name: 'Anatoly Muravyov',
        username: 'ns16',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: `/api/v1/admins/${admin.id}`,
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
      await deleteAdmin(admin.id)
    })

    t.test('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov+gmail.com"}} - 400 error, email must be an email', async test => {
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov+gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: '/api/v1/admins/2',
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

    t.test('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"pest","email":"nikolay.shamayko@gmail.com"}} - 400 error, email field must be unique', async test => {
      const admin = await createAdmin()
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'nikolay.shamayko@gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: `/api/v1/admins/${admin.id}`,
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
      await deleteAdmin(admin.id)
    })

    t.test('{"params":{"id":2},"body":{"name":"Anatoly Muravyov","username":"pest","email":"anatoly.muravyov@gmail.com"}} - success', async test => {
      const admin = await createAdmin()
      const body = {
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      }
      const res = await fastify.inject({
        method: 'PUT',
        url: `/api/v1/admins/${admin.id}`,
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, adminSchema)
      test.matchStrict(payload.data, {
        id: admin.id,
        name: 'Anatoly Muravyov',
        username: 'pest',
        email: 'anatoly.muravyov@gmail.com'
      })
      await deleteAdmin(admin.id)
    })
  })

  describe('/api/v1/admins/:id (DELETE)', t, t => {
    t.test('{"params":{"id":2}} - 401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/api/v1/admins/2',
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
        url: '/api/v1/admins/a',
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
        url: '/api/v1/admins/100',
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

    t.test('{"params":{"id":2}} - success', async test => {
      const admin = await createAdmin()
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/api/v1/admins/${admin.id}`,
        headers: { Authorization: authorization }
      })
      test.equal(res.statusCode, 204)
      test.equal(res.payload, '')
    })
  })
})
