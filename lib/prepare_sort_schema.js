export default function prepareSortSchema(sortSchema) {
  return { ...sortSchema, enum: sortSchema.enum.reduce((res, val) => ([...res, val, `-${val}`]), []) }
}
