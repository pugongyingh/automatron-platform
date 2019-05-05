const workerFarm = require('worker-farm')
const v8 = require('v8')
require('./ScriptExecutorWorker')

const farmOptions = {
  workerOptions: {
    execArgv: ['--max-old-space-size=32'],
  },
  maxConcurrentWorkers: 1,
  maxConcurrentCallsPerWorker: 1,
  maxCallTime: 3000,
  maxRetries: 0,
  autoStart: true,
}

const workers = workerFarm(
  farmOptions,
  require.resolve('./ScriptExecutorWorker'),
)

/**
 * @param {object} options
 * @param {string} options.code
 */
async function execute(options) {
  const result = await new Promise((resolve, reject) => {
    workers(options, (err, out) => {
      if (err) return reject(err)
      resolve(out)
    })
  })
  return v8.deserialize(Buffer.from(result, 'base64'))
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
