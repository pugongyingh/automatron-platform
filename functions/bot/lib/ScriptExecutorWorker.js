const { VM } = require('vm2')
const fetch = require('node-fetch')
const serialize = require('serialize-javascript')
const util = require('util')

/**
 * @param {import('./ScriptExecution').ScriptExecutionInput} options
 */
module.exports = async function(options, callback) {
  /** @type {import('./ScriptExecution').ScriptExecutionResult} */
  let result = { logs: [] }
  try {
    const logError = (error, ...args) => console.error(...args, error)
    const sandbox = {
      fetch,
      say: (...args) => result.logs.push(util.format(...args)),
      state: {},
    }

    const vm = new VM({ timeout: 480, sandbox })

    if (options.program) {
      vm.run(options.program)
    }

    const previousState = options.state || '{}'
    try {
      vm.run('state = (' + previousState + ')')
    } catch (error) {
      logError(error, 'Cannot restore state.')
    }

    let runResult = vm.run(options.code)
    const returned = await runResult
    result.output = util.inspect(returned, { depth: 5 })
    try {
      const nextState = serialize(vm.run('state'))
      if (previousState !== nextState) {
        result.nextState = nextState
      }
    } catch (error) {
      logError(error, 'Cannot serialize next state.')
    }
  } catch (error) {
    result.error = String((error && error.stack) || error)
  }
  callback(null, result)
}
