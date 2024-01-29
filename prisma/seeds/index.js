import prisma from '../../lib/prisma.js'
import SeedsManager from '../../lib/seeds_manager.js'

/* c8 ignore start */
async function main() {
  await SeedsManager.revert()
  await SeedsManager.run()
}
/* c8 ignore stop */

/* c8 ignore start */
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async error => {
    console.error(error) // eslint-disable-line no-console
    await prisma.$disconnect()
    process.exit(1)
  })
/* c8 ignore stop */
