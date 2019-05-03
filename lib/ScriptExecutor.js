const workerFarm = require('worker-farm')
const workers = workerFarm(require.resolve('./ScriptExecutorWorker'))

exports.execute = async function execute(code) {
  return await new Promise((resolve, reject) => {
    workers({ code }, (err, out) => {
      if (err) return reject(err)
      resolve(out)
    })
  })
}