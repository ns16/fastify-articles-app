export default function prepareFiltersSchema(filtersSchema) {
  const newProperties = {}
  for (const property in filtersSchema.properties) {
    if (!Object.prototype.hasOwnProperty.call(filtersSchema.properties, property)) continue
    newProperties[property] = filtersSchema.properties[property]
    if (['number', 'integer'].includes(filtersSchema.properties[property].type)) {
      newProperties[`${property}__gt`] = filtersSchema.properties[property]
      newProperties[`${property}__gte`] = filtersSchema.properties[property]
      newProperties[`${property}__lt`] = filtersSchema.properties[property]
      newProperties[`${property}__lte`] = filtersSchema.properties[property]
      newProperties[`${property}__ne`] = filtersSchema.properties[property]
      newProperties[`${property}__eq`] = filtersSchema.properties[property]
      newProperties[`${property}__between`] = {
        type: 'array', minItems: 2, maxItems: 2, items: filtersSchema.properties[property]
      }
      newProperties[`${property}__notBetween`] = {
        type: 'array', minItems: 2, maxItems: 2, items: filtersSchema.properties[property]
      }
      newProperties[`${property}__in`] = {
        type: 'array', minItems: 1, items: filtersSchema.properties[property]
      }
      newProperties[`${property}__notIn`] = {
        type: 'array', minItems: 1, items: filtersSchema.properties[property]
      }
    } else if (filtersSchema.properties[property].type === 'string') {
      newProperties[`${property}__ne`] = filtersSchema.properties[property]
      newProperties[`${property}__eq`] = filtersSchema.properties[property]
      newProperties[`${property}__in`] = {
        type: 'array', minItems: 1, items: filtersSchema.properties[property]
      }
      newProperties[`${property}__notIn`] = {
        type: 'array', minItems: 1, items: filtersSchema.properties[property]
      }
      if (!['date', 'time', 'date-time'].includes(filtersSchema.properties[property].format)) {
        newProperties[`${property}__like`] = filtersSchema.properties[property]
        newProperties[`${property}__notLike`] = filtersSchema.properties[property]
      }
    } else if (['boolean', 'null'].includes(filtersSchema.properties[property].type)) {
      newProperties[`${property}__ne`] = filtersSchema.properties[property]
      newProperties[`${property}__eq`] = filtersSchema.properties[property]
    } else {
      throw Error(`${filtersSchema.properties[property].type} type is not supported by filters`)
    }
  }
  return { ...filtersSchema, properties: newProperties }
}
