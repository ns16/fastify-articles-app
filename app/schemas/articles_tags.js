import { omit } from 'lodash-es'
import { articleSchema } from './articles.js'

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
          data: articleSchema
        }
      }
    }
  },
  destroy: {
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
          data: articleSchema
        }
      }
    }
  }
}

export default ArticlesTagsSchemas
