import { PrismaClient } from '@prisma/client'

import hash from '../prisma/extensions/hash.js'

const prisma = new PrismaClient().$extends(hash(['User', 'Admin'], ['password']))

export default prisma
