import { baseFiltersSchema, baseParamsSchema, errorSchema, paginationSchema } from '../../lib/base_schemas.js'
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

export const adminSchema = {
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
}

const AdminsSchemas = {
  index: {
    summary: 'Get admins paginated list',
    query: {
      type: 'object',
      properties: {
        filters: filtersSchema,
        page: { type: 'integer', minimum: 1 },
        pageSize: { type: 'integer', minimum: 1 },
        sort: sortSchema
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
            items: adminSchema
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
    tags: ['Admins']
  },
  all: {
    summary: 'Get all admins',
    query: {
      type: 'object',
      properties: {
        filters: filtersSchema,
        sort: sortSchema
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
            items: adminSchema
          }
        }
      },
      400: { ...errorSchema },
      401: { ...errorSchema }
    },
    tags: ['Admins']
  },
  show: {
    summary: 'Get specific admin',
    params: { ...baseParamsSchema },
    query: {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: adminSchema
        },
        required: ['data'],
        additionalProperties: false
      },
      400: { ...errorSchema },
      401: { ...errorSchema },
      404: { ...errorSchema }
    },
    tags: ['Admins']
  },
  create: {
    summary: 'Create new admin',
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
          data: adminSchema
        },
        required: ['data'],
        additionalProperties: false
      },
      400: { ...errorSchema },
      401: { ...errorSchema }
    },
    tags: ['Admins']
  },
  update: {
    summary: 'Update specific admin',
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
          data: adminSchema
        },
        required: ['data'],
        additionalProperties: false
      },
      400: { ...errorSchema },
      401: { ...errorSchema },
      404: { ...errorSchema }
    },
    tags: ['Admins']
  },
  destroy: {
    summary: 'Delete specific admin',
    params: { ...baseParamsSchema },
    response: {
      204: {
        type: 'null'
      },
      400: { ...errorSchema },
      401: { ...errorSchema },
      404: { ...errorSchema }
    },
    tags: ['Admins']
  }
}

export default AdminsSchemas
