const workerFarm = require('worker-farm')
require('./ScriptExecutorWorker')

const farmOptions = {
  workerOptions: {
    execArgv: ['--max-old-space-size=32'],
  },
  maxConcurrentWorkers: 1,
  maxConcurrentCallsPerWorker: 1,
  maxCallTime: process.env.NODE_ENV === 'test' ? 800 : 3000,
  maxRetries: 0,
  autoStart: true,
}

const workers = workerFarm(
  farmOptions,
  require.resolve('./ScriptExecutorWorker'),
)

/**
 * @param {import('./ScriptExecution').ScriptExecutionInput} options
 * @return {Promise<import('./ScriptExecution').ScriptExecutionResult>}
 */
async function execute(options) {
  const result = {
    logs: [],
  }
  try {
    const returned = await new Promise((resolve, reject) => {
      workers(options, (err, out) => {
        if (err) return reject(err)
        resolve(out)
      })
    })
    Object.assign(result, returned)
  } catch (error) {
    result.error = String((error && error.stack) || error)
  }
  return result
}

exports.execute = execute

/**
 * Ends the worker farm. Call only in tests.
 */
exports.destroy = () => {
  try {
    workerFarm.end(workers)
  } catch (error) {
    console.error('Cannot end worker farm', error)
  }
}
