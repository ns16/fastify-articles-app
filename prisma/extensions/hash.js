import { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'

export default (models, fields) => Prisma.defineExtension({
  query: {
    $allModels: {
      $allOperations({ model, operation, args, query }) {
        if (!(models.includes(model) && ['create', 'update'].includes(operation))) return query(args)
        for (const field of fields) {
          if (args.data[field] == null) continue
          args.data.password = bcrypt.hashSync(args.data[field], 12)
        }
        return query(args)
      }
    }
  }
})
