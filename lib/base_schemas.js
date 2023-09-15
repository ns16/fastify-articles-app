export const baseFiltersSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1 },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  },
  required: [],
  additionalProperties: false
}

export const baseParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1 }
  },
  required: ['id'],
  additionalProperties: false
}

export const paginationSchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1 },
    pageSize: { type: 'integer', minimum: 1 },
    rowCount: { type: 'integer', minimum: 0 },
    pageCount: { type: 'integer', minimum: 0 }
  },
  required: [
    'page',
    'pageSize',
    'rowCount',
    'pageCount'
  ],
  additionalProperties: false
}

export const errorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'integer' },
    error: { type: 'string' },
    message: { type: 'string' }
  },
  required: [
    'statusCode',
    'error',
    'message'
  ],
  additionalProperties: false
}
