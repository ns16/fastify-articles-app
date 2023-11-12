import { baseFiltersSchema, baseParamsSchema, paginationSchema } from '../../lib/base_schemas.js'
import prepareFiltersSchema from '../../lib/prepare_filters_schema.js'
import prepareSortSchema from '../../lib/prepare_sort_schema.js'

const sorts = [
  'id',
  'name',
  'username',
  'email',
  'created_at',
  'updated_at'
]

const includes = ['articles']

const filtersSchema = prepareFiltersSchema({
  ...baseFiltersSchema,
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    username: { type: 'string', minLength: 1, maxLength: 100 },
    email: { type: 'string', minLength: 1, maxLength: 100 },
    ...baseFiltersSchema.properties
  },
  required: [],
  additionalProperties: false
})

const sortSchema = prepareSortSchema({ type: 'string', enum: sorts })

export const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1 },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    username: { type: 'string', minLength: 1, maxLength: 100 },
    email: { type: 'string', minLength: 1, maxLength: 100, format: 'email' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
    articles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', minimum: 1 },
          user_id: { type: 'integer', minimum: 1 },
          title: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', minLength: 1, maxLength: 500 },
          status: { type: 'string', enum: ['published', 'draft'] },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
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
    }
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
}

const UsersSchemas = {
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
            items: userSchema
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
            items: userSchema
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
          data: userSchema
        }
      }
    }
  },
  create: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        username: { type: 'string', minLength: 1, maxLength: 100 },
        password: { type: 'string', minLength: 6, maxLength: 50 },
        email: { type: 'string', minLength: 1, maxLength: 100, format: 'email' }
      },
      required: [
        'name',
        'username',
        'password',
        'email'
      ],
      additionalProperties: false
    },
    response: {
      201: {
        type: 'object',
        properties: {
          data: userSchema
        }
      }
    }
  },
  update: {
    params: { ...baseParamsSchema },
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        username: { type: 'string', minLength: 1, maxLength: 100 },
        password: { type: 'string', minLength: 6, maxLength: 50 },
        email: { type: 'string', minLength: 1, maxLength: 100, format: 'email' }
      },
      required: [
        'name',
        'username',
        'email'
      ],
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: userSchema
        }
      }
    }
  },
  destroy: {
    params: { ...baseParamsSchema }
  }
}

export default UsersSchemas
