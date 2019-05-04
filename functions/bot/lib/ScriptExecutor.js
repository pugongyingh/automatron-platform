const workerFarm = require('worker-farm')
require('./ScriptExecutorWorker')

const farmOptions = {
  workerOptions: {
    execArgv: ['--max-old-space-size=32']
  },
  maxConcurrentWorkers: 1,
  maxConcurrentCallsPerWorker: 1,
  maxCallTime: 3000,
  maxRetries: 0,
  autoStart: true
}

const workers = workerFarm(farmOptions, require.resolve('./ScriptExecutorWorker'))

/**
 * @param {object} options
 * @param {string} options.code
 */
async function execute(options) {
  return await new Promise((resolve, reject) => {
    workers(options, (err, out) => {
      if (err) return reject(err)
      resolve(out)
    })
  })
}

exports.execute = execute

/**
 * Ends the worker farm. Call only in tests.
 */
exports.destroy = () => {
  try {
    workerFarm.end(workers)
  } catch (error) {
    if (String(error) === 'TypeError: setTimeout(...).unref is not a function') {
      // known error
    } else {
      console.error('Cannot end worker farm', error)
    }
  }
}