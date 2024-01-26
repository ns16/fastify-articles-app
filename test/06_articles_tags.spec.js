import t from 'tap'

import { describe } from './_tools/globals.js'
import { attachTagToArticle } from './_tools/helpers.js'
import { articleWithTagsSchema } from './_tools/schemas.js'

describe('ArticlesTagsController (e2e)', t, (t, fastify, authorization) => {
  describe('/api/v1/articles-tags (POST)', t, t => {
    t.test('{"body":{"article_id":1,"tag_id":1}} - 401 error, invalid token', async test => {
      const body = {
        article_id: 1,
        tag_id: 1
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/articles-tags',
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

    t.test('{"body":{"article_id":100,"tag_id":1}} - 400 error, article model with id 100 must be exists', async test => {
      const body = {
        article_id: 100,
        tag_id: 1
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/articles-tags',
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

    t.test('{"body":{"article_id":1,"tag_id":100}} - 400 error, tag model with id 100 must be exists', async test => {
      const body = {
        article_id: 1,
        tag_id: 100
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/articles-tags',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 400)
      test.matchOnlyStrict(payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Tag model with id 100 must be exists'
      })
    })

    t.test('{"body":{"article_id":1,"tag_id":1}} - success', async test => {
      const body = {
        article_id: 1,
        tag_id: 1
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/articles-tags',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 201)
      test.matchJsonSchema(payload.data, articleWithTagsSchema)
      test.equal(payload.data.id, body.article_id)
      test.equal(payload.data.tags.filter(tag => tag.id === body.tag_id).length, 1)
    })

    t.test('{"body":{"article_id":1,"tag_id":1}} - success, tags relation already exists', async test => {
      await attachTagToArticle()
      const body = {
        article_id: 1,
        tag_id: 1
      }
      const res = await fastify.inject({
        method: 'POST',
        url: '/api/v1/articles-tags',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 201)
      test.matchJsonSchema(payload.data, articleWithTagsSchema)
      test.equal(payload.data.id, body.article_id)
      test.equal(payload.data.tags.filter(tag => tag.id === body.tag_id).length, 1)
    })
  })

  describe('/api/v1/articles-tags (DELETE)', t, t => {
    t.test('{"body":{"article_id":1,"tag_id":1}} - 401 error, invalid token', async test => {
      const body = {
        article_id: 1,
        tag_id: 1
      }
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/api/v1/articles-tags',
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

    t.test('{"body":{"article_id":100,"tag_id":1}} - 400 error, article model with id 100 must be exists', async test => {
      const body = {
        article_id: 100,
        tag_id: 1
      }
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/api/v1/articles-tags',
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

    t.test('{"body":{"article_id":1,"tag_id":100}} - success, tag does not exist', async test => {
      const body = {
        article_id: 1,
        tag_id: 100
      }
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/api/v1/articles-tags',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, articleWithTagsSchema)
      test.equal(payload.data.id, body.article_id)
      test.equal(payload.data.tags.filter(tag => tag.id === body.tag_id).length, 0)
    })

    t.test('{"body":{"article_id":1,"tag_id":1}} - success', async test => {
      await attachTagToArticle()
      const body = {
        article_id: 1,
        tag_id: 1
      }
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/api/v1/articles-tags',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, articleWithTagsSchema)
      test.equal(payload.data.id, body.article_id)
      test.equal(payload.data.tags.filter(tag => tag.id === body.tag_id).length, 0)
    })

    t.test('{"body":{"article_id":1,"tag_id":1}} - success, tags relation does not exist', async test => {
      const body = {
        article_id: 1,
        tag_id: 1
      }
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/api/v1/articles-tags',
        payload: body,
        headers: { Authorization: authorization }
      })
      const payload = JSON.parse(res.payload)
      test.equal(res.statusCode, 200)
      test.matchJsonSchema(payload.data, articleWithTagsSchema)
      test.equal(payload.data.id, body.article_id)
      test.equal(payload.data.tags.filter(tag => tag.id === body.tag_id).length, 0)
    })
  })
})
