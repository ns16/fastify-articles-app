import { omit } from 'lodash-es'
import { articleSchema } from './articles.js'
import { errorSchema } from '../../lib/base_schemas.js'

export const articleWithTagsSchema = {
  type: 'object',
  properties: {
    ...omit(articleSchema.properties, ['user', 'content'])
  },
  required: [
    ...articleSchema.required,
    'tags'
  ],
  additionalProperties: false
}

const ArticlesTagsSchemas = {
  create: {
    summary: 'Create article-tag relation',
    body: {
      type: 'object',
      properties: {
        article_id: { type: 'integer', minimum: 1 },
        tag_id: { type: 'integer', minimum: 1 }
      },
      required: [
        'article_id',
        'tag_id'
      ],
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: articleWithTagsSchema
        },
        required: ['data'],
        additionalProperties: false
      },
      400: { ...errorSchema },
      401: { ...errorSchema }
    },
    tags: ['Articles-Tags']
  },
  destroy: {
    summary: 'Delete article-tag relation',
    body: {
      type: 'object',
      properties: {
        article_id: { type: 'integer', minimum: 1 },
        tag_id: { type: 'integer', minimum: 1 }
      },
      required: [
        'article_id',
        'tag_id'
      ],
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: articleWithTagsSchema
        },
        required: ['data'],
        additionalProperties: false
      },
      400: { ...errorSchema },
      401: { ...errorSchema }
    },
    tags: ['Articles-Tags']
  }
}

export default ArticlesTagsSchemas
