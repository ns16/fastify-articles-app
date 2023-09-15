import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv({ allErrors: true, coerceTypes: true })
addFormats(ajv)

export default function compileSchema(schema) {
  return ajv.compile(schema)
}
