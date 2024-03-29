import { baseFiltersSchema, baseParamsSchema, errorSchema, paginationSchema } from '../../lib/base_schemas.js'
import prepareFiltersSchema from '../../lib/prepare_filters_schema.js'
import prepareSortSchema from '../../lib/prepare_sort_schema.js'

const sorts = [
  'id',
  'user_id',
  'title',
  'description',
  'status',
  'created_at',
  'updated_at'
]

const includes = [
  'user',
  'content',
  'tags'
]

const filtersSchema = prepareFiltersSchema({
  ...baseFiltersSchema,
  type: 'object',
  properties: {
    user_id: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 1, maxLength: 100 },
    description: { type: 'string', minLength: 1, maxLength: 500 },
    status: { type: 'string', minLength: 1, maxLength: 100 },
    ...baseFiltersSchema.properties
  },
  required: [],
  additionalProperties: false
})

const sortSchema = prepareSortSchema({ type: 'string', enum: sorts })

export const articleSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1 },
    user_id: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 1, maxLength: 100 },
    description: { type: 'string', minLength: 1, maxLength: 500 },
    status: { type: 'string', enum: ['published', 'draft'] },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
    user: {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1 },
        name: { type: 'string', minLength: 1, maxLength: 100 },
        username: { type: 'string', minLength: 1, maxLength: 100 },
        email: { type: 'string', minLength: 1, maxLength: 100, format: 'email' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      },
      required: [
        'id',
        'name',
        'username',
        'email',
        'created_at',
        'updated_at'
      ],
      additionalProperties: false
    },
    content: {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1 },
        article_id: { type: 'integer', minimum: 1 },
        body: { type: 'string', minLength: 1 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      },
      required: [
        'id',
        'article_id',
        'body',
        'created_at',
        'updated_at'
      ],
      additionalProperties: false
    },
    tags: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', minimum: 1 },
          name: { type: 'string', minLength: 1, maxLength: 100 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        },
        required: [
          'id',
          'name',
          'created_at',
          'updated_at'
        ],
        additionalProperties: false
      }
    }
  },
  required: [
    'id',
    'user_id',
    'title',
    'description',
    'status',
    'created_at',
    'updated_at'
  ],
  additionalProperties: false
}

const ArticlesSchemas = {
  index: {
    summary: 'Get articles paginated list',
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
            items: articleSchema
          },
          pagination: paginationSchema
        },
        required: [
          'data',
          'pagination'
        ],
        additionalProperties: false
      },
      400: { ...errorSchema },
      401: { ...errorSchema }
    },
    tags: ['Articles']
  },
  all: {
    summary: 'Get all articles',
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
            items: articleSchema
          }
        }
      },
      400: { ...errorSchema },
      401: { ...errorSchema }
    },
    tags: ['Articles']
  },
  show: {
    summary: 'Get specific article',
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
          data: articleSchema
        },
        required: ['data'],
        additionalProperties: false
      },
      400: { ...errorSchema },
      401: { ...errorSchema },
      404: { ...errorSchema }
    },
    tags: ['Articles']
  },
  create: {
    summary: 'Create new article',
    body: {
      type: 'object',
      properties: {
        user_id: { type: 'integer', minimum: 1 },
        title: { type: 'string', minLength: 1, maxLength: 100 },
        description: { type: 'string', minLength: 1, maxLength: 500 },
        status: { type: 'string', enum: ['published', 'draft'] }
      },
      required: [
        'user_id',
        'title',
        'description',
        'status'
      ],
      additionalProperties: false
    },
    response: {
      201: {
        type: 'object',
        properties: {
          data: articleSchema
        },
        required: ['data'],
        additionalProperties: false
      },
      400: { ...errorSchema },
      401: { ...errorSchema }
    },
    tags: ['Articles']
  },
  update: {
    summary: 'Update specific article',
    params: { ...baseParamsSchema },
    body: {
      type: 'object',
      properties: {
        user_id: { type: 'integer', minimum: 1 },
        title: { type: 'string', minLength: 1, maxLength: 100 },
        description: { type: 'string', minLength: 1, maxLength: 500 },
        status: { type: 'string', enum: ['published', 'draft'] }
      },
      required: [
        'user_id',
        'title',
        'description',
        'status'
      ],
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: articleSchema
        },
        required: ['data'],
        additionalProperties: false
      },
      400: { ...errorSchema },
      401: { ...errorSchema },
      404: { ...errorSchema }
    },
    tags: ['Articles']
  },
  destroy: {
    summary: 'Delete specific article',
    params: { ...baseParamsSchema },
    response: {
      204: {
        type: 'null'
      },
      400: { ...errorSchema },
      401: { ...errorSchema },
      404: { ...errorSchema }
    },
    tags: ['Articles']
  }
}

export default ArticlesSchemas
