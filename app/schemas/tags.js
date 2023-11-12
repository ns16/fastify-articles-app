import { baseFiltersSchema, baseParamsSchema, paginationSchema } from '../../lib/base_schemas.js'
import prepareFiltersSchema from '../../lib/prepare_filters_schema.js'
import prepareSortSchema from '../../lib/prepare_sort_schema.js'

const sorts = [
  'id',
  'name',
  'created_at',
  'updated_at'
]

const includes = ['articles']

const filtersSchema = prepareFiltersSchema({
  ...baseFiltersSchema,
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    ...baseFiltersSchema.properties
  },
  required: [],
  additionalProperties: false
})

const sortSchema = prepareSortSchema({ type: 'string', enum: sorts })

export const tagSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1 },
    name: { type: 'string', minLength: 1, maxLength: 100 },
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
    'created_at',
    'updated_at'
  ],
  additionalProperties: false
}

const TagsSchemas = {
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
            items: tagSchema
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
            items: tagSchema
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
          data: tagSchema
        }
      }
    }
  },
  create: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 }
      },
      required: ['name'],
      additionalProperties: false
    },
    response: {
      201: {
        type: 'object',
        properties: {
          data: tagSchema
        }
      }
    }
  },
  update: {
    params: { ...baseParamsSchema },
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 }
      },
      required: ['name'],
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: tagSchema
        }
      }
    }
  },
  destroy: {
    params: { ...baseParamsSchema }
  }
}

export default TagsSchemas
