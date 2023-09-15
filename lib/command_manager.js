import { exec } from 'node:child_process'
import util from 'node:util'

const execPromise = util.promisify(exec)

export default class CommandManager {
  static async run(command, options = { verbose: false }) {
    const { stdout, stderr } = await execPromise(command)
    if (options.verbose) {
      console.log(stdout ?? stderr) // eslint-disable-line no-console
    }
  }
}
