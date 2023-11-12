import { baseFiltersSchema, baseParamsSchema, paginationSchema } from '../../lib/base_schemas.js'
import prepareFiltersSchema from '../../lib/prepare_filters_schema.js'
import prepareSortSchema from '../../lib/prepare_sort_schema.js'

const sorts = [
  'id',
  'article_id',
  'body',
  'created_at',
  'updated_at'
]

const includes = ['article']

const filtersSchema = prepareFiltersSchema({
  ...baseFiltersSchema,
  type: 'object',
  properties: {
    article_id: { type: 'integer', minimum: 1 },
    body: { type: 'string', minLength: 1 },
    ...baseFiltersSchema.properties
  },
  required: [],
  additionalProperties: false
})

const sortSchema = prepareSortSchema({ type: 'string', enum: sorts })

export const contentSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1 },
    article_id: { type: 'integer', minimum: 1 },
    body: { type: 'string', minLength: 1 },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
    article: {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1 },
        user_id: { type: 'integer', minimum: 1 },
        title: { type: 'string', minLength: 1, maxLength: 100 },
        description: { type: 'string', minLength: 1, maxLength: 500 },
        status: { type: 'string', enum: ['published', 'draft'] },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  },
  required: [
    'id',
    'article_id',
    'body',
    'created_at',
    'updated_at'
  ],
  additionalProperties: false
}

const ContentsSchemas = {
  index: {
    query: {
      type: 'object',
      properties: {
        filters: filtersSchema,
        page: { type: 'integer', minimum: 1 },
        pageSize: { type: 'integer', minimum: 1 },
        sort: sortSchema,
        includes: { type: 'array', items: { type: 'string', enum: includes } }
      },
      required: [],
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: contentSchema
          },
          pagination: paginationSchema
        }
      }
    }
  },
  all: {
    query: {
      type: 'object',
      properties: {
        filters: filtersSchema,
        sort: sortSchema,
        includes: { type: 'array', items: { type: 'string', enum: includes } }
      },
      required: [],
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: contentSchema
          }
        }
      }
    }
  },
  show: {
    params: { ...baseParamsSchema },
    query: {
      type: 'object',
      properties: {
        includes: { type: 'array', items: { type: 'string', enum: includes } }
      },
      required: [],
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: contentSchema
        }
      }
    }
  },
  create: {
    body: {
      type: 'object',
      properties: {
        article_id: { type: 'integer', minimum: 1 },
        body: { type: 'string', minLength: 1 }
      },
      required: [
        'article_id',
        'body'
      ],
      additionalProperties: false
    },
    response: {
      201: {
        type: 'object',
        properties: {
          data: contentSchema
        }
      }
    }
  },
  update: {
    params: { ...baseParamsSchema },
    body: {
      type: 'object',
      properties: {
        article_id: { type: 'integer', minimum: 1 },
        body: { type: 'string', minLength: 1 }
      },
      required: [
        'article_id',
        'body'
      ],
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: contentSchema
        }
      }
    }
  },
  destroy: {
    params: { ...baseParamsSchema }
  }
}

export default ContentsSchemas
