const workerFarm = require('worker-farm')
require('./ScriptExecutorWorker')

const farmOptions = {
  maxConcurrentWorkers: 1,
  maxConcurrentCallsPerWorker: 1,
  maxCallTime: 3000,
  maxRetries: 1,
  autoStart: true
}
const workers = workerFarm(farmOptions, require.resolve('./ScriptExecutorWorker'))

exports.execute = async function execute(code) {
  return await new Promise((resolve, reject) => {
    workers({ code }, (err, out) => {
      if (err) return reject(err)
      resolve(out)
    })
  })
}