import prisma from '../../lib/prisma.js'
import SeedsManager from '../../lib/seeds_manager.js'

async function main() {
  await SeedsManager.revert()
  await SeedsManager.run()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async error => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
