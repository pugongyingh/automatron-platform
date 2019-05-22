const { VM, VMScript } = require('vm2')
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
      say: (format, ...args) => result.logs.push(util.format(format, ...args)),
      state: {},
    }

    const vm = new VM({ timeout: 480, sandbox })

    if (options.program) {
      const programScript = new VMScript(options.program, '/bot/program.js')
      vm.run(programScript)
    }

    const previousState = options.state || '{}'
    try {
      vm.run('state = (' + previousState + ')')
    } catch (error) {
      logError(error, 'Cannot restore state.')
    }

    const runCode = [
      '(',
      function botHandler(event) {
        // @ts-ignore
        if (typeof bot !== 'undefined') {
          // @ts-ignore
          return bot(event)
        } else {
          return defaultBotHandler()
        }

        function defaultBotHandler() {
          if (event.message.type !== 'text') {
            // @ts-ignore
            say(`Sorry, I don’t handle messages of type ${event.message.type}`)
            return
          }
          return eval(event.message.text + '\n//# sourceURL=/bot/input.js')
        }
      },
      ')(',
      options.event,
      ')',
    ].join('')
    const inputScript = new VMScript(runCode, '/bot/run.js')
    let runResult = vm.run(inputScript)
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
