import t from 'tap'

import { describe } from './_tools/globals.js'
import { adminSchema } from './_tools/schemas.js'

describe('AuthController (e2e)', t, (t, fastify, authorization) => {
  describe('/api/v1/auth/login (POST)', t, t => {
    t.test('{"body":{"username":"ns17","password":"123456"}} - 401 error, invalid username', async test => {
      const body = {
        username: 'ns17',
        password: '123456'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: body
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 401)
      test.matchOnlyStrict(payload, {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid username or password'
      })
    })

    t.test('{"body":{"username":"ns16","password":"123457"}} - 401 error, invalid password', async test => {
      const body = {
        username: 'ns16',
        password: '123457'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: body
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 401)
      test.matchOnlyStrict(payload, {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid username or password'
      })
    })

    t.test('{"body":{"username":"ns16","password":"123456"}} - success', async test => {
      const body = {
        username: 'ns16',
        password: '123456'
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: body
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, adminSchema)
      test.matchStrict(payload.data, {
        id: 1,
        username: 'ns16'
      })
    })
  })

  describe('/api/v1/auth/me (GET)', t, t => {
    t.test('401 error, invalid token', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/auth/me',
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

    t.test('success', async test => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/api/v1/auth/me',
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, adminSchema)
      test.matchStrict(payload.data, {
        id: 1,
        username: 'ns16'
      })
    })
  })
})
