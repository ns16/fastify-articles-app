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
        }
      }
    }
  },
  all: {
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
      }
    }
  },
  show: {
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
          data: adminSchema
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
          data: adminSchema
        }
      }
    }
  },
  destroy: {
    params: { ...baseParamsSchema }
  }
}

export default AdminsSchemas
