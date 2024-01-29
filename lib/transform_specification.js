let filtersExamples = []
let bodyExamples = {}
let responseExamples = {}

try {
  const examples = await import('../examples.js')
  filtersExamples = examples.filtersExamples
  bodyExamples = examples.bodyExamples
  responseExamples = examples.responseExamples
} catch (error) {
  // Ignore cases when the file is not found
}

const descriptions = {
  200: 'OK',
  201: 'Created',
  204: 'No content',
  400: 'Bad Request',
  401: 'Unauthorized',
  404: 'Not Found'
}

const fixIncludesParameters = (path, method, methodObject) => {
  if ([
    '/api/v1/admins',
    '/api/v1/admins/all',
    '/api/v1/admins/{id}',
    '/api/v1/articles',
    '/api/v1/articles/all',
    '/api/v1/articles/{id}',
    '/api/v1/contents',
    '/api/v1/contents/all',
    '/api/v1/contents/{id}',
    '/api/v1/tags',
    '/api/v1/tags/all',
    '/api/v1/tags/{id}',
    '/api/v1/users',
    '/api/v1/users/all',
    '/api/v1/users/{id}'
  ].includes(path) && method === 'get') {
    const includesSchema = methodObject.parameters?.find(parameter => parameter.name === 'includes')
    if (includesSchema) {
      includesSchema.name = 'includes[]'
    }
  }
}

const setFiltersExamples = (path, method, methodObject) => {
  if ([
    '/api/v1/admins',
    '/api/v1/admins/all',
    '/api/v1/articles',
    '/api/v1/articles/all',
    '/api/v1/contents',
    '/api/v1/contents/all',
    '/api/v1/tags',
    '/api/v1/tags/all',
    '/api/v1/users',
    '/api/v1/users/all'
  ].includes(path) && method === 'get') {
    const filtersSchema = methodObject.parameters?.find(parameter => parameter.name === 'filters')
    if (filtersSchema && filtersExamples.length) {
      filtersSchema.examples = filtersExamples.reduce((res, filtersExample, i) => ({
        ...res,
        [`Example ${i + 1}`]: { value: filtersExample }
      }), {})
    }
  }
}

const setBodyExamples = (path, method, methodObject) => {
  const bodySchema = methodObject?.requestBody?.content?.['application/json']
  if (
    bodySchema &&
    bodyExamples[path] &&
    bodyExamples[path][method]
  ) {
    if (bodyExamples[path][method].length > 1) {
      bodySchema.examples = bodyExamples[path][method].reduce((res, bodyExample, i) => ({
        ...res,
        [`Example ${i + 1}`]: { value: bodyExample }
      }), {})
    } else {
      const [bodyExample] = bodyExamples[path][method]
      bodySchema.example = bodyExample
    }
  }
}

const setResponseExamples = (path, method, methodObject) => {
  for (const [statusCode, responseObject] of Object.entries(methodObject.responses)) {
    const bodySchema = responseObject?.content?.['application/json']
    if (
      bodySchema &&
      responseExamples[path] &&
      responseExamples[path][method] &&
      responseExamples[path][method][statusCode]
    ) {
      if (responseExamples[path][method][statusCode].length > 1) {
        bodySchema.examples = responseExamples[path][method][statusCode].reduce((res, responseExample, i) => ({
          ...res,
          [`Example ${i + 1}`]: { value: responseExample }
        }), {})
      } else {
        const [responseExample] = responseExamples[path][method][statusCode]
        bodySchema.example = responseExample
      }
    }
  }
}

const fixResponseDescription = (path, method, methodObject) => {
  for (const [statusCode, responseObject] of Object.entries(methodObject.responses)) {
    if (responseObject.description) {
      responseObject.description = descriptions[statusCode]
    }
  }
}

export default function transformSpecification(swaggerObject) {
  for (const [path, pathObject] of Object.entries(swaggerObject.paths)) {
    for (const [method, methodObject] of Object.entries(pathObject)) {
      fixIncludesParameters(path, method, methodObject)
      setFiltersExamples(path, method, methodObject)
      setBodyExamples(path, method, methodObject)
      setResponseExamples(path, method, methodObject)
      fixResponseDescription(path, method, methodObject)
    }
  }
  return swaggerObject
}
